"use client"

import { Header } from "@/components/layout/header"
import { SyllabusHelp } from "@/components/help/syllabus-help"
import { TopicTree } from "@/components/syllabus/topic-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calculator, BookOpen, Clock, Target } from "lucide-react"
import { useTopics } from "@/hooks/use-topics"
import { useSubject } from "@/hooks/use-subject"

const MATHS_SUBJECT_ID = "22222222-2222-2222-2222-222222222222"

export default function MathsPage() {
  const { topics, loading, error, updateStatus, updateNotes, updateConfidence } = useTopics({
    subjectId: MATHS_SUBJECT_ID,
  })
  const { stats } = useSubject(MATHS_SUBJECT_ID)

  // Filter topics by type based on code
  const pureTopics = topics.filter((t) => {
    const code = t.code || ""
    return /^\d+$/.test(code) // Pure maths topics are numbered 1-10
  })

  const statsTopics = topics.filter((t) => {
    const code = t.code || ""
    return code.startsWith("S") // Statistics topics start with S
  })

  const mechTopics = topics.filter((t) => {
    const code = t.code || ""
    return code.startsWith("M") // Mechanics topics start with M
  })

  if (error) {
    return (
      <>
        <Header title="Mathematics" helpContent={<SyllabusHelp />} />
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
      <Header title="Mathematics" helpContent={<SyllabusHelp />} />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Subject Header */}
          <Card className="mb-6 border-2 border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                  <Calculator className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Mathematics</h2>
                  <p className="text-muted-foreground mb-4">
                    Pearson Edexcel • 9MA0
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">19 topics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">~72 hours</span>
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
                <Badge variant="outline">Paper 1 - Pure Maths 1 • 3 Jun</Badge>
                <Badge variant="outline">Paper 2 - Pure Maths 2 • 11 Jun</Badge>
                <Badge variant="outline">Paper 3 - Stats & Mechanics • 18 Jun</Badge>
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
              {/* Pure Mathematics Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge className="bg-emerald-500">Pure Mathematics</Badge>
                  Papers 1 & 2
                </h3>
                <TopicTree
                  topics={pureTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>

              {/* Statistics Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Statistics</Badge>
                  Paper 3, Section A
                </h3>
                <TopicTree
                  topics={statsTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>

              {/* Mechanics Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Mechanics</Badge>
                  Paper 3, Section B
                </h3>
                <TopicTree
                  topics={mechTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
