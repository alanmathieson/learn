"use client"

import { Header } from "@/components/layout/header"
import { SubjectsHelp } from "@/components/help/subjects-help"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Atom, Calculator, Languages, ChevronRight, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { useSubjects } from "@/hooks/use-subject"

const subjectConfig = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Physics",
    slug: "physics",
    board: "Cambridge International (CIE)",
    code: "9702",
    icon: <Atom className="h-6 w-6" />,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    estimatedHours: 85,
    papers: [
      { name: "Paper 1 - Multiple Choice", date: "3 Jun 2026" },
      { name: "Paper 2 - AS Structured", date: "20 May 2026" },
      { name: "Paper 3 - Practical Skills", date: "28 Apr 2026" },
      { name: "Paper 4 - A Level Structured", date: "11 May 2026" },
      { name: "Paper 5 - Planning & Analysis", date: "20 May 2026" },
    ],
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Mathematics",
    slug: "maths",
    board: "Pearson Edexcel",
    code: "9MA0",
    icon: <Calculator className="h-6 w-6" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    estimatedHours: 72,
    papers: [
      { name: "Paper 1 - Pure Mathematics 1", date: "3 Jun 2026" },
      { name: "Paper 2 - Pure Mathematics 2", date: "11 Jun 2026" },
      { name: "Paper 3 - Statistics & Mechanics", date: "18 Jun 2026" },
    ],
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Russian",
    slug: "russian",
    board: "Pearson Edexcel",
    code: "9RU0",
    icon: <Languages className="h-6 w-6" />,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    estimatedHours: 60,
    papers: [
      { name: "Paper 1 - Listening & Reading", date: "1 Jun 2026" },
      { name: "Paper 2 - Written Response", date: "8 Jun 2026" },
      { name: "Paper 3 - Speaking", date: "Apr/May 2026" },
    ],
  },
]

export default function SubjectsPage() {
  const { statsMap, loading } = useSubjects()

  return (
    <>
      <Header title="Subjects" helpContent={<SubjectsHelp />} />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your A-Level Subjects</h2>
            <p className="text-muted-foreground">
              Track your progress across all three subjects and view upcoming exams.
            </p>
          </div>

          <div className="grid gap-6">
            {subjectConfig.map((subject) => {
              const stats = statsMap[subject.id] || {
                totalTopics: 0,
                completedTopics: 0,
                progressPercent: 0,
              }

              return (
                <Card key={subject.slug} className={`border-2 ${subject.borderColor} hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${subject.bgColor} ${subject.color}`}>
                          {subject.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{subject.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {subject.board} • {subject.code}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/subjects/${subject.slug}`}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View Syllabus
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="font-medium">Progress</span>
                        {loading ? (
                          <Skeleton className="h-4 w-32" />
                        ) : (
                          <span className="text-muted-foreground">
                            {stats.completedTopics} / {stats.totalTopics} topics complete
                          </span>
                        )}
                      </div>
                      {loading ? (
                        <Skeleton className="h-2 w-full" />
                      ) : (
                        <Progress value={stats.progressPercent} className="h-2" />
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {loading ? (
                          <Skeleton className="h-4 w-16" />
                        ) : (
                          <span>{stats.totalTopics} topics</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>~{subject.estimatedHours} hours</span>
                      </div>
                    </div>

                    {/* Papers */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Exam Papers</h4>
                      <div className="flex flex-wrap gap-2">
                        {subject.papers.map((paper) => (
                          <Badge key={paper.name} variant="outline" className="font-normal">
                            {paper.name} • {paper.date}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
