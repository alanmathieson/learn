"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { Topic, TopicProgress, ProgressStatus } from "@/types"

export interface TopicNode {
  id: string
  code: string | null
  title: string
  description?: string | null
  estimatedHours?: number | null
  status: ProgressStatus
  notes?: string | null
  confidenceLevel?: number | null
  children?: TopicNode[]
}

interface UseTopicsOptions {
  subjectId: string
}

export function useTopics({ subjectId }: UseTopicsOptions) {
  const { user } = useUser()
  const [topics, setTopics] = useState<TopicNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null)

  // Fetch the Supabase user ID from Clerk ID
  useEffect(() => {
    async function fetchSupabaseUser() {
      if (!user?.id) return

      const supabase = createClient()
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single()

      if (error) {
        console.error("Error fetching Supabase user:", error)
        setError("User not found in database")
        return
      }

      setSupabaseUserId(data.id)
    }

    fetchSupabaseUser()
  }, [user?.id])

  // Fetch topics with progress
  useEffect(() => {
    async function fetchTopics() {
      if (!supabaseUserId) return

      setLoading(true)
      const supabase = createClient()

      // Fetch all topics for this subject
      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select("*")
        .eq("subject_id", subjectId)
        .order("order_index")

      if (topicsError) {
        console.error("Error fetching topics:", topicsError)
        setError("Failed to fetch topics")
        setLoading(false)
        return
      }

      // Fetch progress for these topics
      const topicIds = topicsData.map((t) => t.id)
      const { data: progressData, error: progressError } = await supabase
        .from("topic_progress")
        .select("*")
        .eq("user_id", supabaseUserId)
        .in("topic_id", topicIds)

      if (progressError) {
        console.error("Error fetching progress:", progressError)
      }

      // Create a map of progress by topic ID
      const progressMap = new Map<string, TopicProgress>()
      if (progressData) {
        for (const p of progressData) {
          progressMap.set(p.topic_id, p)
        }
      }

      // Build the tree structure
      const topicMap = new Map<string, TopicNode>()
      const rootTopics: TopicNode[] = []

      // First pass: create all nodes
      for (const topic of topicsData) {
        const progress = progressMap.get(topic.id)
        const node: TopicNode = {
          id: topic.id,
          code: topic.code,
          title: topic.title,
          description: topic.description,
          estimatedHours: topic.estimated_hours,
          status: progress?.status || "not_started",
          notes: progress?.notes || null,
          confidenceLevel: progress?.confidence_level || null,
          children: [],
        }
        topicMap.set(topic.id, node)
      }

      // Second pass: build tree
      for (const topic of topicsData) {
        const node = topicMap.get(topic.id)!
        if (topic.parent_id && topicMap.has(topic.parent_id)) {
          topicMap.get(topic.parent_id)!.children!.push(node)
        } else if (!topic.parent_id) {
          rootTopics.push(node)
        }
      }

      setTopics(rootTopics)
      setLoading(false)
    }

    fetchTopics()
  }, [subjectId, supabaseUserId])

  // Update status
  const updateStatus = useCallback(
    async (topicId: string, status: ProgressStatus) => {
      if (!supabaseUserId) return

      const supabase = createClient()

      // Upsert the progress record
      const { error } = await supabase.from("topic_progress").upsert(
        {
          user_id: supabaseUserId,
          topic_id: topicId,
          status,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,topic_id",
        }
      )

      if (error) {
        console.error("Error updating status:", error)
        return
      }

      // Update local state
      setTopics((prev) => updateTopicInTree(prev, topicId, { status }))
    },
    [supabaseUserId]
  )

  // Update notes
  const updateNotes = useCallback(
    async (topicId: string, notes: string) => {
      if (!supabaseUserId) return

      const supabase = createClient()

      const { error } = await supabase.from("topic_progress").upsert(
        {
          user_id: supabaseUserId,
          topic_id: topicId,
          notes,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,topic_id",
        }
      )

      if (error) {
        console.error("Error updating notes:", error)
        return
      }

      setTopics((prev) => updateTopicInTree(prev, topicId, { notes }))
    },
    [supabaseUserId]
  )

  // Update confidence level
  const updateConfidence = useCallback(
    async (topicId: string, confidenceLevel: number) => {
      if (!supabaseUserId) return

      const supabase = createClient()

      const { error } = await supabase.from("topic_progress").upsert(
        {
          user_id: supabaseUserId,
          topic_id: topicId,
          confidence_level: confidenceLevel,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,topic_id",
        }
      )

      if (error) {
        console.error("Error updating confidence:", error)
        return
      }

      setTopics((prev) =>
        updateTopicInTree(prev, topicId, { confidenceLevel })
      )
    },
    [supabaseUserId]
  )

  return {
    topics,
    loading,
    error,
    updateStatus,
    updateNotes,
    updateConfidence,
  }
}

// Helper function to update a topic in the tree
function updateTopicInTree(
  topics: TopicNode[],
  topicId: string,
  updates: Partial<TopicNode>
): TopicNode[] {
  return topics.map((topic) => {
    if (topic.id === topicId) {
      return { ...topic, ...updates }
    }
    if (topic.children && topic.children.length > 0) {
      return {
        ...topic,
        children: updateTopicInTree(topic.children, topicId, updates),
      }
    }
    return topic
  })
}
