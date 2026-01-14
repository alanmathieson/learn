"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ProgressBadge } from "./progress-badge"
import { ProgressStatus, PROGRESS_STATUS_CONFIG, TopicPriority, TOPIC_PRIORITY_CONFIG } from "@/types"
import { ChevronDown, ChevronRight, Clock, Save, Star, AlertTriangle } from "lucide-react"

interface TopicCardProps {
  id: string
  code: string | null
  title: string
  description?: string | null
  estimatedHours?: number | null
  priority: TopicPriority
  status: ProgressStatus
  notes?: string | null
  confidenceLevel?: number | null
  children?: TopicCardProps[]
  onStatusChange?: (id: string, status: ProgressStatus) => void
  onNotesChange?: (id: string, notes: string) => void
  onConfidenceChange?: (id: string, level: number) => void
  onPriorityChange?: (id: string, priority: TopicPriority) => void
  depth?: number
}

export function TopicCard({
  id,
  code,
  title,
  description,
  estimatedHours,
  priority,
  status,
  notes,
  confidenceLevel,
  children,
  onStatusChange,
  onNotesChange,
  onConfidenceChange,
  onPriorityChange,
  depth = 0,
}: TopicCardProps) {
  const [isOpen, setIsOpen] = useState(depth === 0)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [localNotes, setLocalNotes] = useState(notes || "")
  const hasChildren = children && children.length > 0

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(id, newStatus as ProgressStatus)
  }

  const handleSaveNotes = () => {
    onNotesChange?.(id, localNotes)
  }

  const handleConfidenceChange = (level: number) => {
    onConfidenceChange?.(id, level)
  }

  const handlePriorityChange = (newPriority: string) => {
    onPriorityChange?.(id, newPriority as TopicPriority)
  }

  return (
    <div id={`topic-${id}`} className={`${depth > 0 ? "ml-4 border-l-2 border-muted pl-4" : ""} scroll-mt-20`}>
      <Card className={`mb-2 ${depth === 0 ? "border-2" : "border"}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 mt-0.5"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {code && (
                      <span className="text-sm font-mono text-muted-foreground">
                        {code}
                      </span>
                    )}
                    <h3 className={`font-medium ${depth === 0 ? "text-lg" : "text-base"}`}>
                      {title}
                    </h3>
                  </div>
                  {description && (
                    <p className="text-sm text-muted-foreground mb-2">{description}</p>
                  )}
                  {estimatedHours && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{estimatedHours}h estimated</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Select value={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className={`h-3.5 w-3.5 ${TOPIC_PRIORITY_CONFIG[priority].color}`} />
                          <span className="text-sm">{TOPIC_PRIORITY_CONFIG[priority].label} Priority</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TOPIC_PRIORITY_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`h-3.5 w-3.5 ${config.color}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue>
                        <ProgressBadge status={status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROGRESS_STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${config.bgColor}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Confidence Rating */}
              {!hasChildren && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-muted-foreground">Confidence:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleConfidenceChange(level)}
                        className={`p-1 rounded hover:bg-muted transition-colors ${
                          confidenceLevel && confidenceLevel >= level
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Star
                          className="h-4 w-4"
                          fill={confidenceLevel && confidenceLevel >= level ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {!hasChildren && (
                <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                      {isNotesOpen ? (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-1" />
                      )}
                      {notes ? "View Notes" : "Add Notes"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <Textarea
                      placeholder="Add your revision notes here..."
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={handleSaveNotes}
                      disabled={localNotes === (notes || "")}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Notes
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Topics */}
      {hasChildren && isOpen && (
        <div className="mt-2">
          {children.map((child) => (
            <TopicCard
              key={child.id}
              {...child}
              depth={depth + 1}
              onStatusChange={onStatusChange}
              onNotesChange={onNotesChange}
              onConfidenceChange={onConfidenceChange}
              onPriorityChange={onPriorityChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
