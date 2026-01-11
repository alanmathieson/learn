"use client"

import { differenceInDays, format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"

interface ExamInfo {
  subject: string
  paper: string
  date: string
  time?: string
  color: string
}

const exams: ExamInfo[] = [
  { subject: "Physics", paper: "Paper 3 - Practical Skills", date: "2026-04-28", time: "13:45", color: "bg-blue-500" },
  { subject: "Physics", paper: "Paper 4 - Structured Questions", date: "2026-05-11", time: "13:45", color: "bg-blue-500" },
  { subject: "Physics", paper: "Paper 2 - AS Structured", date: "2026-05-20", time: "13:45", color: "bg-blue-500" },
  { subject: "Physics", paper: "Paper 5 - Planning & Analysis", date: "2026-05-20", time: "13:45", color: "bg-blue-500" },
  { subject: "Russian", paper: "Paper 1 - Listening & Reading", date: "2026-06-01", time: "08:45", color: "bg-red-500" },
  { subject: "Physics", paper: "Paper 1 - Multiple Choice", date: "2026-06-03", time: "13:45", color: "bg-blue-500" },
  { subject: "Maths", paper: "Paper 1 - Pure Mathematics 1", date: "2026-06-03", time: "13:45", color: "bg-emerald-500" },
  { subject: "Russian", paper: "Paper 2 - Written Response", date: "2026-06-08", time: "13:45", color: "bg-red-500" },
  { subject: "Maths", paper: "Paper 2 - Pure Mathematics 2", date: "2026-06-11", time: "13:45", color: "bg-emerald-500" },
  { subject: "Maths", paper: "Paper 3 - Stats & Mechanics", date: "2026-06-18", time: "13:45", color: "bg-emerald-500" },
]

export function ExamCountdown() {
  const today = new Date()

  // Sort exams by date and filter to upcoming only
  const upcomingExams = exams
    .map((exam) => ({
      ...exam,
      daysRemaining: differenceInDays(parseISO(exam.date), today),
      dateObj: parseISO(exam.date),
    }))
    .filter((exam) => exam.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  const nextExam = upcomingExams[0]

  return (
    <div className="space-y-4">
      {nextExam && (
        <Card className="border-2 border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Exam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={`${nextExam.color} text-white mb-2`}>
                  {nextExam.subject}
                </Badge>
                <p className="font-semibold">{nextExam.paper}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {format(nextExam.dateObj, "EEE d MMM yyyy")}
                  </span>
                  {nextExam.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {nextExam.time}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-primary">
                  {nextExam.daysRemaining}
                </p>
                <p className="text-sm text-muted-foreground">
                  days to go
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">All Upcoming Exams</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto">
          <div className="space-y-3">
            {upcomingExams.map((exam, index) => (
              <div
                key={`${exam.subject}-${exam.paper}-${index}`}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${exam.color}`} />
                  <div>
                    <p className="text-sm font-medium">{exam.paper}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(exam.dateObj, "EEE d MMM")}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {exam.daysRemaining}d
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
