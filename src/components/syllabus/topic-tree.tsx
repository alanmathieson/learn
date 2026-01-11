"use client"

import { useState, useCallback } from "react"
import { TopicCard } from "./topic-card"
import { ProgressStatus } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface TopicNode {
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

interface TopicTreeProps {
  topics: TopicNode[]
  onStatusChange?: (id: string, status: ProgressStatus) => void
  onNotesChange?: (id: string, notes: string) => void
  onConfidenceChange?: (id: string, level: number) => void
}

export function TopicTree({
  topics,
  onStatusChange,
  onNotesChange,
  onConfidenceChange,
}: TopicTreeProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Filter topics recursively
  const filterTopics = useCallback(
    (items: TopicNode[]): TopicNode[] => {
      const result: TopicNode[] = []

      for (const topic of items) {
        // Filter children first
        const filteredChildren = topic.children
          ? filterTopics(topic.children)
          : undefined

        // Check if this topic matches the filters
        const matchesSearch =
          searchQuery === "" ||
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.code?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
          statusFilter === "all" || topic.status === statusFilter

        // Include this topic if it matches OR if any children match
        const hasMatchingChildren =
          filteredChildren && filteredChildren.length > 0

        if ((matchesSearch && matchesStatus) || hasMatchingChildren) {
          result.push({
            ...topic,
            children: filteredChildren,
          })
        }
      }

      return result
    },
    [searchQuery, statusFilter]
  )

  const filteredTopics = filterTopics(topics)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="needs_review">Needs Review</SelectItem>
            <SelectItem value="confident">Confident</SelectItem>
            <SelectItem value="mastered">Mastered</SelectItem>
          </SelectContent>
        </Select>
        {(searchQuery || statusFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Topic List */}
      <div className="space-y-2">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No topics found matching your filters.</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              {...topic}
              onStatusChange={onStatusChange}
              onNotesChange={onNotesChange}
              onConfidenceChange={onConfidenceChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
