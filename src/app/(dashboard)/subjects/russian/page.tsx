"use client"

import { Header } from "@/components/layout/header"
import { SyllabusHelp } from "@/components/help/syllabus-help"
import { TopicTree } from "@/components/syllabus/topic-tree"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Languages, BookOpen, Clock, Target, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTopics } from "@/hooks/use-topics"
import { useSubject } from "@/hooks/use-subject"

const RUSSIAN_SUBJECT_ID = "33333333-3333-3333-3333-333333333333"

export default function RussianPage() {
  const { topics, loading, error, updateStatus, updateNotes, updateConfidence } = useTopics({
    subjectId: RUSSIAN_SUBJECT_ID,
  })
  const { stats } = useSubject(RUSSIAN_SUBJECT_ID)

  // Filter topics by type based on code
  const themeTopics = topics.filter((t) => {
    const code = t.code || ""
    return code.startsWith("T") // Theme topics start with T
  })

  const skillsTopics = topics.filter((t) => {
    const code = t.code || ""
    return code.startsWith("SK") // Skills topics start with SK
  })

  const literaryTopics = topics.filter((t) => {
    const code = t.code || ""
    return code.startsWith("LIT") // Literary topics start with LIT
  })

  const grammarTopics = topics.filter((t) => {
    const code = t.code || ""
    return code.startsWith("GR") // Grammar topics start with GR
  })

  const otherTopics = topics.filter((t) => {
    const code = t.code || ""
    return code === "IRP" // Independent Research Project
  })

  if (error) {
    return (
      <>
        <Header title="Russian" helpContent={<SyllabusHelp />} />
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
      <Header title="Russian" helpContent={<SyllabusHelp />} />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6 border-2 border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-100 text-red-600">
                  <Languages className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Russian</h2>
                  <p className="text-muted-foreground mb-4">Pearson Edexcel • 9RU0</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">14 topics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">~60 hours</span>
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
                <Badge variant="outline">Paper 1 - Listening & Reading • 1 Jun</Badge>
                <Badge variant="outline">Paper 2 - Written Response • 8 Jun</Badge>
                <Badge variant="outline">Paper 3 - Speaking • Apr/May</Badge>
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Literary Works Pending</AlertTitle>
            <AlertDescription>
              The literary works for Paper 2 need to be confirmed. Please let us know which texts/films have been chosen.
            </AlertDescription>
          </Alert>

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
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge className="bg-red-500">Themes</Badge>
                  Papers 1 & 2
                </h3>
                <TopicTree
                  topics={themeTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Language Skills</Badge>
                  All Papers
                </h3>
                <TopicTree
                  topics={skillsTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Literary Works</Badge>
                  Paper 2
                </h3>
                <TopicTree
                  topics={literaryTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Grammar</Badge>
                  All Papers
                </h3>
                <TopicTree
                  topics={grammarTopics}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onConfidenceChange={updateConfidence}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Speaking Exam</Badge>
                  Paper 3
                </h3>
                <TopicTree
                  topics={otherTopics}
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
