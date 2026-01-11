"use client"

import { Badge } from "@/components/ui/badge"
import { ProgressStatus, PROGRESS_STATUS_CONFIG } from "@/types"
import { Check, Circle, Clock, Sparkles, RefreshCw } from "lucide-react"

const statusIcons: Record<ProgressStatus, React.ReactNode> = {
  not_started: <Circle className="h-3 w-3" />,
  in_progress: <Clock className="h-3 w-3" />,
  needs_review: <RefreshCw className="h-3 w-3" />,
  confident: <Sparkles className="h-3 w-3" />,
  mastered: <Check className="h-3 w-3" />,
}

interface ProgressBadgeProps {
  status: ProgressStatus
  showLabel?: boolean
  size?: "sm" | "md"
}

export function ProgressBadge({ status, showLabel = true, size = "sm" }: ProgressBadgeProps) {
  const config = PROGRESS_STATUS_CONFIG[status]

  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} border-current ${
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      }`}
    >
      {statusIcons[status]}
      {showLabel && <span className="ml-1">{config.label}</span>}
    </Badge>
  )
}
