"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import {
  CalendarPlus,
  Calendar as CalendarIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Atom,
  Calculator,
  Languages,
  Clock,
  Check,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ScheduledSession {
  id: string
  date: Date
  time: string
  duration: number
  topicTitle: string
  subjectId: string
  completed: boolean
}

// Sample scheduled sessions
const sampleSessions: ScheduledSession[] = [
  // This would be populated from the database after schedule generation
]

const subjectConfig = {
  physics: { name: "Physics", icon: Atom, color: "bg-blue-500", textColor: "text-blue-600" },
  maths: { name: "Maths", icon: Calculator, color: "bg-emerald-500", textColor: "text-emerald-600" },
  russian: { name: "Russian", icon: Languages, color: "bg-red-500", textColor: "text-red-600" },
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [sessions] = useState<ScheduledSession[]>(sampleSessions)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => isSameDay(session.date, date))
  }

  const hasSchedule = sessions.length > 0

  return (
    <>
      <Header title="Schedule" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Study Schedule</h2>
              <p className="text-muted-foreground">
                Your revision timetable leading up to exams
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/schedule/blocked-dates">
                  <Settings className="h-4 w-4 mr-2" />
                  Blocked Dates
                </Link>
              </Button>
              <Button asChild>
                <Link href="/schedule/generate">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Generate Schedule
                </Link>
              </Button>
            </div>
          </div>

          {!hasSchedule ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarPlus className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Schedule Generated</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Generate a study schedule based on your exam dates and available time.
                  The scheduler will create a balanced plan across all subjects.
                </p>
                <Button asChild size="lg">
                  <Link href="/schedule/generate">
                    <CalendarPlus className="h-5 w-5 mr-2" />
                    Generate Your Schedule
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="week" className="space-y-4">
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>

              <TabsContent value="week" className="space-y-4">
                {/* Week Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWeekStart(addDays(weekStart, -7))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-semibold">
                    {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
                  </h3>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWeekStart(addDays(weekStart, 7))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const daySessions = getSessionsForDate(day)
                    const isToday = isSameDay(day, new Date())

                    return (
                      <Card
                        key={day.toISOString()}
                        className={cn(
                          "min-h-[200px]",
                          isToday && "ring-2 ring-primary"
                        )}
                      >
                        <CardHeader className="p-3 pb-2">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                              {format(day, "EEE")}
                            </p>
                            <p className={cn(
                              "text-lg font-semibold",
                              isToday && "text-primary"
                            )}>
                              {format(day, "d")}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                          {daySessions.map((session) => {
                            const config = subjectConfig[session.subjectId as keyof typeof subjectConfig]
                            return (
                              <div
                                key={session.id}
                                className={cn(
                                  "p-2 rounded text-xs",
                                  config.color,
                                  "text-white",
                                  session.completed && "opacity-60"
                                )}
                              >
                                <div className="flex items-center gap-1">
                                  {session.completed && <Check className="h-3 w-3" />}
                                  <span className="font-medium truncate">
                                    {session.topicTitle}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 opacity-80">
                                  <Clock className="h-3 w-3" />
                                  {session.time}
                                </div>
                              </div>
                            )
                          })}
                          {daySessions.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">
                              No sessions
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="month">
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="mx-auto"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-center py-8">
                      List view showing all upcoming sessions
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Quick Stats */}
          {hasSchedule && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">Sessions This Week</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">Hours Scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">0%</div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">107</div>
                  <p className="text-sm text-muted-foreground">Days Until First Exam</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
