"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { TopicPriority, ProgressStatus } from "@/types"

export interface TopicForScheduling {
  id: string
  title: string
  subject_id: string
  paper_id: string | null
  estimated_hours: number | null
  priority: TopicPriority
  status: ProgressStatus
}

/**
 * Fetches all topics across all subjects with their progress status.
 * Used by the schedule generator.
 */
export function useAllTopics() {
  const [topics, setTopics] = useState<TopicForScheduling[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllTopics() {
      setLoading(true)
      const supabase = createClient()

      // Fetch all topics
      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select("id, title, subject_id, paper_id, estimated_hours, priority")
        .order("order_index")

      if (topicsError) {
        console.error("Error fetching topics:", topicsError)
        setError("Failed to fetch topics")
        setLoading(false)
        return
      }

      // Fetch all progress records
      const { data: progressData, error: progressError } = await supabase
        .from("topic_progress")
        .select("topic_id, status")

      if (progressError) {
        console.error("Error fetching progress:", progressError)
        // Continue without progress data
      }

      // Create a map of topic_id -> status
      const progressMap = new Map<string, ProgressStatus>()
      if (progressData) {
        for (const p of progressData) {
          if (!progressMap.has(p.topic_id)) {
            progressMap.set(p.topic_id, p.status as ProgressStatus)
          }
        }
      }

      // Combine topics with their status
      const topicsWithStatus: TopicForScheduling[] = topicsData.map((t) => ({
        id: t.id,
        title: t.title,
        subject_id: t.subject_id,
        paper_id: t.paper_id,
        estimated_hours: t.estimated_hours,
        priority: (t.priority as TopicPriority) || "medium",
        status: progressMap.get(t.id) || "not_started",
      }))

      setTopics(topicsWithStatus)
      setLoading(false)
    }

    fetchAllTopics()
  }, [])

  return { topics, loading, error }
}
