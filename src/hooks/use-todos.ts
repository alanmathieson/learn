"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { TodoPriority } from "@/types"

export interface Todo {
  id: string
  title: string
  description: string | null
  priority: TodoPriority
  dueDate: string | null
  completed: boolean
  completedAt: string | null
  subjectId: string | null
  createdAt: string
}

interface CreateTodoInput {
  title: string
  description?: string | null
  priority: TodoPriority
  dueDate?: Date | null
  subjectId?: string | null
}

interface UpdateTodoInput {
  title?: string
  description?: string | null
  priority?: TodoPriority
  dueDate?: Date | null
  subjectId?: string | null
  completed?: boolean
}

export function useTodos() {
  const { user } = useUser()
  const [todos, setTodos] = useState<Todo[]>([])
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

  // Fetch todos
  useEffect(() => {
    async function fetchTodos() {
      if (!supabaseUserId) return

      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("adhoc_todos")
        .select("*")
        .eq("user_id", supabaseUserId)
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Error fetching todos:", fetchError)
        setError("Failed to fetch todos")
        setLoading(false)
        return
      }

      setTodos(
        data.map((todo) => ({
          id: todo.id,
          title: todo.title,
          description: todo.description,
          priority: todo.priority as TodoPriority,
          dueDate: todo.due_date,
          completed: todo.completed,
          completedAt: todo.completed_at,
          subjectId: todo.subject_id,
          createdAt: todo.created_at,
        }))
      )
      setLoading(false)
    }

    fetchTodos()
  }, [supabaseUserId])

  // Create todo
  const createTodo = useCallback(
    async (input: CreateTodoInput): Promise<Todo | null> => {
      if (!supabaseUserId) return null

      const supabase = createClient()

      const { data, error } = await supabase
        .from("adhoc_todos")
        .insert({
          user_id: supabaseUserId,
          title: input.title,
          description: input.description || null,
          priority: input.priority,
          due_date: input.dueDate ? input.dueDate.toISOString().split('T')[0] : null,
          subject_id: input.subjectId || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating todo:", error)
        return null
      }

      const newTodo: Todo = {
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority as TodoPriority,
        dueDate: data.due_date,
        completed: data.completed,
        completedAt: data.completed_at,
        subjectId: data.subject_id,
        createdAt: data.created_at,
      }

      setTodos((prev) => [newTodo, ...prev])
      return newTodo
    },
    [supabaseUserId]
  )

  // Update todo
  const updateTodo = useCallback(
    async (todoId: string, input: UpdateTodoInput): Promise<boolean> => {
      if (!supabaseUserId) return false

      const supabase = createClient()

      const updateData: Record<string, unknown> = {}
      if (input.title !== undefined) updateData.title = input.title
      if (input.description !== undefined) updateData.description = input.description
      if (input.priority !== undefined) updateData.priority = input.priority
      if (input.dueDate !== undefined) {
        updateData.due_date = input.dueDate ? input.dueDate.toISOString().split('T')[0] : null
      }
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId
      if (input.completed !== undefined) {
        updateData.completed = input.completed
        updateData.completed_at = input.completed ? new Date().toISOString() : null
      }

      const { data, error } = await supabase
        .from("adhoc_todos")
        .update(updateData)
        .eq("id", todoId)
        .eq("user_id", supabaseUserId)
        .select()
        .single()

      if (error) {
        console.error("Error updating todo:", error)
        return false
      }

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                title: data.title,
                description: data.description,
                priority: data.priority as TodoPriority,
                dueDate: data.due_date,
                completed: data.completed,
                completedAt: data.completed_at,
                subjectId: data.subject_id,
              }
            : todo
        )
      )

      return true
    },
    [supabaseUserId]
  )

  // Toggle todo completion
  const toggleTodo = useCallback(
    async (todoId: string): Promise<boolean> => {
      const todo = todos.find((t) => t.id === todoId)
      if (!todo) return false

      return updateTodo(todoId, { completed: !todo.completed })
    },
    [todos, updateTodo]
  )

  // Delete todo
  const deleteTodo = useCallback(
    async (todoId: string): Promise<boolean> => {
      if (!supabaseUserId) return false

      const supabase = createClient()

      const { error } = await supabase
        .from("adhoc_todos")
        .delete()
        .eq("id", todoId)
        .eq("user_id", supabaseUserId)

      if (error) {
        console.error("Error deleting todo:", error)
        return false
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== todoId))
      return true
    },
    [supabaseUserId]
  )

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  }
}
