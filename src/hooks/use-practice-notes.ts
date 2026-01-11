"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { NoteType } from "@/types"

export interface PracticeNote {
  id: string
  title: string
  content: string | null
  noteType: NoteType
  subjectId: string | null
  topicId: string | null
  createdAt: string
  updatedAt: string
}

interface CreateNoteInput {
  title: string
  content: string
  noteType: NoteType
  subjectId?: string | null
  topicId?: string | null
}

interface UpdateNoteInput {
  title?: string
  content?: string
  noteType?: NoteType
  subjectId?: string | null
  topicId?: string | null
}

export function usePracticeNotes() {
  const { user } = useUser()
  const [notes, setNotes] = useState<PracticeNote[]>([])
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

  // Fetch notes
  useEffect(() => {
    async function fetchNotes() {
      if (!supabaseUserId) return

      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("practice_notes")
        .select("*")
        .eq("user_id", supabaseUserId)
        .order("updated_at", { ascending: false })

      if (fetchError) {
        console.error("Error fetching notes:", fetchError)
        setError("Failed to fetch notes")
        setLoading(false)
        return
      }

      setNotes(
        data.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          noteType: note.note_type as NoteType,
          subjectId: note.subject_id,
          topicId: note.topic_id,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
        }))
      )
      setLoading(false)
    }

    fetchNotes()
  }, [supabaseUserId])

  // Create note
  const createNote = useCallback(
    async (input: CreateNoteInput): Promise<PracticeNote | null> => {
      if (!supabaseUserId) return null

      const supabase = createClient()

      const { data, error } = await supabase
        .from("practice_notes")
        .insert({
          user_id: supabaseUserId,
          title: input.title,
          content: input.content,
          note_type: input.noteType,
          subject_id: input.subjectId || null,
          topic_id: input.topicId || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating note:", error)
        return null
      }

      const newNote: PracticeNote = {
        id: data.id,
        title: data.title,
        content: data.content,
        noteType: data.note_type as NoteType,
        subjectId: data.subject_id,
        topicId: data.topic_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      setNotes((prev) => [newNote, ...prev])
      return newNote
    },
    [supabaseUserId]
  )

  // Update note
  const updateNote = useCallback(
    async (noteId: string, input: UpdateNoteInput): Promise<boolean> => {
      if (!supabaseUserId) return false

      const supabase = createClient()

      const updateData: Record<string, unknown> = {}
      if (input.title !== undefined) updateData.title = input.title
      if (input.content !== undefined) updateData.content = input.content
      if (input.noteType !== undefined) updateData.note_type = input.noteType
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId
      if (input.topicId !== undefined) updateData.topic_id = input.topicId

      const { data, error } = await supabase
        .from("practice_notes")
        .update(updateData)
        .eq("id", noteId)
        .eq("user_id", supabaseUserId)
        .select()
        .single()

      if (error) {
        console.error("Error updating note:", error)
        return false
      }

      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? {
                ...note,
                title: data.title,
                content: data.content,
                noteType: data.note_type as NoteType,
                subjectId: data.subject_id,
                topicId: data.topic_id,
                updatedAt: data.updated_at,
              }
            : note
        )
      )

      return true
    },
    [supabaseUserId]
  )

  // Delete note
  const deleteNote = useCallback(
    async (noteId: string): Promise<boolean> => {
      if (!supabaseUserId) return false

      const supabase = createClient()

      const { error } = await supabase
        .from("practice_notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", supabaseUserId)

      if (error) {
        console.error("Error deleting note:", error)
        return false
      }

      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      return true
    },
    [supabaseUserId]
  )

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    supabaseUserId,
  }
}

// Hook for fetching a single note
export function usePracticeNote(noteId: string) {
  const { user } = useUser()
  const [note, setNote] = useState<PracticeNote | null>(null)
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

  // Fetch note
  useEffect(() => {
    async function fetchNote() {
      if (!supabaseUserId || !noteId) return

      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("practice_notes")
        .select("*")
        .eq("id", noteId)
        .eq("user_id", supabaseUserId)
        .single()

      if (fetchError) {
        console.error("Error fetching note:", fetchError)
        setError("Note not found")
        setLoading(false)
        return
      }

      setNote({
        id: data.id,
        title: data.title,
        content: data.content,
        noteType: data.note_type as NoteType,
        subjectId: data.subject_id,
        topicId: data.topic_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      })
      setLoading(false)
    }

    fetchNote()
  }, [noteId, supabaseUserId])

  // Update note
  const updateNote = useCallback(
    async (input: UpdateNoteInput): Promise<boolean> => {
      if (!supabaseUserId || !noteId) return false

      const supabase = createClient()

      const updateData: Record<string, unknown> = {}
      if (input.title !== undefined) updateData.title = input.title
      if (input.content !== undefined) updateData.content = input.content
      if (input.noteType !== undefined) updateData.note_type = input.noteType
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId
      if (input.topicId !== undefined) updateData.topic_id = input.topicId

      const { data, error } = await supabase
        .from("practice_notes")
        .update(updateData)
        .eq("id", noteId)
        .eq("user_id", supabaseUserId)
        .select()
        .single()

      if (error) {
        console.error("Error updating note:", error)
        return false
      }

      setNote({
        id: data.id,
        title: data.title,
        content: data.content,
        noteType: data.note_type as NoteType,
        subjectId: data.subject_id,
        topicId: data.topic_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      })

      return true
    },
    [supabaseUserId, noteId]
  )

  return {
    note,
    loading,
    error,
    updateNote,
    supabaseUserId,
  }
}
