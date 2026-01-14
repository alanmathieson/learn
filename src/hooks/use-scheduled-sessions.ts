"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { ScheduledSession, Topic, Subject } from "@/types"

export interface ScheduledSessionWithTopic extends ScheduledSession {
  topic: Topic & { subject: Subject }
}

export function useScheduledSessions() {
  const { user } = useUser()
  const [sessions, setSessions] = useState<ScheduledSessionWithTopic[]>([])
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
        setLoading(false)
        return
      }

      setSupabaseUserId(data.id)
    }

    fetchSupabaseUser()
  }, [user?.id])

  // Fetch ALL scheduled sessions (global)
  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("scheduled_sessions")
        .select(`
          *,
          topic:topics (
            *,
            subject:subjects (*)
          )
        `)
        .order("scheduled_date", { ascending: true })

      if (fetchError) {
        console.error("Error fetching scheduled sessions:", fetchError)
        setError("Failed to fetch scheduled sessions")
        setLoading(false)
        return
      }

      setSessions(
        data.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          topic_id: item.topic_id,
          scheduled_date: item.scheduled_date,
          scheduled_time: item.scheduled_time,
          duration_minutes: item.duration_minutes || 60,
          completed: item.completed || false,
          completed_at: item.completed_at,
          notes: item.notes,
          created_at: item.created_at,
          topic: item.topic,
        }))
      )
      setLoading(false)
    }

    fetchSessions()
  }, [])

  // Mark session as completed
  const markCompleted = useCallback(
    async (sessionId: string, completed: boolean): Promise<boolean> => {
      const supabase = createClient()

      const { error } = await supabase
        .from("scheduled_sessions")
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", sessionId)

      if (error) {
        console.error("Error updating session:", error)
        return false
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, completed, completed_at: completed ? new Date().toISOString() : null }
            : s
        )
      )
      return true
    },
    []
  )

  // Delete a single session
  const deleteSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
      const supabase = createClient()

      const { error } = await supabase
        .from("scheduled_sessions")
        .delete()
        .eq("id", sessionId)

      if (error) {
        console.error("Error deleting session:", error)
        return false
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      return true
    },
    []
  )

  // Delete all sessions (clear schedule)
  const deleteAllSessions = useCallback(async (): Promise<boolean> => {
    const supabase = createClient()

    const { error } = await supabase
      .from("scheduled_sessions")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all rows

    if (error) {
      console.error("Error deleting all sessions:", error)
      return false
    }

    setSessions([])
    return true
  }, [])

  // Bulk create sessions (for schedule generation)
  const createSessions = useCallback(
    async (
      newSessions: Omit<ScheduledSession, "id" | "created_at" | "completed_at">[]
    ): Promise<boolean> => {
      if (!supabaseUserId) return false

      const supabase = createClient()

      const { data, error } = await supabase
        .from("scheduled_sessions")
        .insert(
          newSessions.map((s) => ({
            user_id: supabaseUserId,
            topic_id: s.topic_id,
            scheduled_date: s.scheduled_date,
            scheduled_time: s.scheduled_time,
            duration_minutes: s.duration_minutes,
            completed: false,
            notes: s.notes,
          }))
        )
        .select(`
          *,
          topic:topics (
            *,
            subject:subjects (*)
          )
        `)

      if (error) {
        console.error("Error creating sessions:", error)
        return false
      }

      const mappedSessions: ScheduledSessionWithTopic[] = data.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        topic_id: item.topic_id,
        scheduled_date: item.scheduled_date,
        scheduled_time: item.scheduled_time,
        duration_minutes: item.duration_minutes || 60,
        completed: item.completed || false,
        completed_at: item.completed_at,
        notes: item.notes,
        created_at: item.created_at,
        topic: item.topic,
      }))

      setSessions(mappedSessions.sort((a, b) =>
        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      ))
      return true
    },
    [supabaseUserId]
  )

  return {
    sessions,
    loading,
    error,
    supabaseUserId,
    markCompleted,
    deleteSession,
    deleteAllSessions,
    createSessions,
  }
}
