"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Atom, Calculator, Languages, ChevronRight } from "lucide-react"

interface SubjectProgress {
  name: string
  slug: string
  icon: React.ReactNode
  color: string
  bgColor: string
  totalTopics: number
  completedTopics: number
  inProgressTopics: number
  needsReviewTopics: number
}

// This would normally come from the database
const subjectProgress: SubjectProgress[] = [
  {
    name: "Physics",
    slug: "physics",
    icon: <Atom className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    totalTopics: 25,
    completedTopics: 0,
    inProgressTopics: 0,
    needsReviewTopics: 0,
  },
  {
    name: "Mathematics",
    slug: "maths",
    icon: <Calculator className="h-5 w-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    totalTopics: 19,
    completedTopics: 0,
    inProgressTopics: 0,
    needsReviewTopics: 0,
  },
  {
    name: "Russian",
    slug: "russian",
    icon: <Languages className="h-5 w-5" />,
    color: "text-red-500",
    bgColor: "bg-red-50",
    totalTopics: 14,
    completedTopics: 0,
    inProgressTopics: 0,
    needsReviewTopics: 0,
  },
]

export function ProgressOverview() {
  const totalTopics = subjectProgress.reduce((acc, s) => acc + s.totalTopics, 0)
  const totalCompleted = subjectProgress.reduce((acc, s) => acc + s.completedTopics, 0)
  const overallProgress = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{overallProgress}%</span>
            <span className="text-sm text-muted-foreground">
              {totalCompleted} / {totalTopics} topics
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {subjectProgress.map((subject) => {
          const progress = subject.totalTopics > 0
            ? Math.round((subject.completedTopics / subject.totalTopics) * 100)
            : 0

          return (
            <Link key={subject.slug} href={`/subjects/${subject.slug}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${subject.bgColor} ${subject.color}`}>
                      {subject.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{subject.name}</h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm text-muted-foreground w-10 text-right">
                          {progress}%
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {subject.inProgressTopics > 0 && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {subject.inProgressTopics} in progress
                          </Badge>
                        )}
                        {subject.needsReviewTopics > 0 && (
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                            {subject.needsReviewTopics} needs review
                          </Badge>
                        )}
                        {subject.completedTopics === 0 && subject.inProgressTopics === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Not started
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
