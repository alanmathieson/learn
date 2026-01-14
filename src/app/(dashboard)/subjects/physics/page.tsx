"use client"

import { useMemo } from "react"
import { Header } from "@/components/layout/header"
import { SyllabusHelp } from "@/components/help/syllabus-help"
import { TopicTree } from "@/components/syllabus/topic-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Atom, BookOpen, Clock, Target } from "lucide-react"
import { useTopics } from "@/hooks/use-topics"
import { useSubject } from "@/hooks/use-subject"
import { useScheduledSessions } from "@/hooks/use-scheduled-sessions"

const PHYSICS_SUBJECT_ID = "11111111-1111-1111-1111-111111111111"

export default function PhysicsPage() {
  const { topics, loading, error, updateStatus, updateNotes, updateConfidence, updatePriority } = useTopics({
    subjectId: PHYSICS_SUBJECT_ID,
  })
  const { subject, stats } = useSubject(PHYSICS_SUBJECT_ID)
  const { sessions } = useScheduledSessions()

  // Build map of topic_id -> scheduled dates
  const scheduledDates = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const session of sessions) {
      if (!map[session.topic_id]) {
        map[session.topic_id] = []
      }
      map[session.topic_id].push(session.scheduled_date)
    }
    // Sort dates for each topic
    for (const dates of Object.values(map)) {
      dates.sort()
    }
    return map
  }, [sessions])

  if (error) {
    return (
      <>
        <Header title="Physics" helpContent={<SyllabusHelp />} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <Card className="p-6">
              <p className="text-destructive">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure you&apos;re signed in and your user exists in the database.
              </p>
            </Card>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="Physics" helpContent={<SyllabusHelp />} />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Subject Header */}
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Atom className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Physics</h2>
                  <p className="text-muted-foreground mb-4">
                    Cambridge International (CIE) • 9702
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">25 topics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">~85 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {stats.completedTopics} / {stats.totalTopics} complete
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress value={stats.progressPercent} className="h-3 flex-1" />
                    <span className="text-sm font-medium w-12">{stats.progressPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <Badge variant="outline">Paper 1 - Multiple Choice • 3 Jun</Badge>
                <Badge variant="outline">Paper 2 - AS Structured • 20 May</Badge>
                <Badge variant="outline">Paper 3 - Practical • 28 Apr</Badge>
                <Badge variant="outline">Paper 4 - A Level Structured • 11 May</Badge>
                <Badge variant="outline">Paper 5 - Planning & Analysis • 20 May</Badge>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              {/* AS Level Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge>AS Level</Badge>
                  Topics 1-11
                </h3>
                <TopicTree
                  topics={topics.filter((t) => {
                    const code = parseInt(t.code || "0")
                    return code >= 1 && code <= 11
                  })}
                  scheduledDates={scheduledDates}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                  onPriorityChange={updatePriority}
                />
              </div>

              {/* A Level Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">A Level</Badge>
                  Topics 12-25
                </h3>
                <TopicTree
                  topics={topics.filter((t) => {
                    const code = parseInt(t.code || "0")
                    return code >= 12 && code <= 25
                  })}
                  scheduledDates={scheduledDates}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                  onPriorityChange={updatePriority}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
