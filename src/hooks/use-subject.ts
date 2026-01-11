"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { Subject, Paper } from "@/types"

interface SubjectWithPapers extends Subject {
  papers: Paper[]
}

interface SubjectStats {
  totalTopics: number
  completedTopics: number
  progressPercent: number
}

export function useSubject(subjectId: string) {
  const { user } = useUser()
  const [subject, setSubject] = useState<SubjectWithPapers | null>(null)
  const [stats, setStats] = useState<SubjectStats>({
    totalTopics: 0,
    completedTopics: 0,
    progressPercent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubjectData() {
      if (!user?.id) return

      const supabase = createClient()

      // Fetch subject with papers
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select(`
          *,
          papers (*)
        `)
        .eq("id", subjectId)
        .single()

      if (subjectError) {
        console.error("Error fetching subject:", subjectError)
        setError("Failed to fetch subject")
        setLoading(false)
        return
      }

      setSubject(subjectData)

      // Get Supabase user ID
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single()

      if (!userData) {
        setLoading(false)
        return
      }

      // Fetch topics and progress for stats
      const { data: topics } = await supabase
        .from("topics")
        .select("id, parent_id")
        .eq("subject_id", subjectId)

      if (!topics) {
        setLoading(false)
        return
      }

      // Only count leaf topics (topics without children)
      const parentIds = new Set(topics.filter(t => t.parent_id).map(t => t.parent_id))
      const leafTopics = topics.filter(t => !parentIds.has(t.id))
      const leafTopicIds = leafTopics.map(t => t.id)

      // Fetch progress for leaf topics
      const { data: progress } = await supabase
        .from("topic_progress")
        .select("topic_id, status")
        .eq("user_id", userData.id)
        .in("topic_id", leafTopicIds)

      const completedStatuses = ["confident", "mastered"]
      const completed = progress?.filter(p =>
        completedStatuses.includes(p.status)
      ).length || 0

      setStats({
        totalTopics: leafTopics.length,
        completedTopics: completed,
        progressPercent: leafTopics.length > 0
          ? Math.round((completed / leafTopics.length) * 100)
          : 0,
      })

      setLoading(false)
    }

    fetchSubjectData()
  }, [subjectId, user?.id])

  return { subject, stats, loading, error }
}

// Hook for all subjects overview
export function useSubjects() {
  const { user } = useUser()
  const [subjects, setSubjects] = useState<SubjectWithPapers[]>([])
  const [statsMap, setStatsMap] = useState<Record<string, SubjectStats>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      if (!user?.id) return

      const supabase = createClient()

      // Fetch all subjects with papers
      const { data: subjectsData, error } = await supabase
        .from("subjects")
        .select(`
          *,
          papers (*)
        `)
        .order("name")

      if (error) {
        console.error("Error fetching subjects:", error)
        setLoading(false)
        return
      }

      setSubjects(subjectsData || [])

      // Get Supabase user ID
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single()

      if (!userData || !subjectsData) {
        setLoading(false)
        return
      }

      // Fetch all topics
      const { data: allTopics } = await supabase
        .from("topics")
        .select("id, subject_id, parent_id")

      if (!allTopics) {
        setLoading(false)
        return
      }

      // Fetch all progress
      const { data: allProgress } = await supabase
        .from("topic_progress")
        .select("topic_id, status")
        .eq("user_id", userData.id)

      const progressMap = new Map(allProgress?.map(p => [p.topic_id, p.status]) || [])

      // Calculate stats per subject
      const newStatsMap: Record<string, SubjectStats> = {}

      for (const subject of subjectsData) {
        const subjectTopics = allTopics.filter(t => t.subject_id === subject.id)
        const parentIds = new Set(subjectTopics.filter(t => t.parent_id).map(t => t.parent_id))
        const leafTopics = subjectTopics.filter(t => !parentIds.has(t.id))

        const completedStatuses = ["confident", "mastered"]
        const completed = leafTopics.filter(t =>
          completedStatuses.includes(progressMap.get(t.id) || "")
        ).length

        newStatsMap[subject.id] = {
          totalTopics: leafTopics.length,
          completedTopics: completed,
          progressPercent: leafTopics.length > 0
            ? Math.round((completed / leafTopics.length) * 100)
            : 0,
        }
      }

      setStatsMap(newStatsMap)
      setLoading(false)
    }

    fetchSubjects()
  }, [user?.id])

  return { subjects, statsMap, loading }
}
