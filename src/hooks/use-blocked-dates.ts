"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"

export interface BlockedDate {
  id: string
  date: string
  reason: string | null
  createdAt: string
}

interface CreateBlockedDateInput {
  date: Date
  reason?: string | null
}

export function useBlockedDates() {
  const { user } = useUser()
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null)

  // Fetch the Supabase user ID from Clerk ID (needed for creating new records)
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

  // Fetch ALL blocked dates (global - not filtered by user)
  useEffect(() => {
    async function fetchBlockedDates() {
      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("blocked_dates")
        .select("*")
        .order("date", { ascending: true })

      if (fetchError) {
        console.error("Error fetching blocked dates:", fetchError)
        setError("Failed to fetch blocked dates")
        setLoading(false)
        return
      }

      setBlockedDates(
        data.map((item) => ({
          id: item.id,
          date: item.date,
          reason: item.reason,
          createdAt: item.created_at,
        }))
      )
      setLoading(false)
    }

    fetchBlockedDates()
  }, [])

  // Create blocked date
  const createBlockedDate = useCallback(
    async (input: CreateBlockedDateInput): Promise<BlockedDate | null> => {
      if (!supabaseUserId) return null

      const supabase = createClient()
      const dateString = input.date.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from("blocked_dates")
        .insert({
          user_id: supabaseUserId,
          date: dateString,
          reason: input.reason || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating blocked date:", error)
        return null
      }

      const newBlockedDate: BlockedDate = {
        id: data.id,
        date: data.date,
        reason: data.reason,
        createdAt: data.created_at,
      }

      setBlockedDates((prev) =>
        [...prev, newBlockedDate].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      )
      return newBlockedDate
    },
    [supabaseUserId]
  )

  // Delete blocked date (any user can delete any blocked date)
  const deleteBlockedDate = useCallback(
    async (blockedDateId: string): Promise<boolean> => {
      const supabase = createClient()

      const { error } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("id", blockedDateId)

      if (error) {
        console.error("Error deleting blocked date:", error)
        return false
      }

      setBlockedDates((prev) => prev.filter((item) => item.id !== blockedDateId))
      return true
    },
    []
  )

  // Bulk create blocked dates (for quick add feature)
  const createBlockedDates = useCallback(
    async (dates: CreateBlockedDateInput[]): Promise<boolean> => {
      if (!supabaseUserId) return false

      const supabase = createClient()

      const { data, error } = await supabase
        .from("blocked_dates")
        .insert(
          dates.map((input) => ({
            user_id: supabaseUserId,
            date: input.date.toISOString().split('T')[0],
            reason: input.reason || null,
          }))
        )
        .select()

      if (error) {
        console.error("Error creating blocked dates:", error)
        return false
      }

      const newBlockedDates: BlockedDate[] = data.map((item) => ({
        id: item.id,
        date: item.date,
        reason: item.reason,
        createdAt: item.created_at,
      }))

      setBlockedDates((prev) =>
        [...prev, ...newBlockedDates].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      )
      return true
    },
    [supabaseUserId]
  )

  return {
    blockedDates,
    loading,
    error,
    createBlockedDate,
    deleteBlockedDate,
    createBlockedDates,
  }
}
