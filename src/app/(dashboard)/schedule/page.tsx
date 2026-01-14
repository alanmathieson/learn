"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
  differenceInDays,
  isBefore,
  startOfDay,
} from "date-fns"
import {
  CalendarPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Atom,
  Calculator,
  Languages,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useScheduledSessions, ScheduledSessionWithTopic } from "@/hooks/use-scheduled-sessions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns"

const SUBJECT_IDS = {
  physics: "11111111-1111-1111-1111-111111111111",
  maths: "22222222-2222-2222-2222-222222222222",
  russian: "33333333-3333-3333-3333-333333333333",
}

// Helper to get subject slug from ID
function getSubjectSlug(subjectId: string): string {
  switch (subjectId) {
    case SUBJECT_IDS.physics: return "physics"
    case SUBJECT_IDS.maths: return "maths"
    case SUBJECT_IDS.russian: return "russian"
    default: return "physics"
  }
}

// Helper to build topic link
function getTopicLink(session: ScheduledSessionWithTopic): string {
  const subjectSlug = getSubjectSlug(session.topic?.subject_id || "")
  return `/subjects/${subjectSlug}#topic-${session.topic_id}`
}

const subjectConfig: Record<string, { name: string; icon: typeof Atom; color: string; textColor: string }> = {
  [SUBJECT_IDS.physics]: { name: "Physics", icon: Atom, color: "bg-blue-500", textColor: "text-blue-600" },
  [SUBJECT_IDS.maths]: { name: "Maths", icon: Calculator, color: "bg-emerald-500", textColor: "text-emerald-600" },
  [SUBJECT_IDS.russian]: { name: "Russian", icon: Languages, color: "bg-red-500", textColor: "text-red-600" },
}

// First exam date for countdown
const FIRST_EXAM_DATE = "2026-04-15" // Russian Speaking

const STORAGE_KEY = "tiggy-schedule-view"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [activeTab, setActiveTab] = useState("week")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const {
    sessions,
    loading,
    error,
    markCompleted,
    deleteAllSessions,
  } = useScheduledSessions()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.activeTab) setActiveTab(parsed.activeTab)
        if (parsed.weekStart) setWeekStart(parseISO(parsed.weekStart))
        if (parsed.selectedDate) setSelectedDate(parseISO(parsed.selectedDate))
      }
    } catch (e) {
      console.error("Error loading schedule preferences:", e)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage when values change
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        activeTab,
        weekStart: format(weekStart, "yyyy-MM-dd"),
        selectedDate: format(selectedDate, "yyyy-MM-dd"),
      }))
    } catch (e) {
      console.error("Error saving schedule preferences:", e)
    }
  }, [activeTab, weekStart, selectedDate, isHydrated])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return sessions.filter((session) => session.scheduled_date === dateStr)
  }

  const hasSchedule = sessions.length > 0

  // Calculate stats
  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const weekEnd = addDays(weekStart, 7)

    const sessionsThisWeek = sessions.filter((s) => {
      const date = parseISO(s.scheduled_date)
      return !isBefore(date, weekStart) && isBefore(date, weekEnd)
    })

    const completedSessions = sessions.filter((s) => s.completed)
    const totalHours = sessions.reduce((acc, s) => acc + s.duration_minutes / 60, 0)
    const completionRate = sessions.length > 0
      ? Math.round((completedSessions.length / sessions.length) * 100)
      : 0

    const daysUntilExam = differenceInDays(parseISO(FIRST_EXAM_DATE), today)

    return {
      sessionsThisWeek: sessionsThisWeek.length,
      totalHours: Math.round(totalHours),
      completionRate,
      daysUntilExam,
    }
  }, [sessions, weekStart])

  const handleDeleteSchedule = async () => {
    setIsDeleting(true)
    await deleteAllSessions()
    setIsDeleting(false)
  }

  const handleToggleComplete = async (session: ScheduledSessionWithTopic) => {
    await markCompleted(session.id, !session.completed)
  }

  // Group sessions by date for list view
  const groupedSessions = useMemo(() => {
    const today = startOfDay(new Date())
    const upcomingSessions = sessions
      .filter((s) => !isBefore(parseISO(s.scheduled_date), today) || !s.completed)
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())

    const grouped: Record<string, ScheduledSessionWithTopic[]> = {}
    for (const session of upcomingSessions) {
      if (!grouped[session.scheduled_date]) {
        grouped[session.scheduled_date] = []
      }
      grouped[session.scheduled_date].push(session)
    }
    return grouped
  }, [sessions])

  if (loading) {
    return (
      <>
        <Header title="Schedule" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-6" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header title="Schedule" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }

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
              {hasSchedule && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Schedule
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete entire schedule?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete all {sessions.length} scheduled sessions. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSchedule}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Schedule"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button variant="outline" asChild>
                <Link href="/schedule/blocked-dates">
                  <Settings className="h-4 w-4 mr-2" />
                  Blocked Dates
                </Link>
              </Button>
              <Button asChild>
                <Link href="/schedule/generate">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  {hasSchedule ? "Regenerate" : "Generate Schedule"}
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                            const config = subjectConfig[session.topic?.subject_id] || subjectConfig[SUBJECT_IDS.physics]
                            return (
                              <div
                                key={session.id}
                                className={cn(
                                  "p-2 rounded text-xs cursor-pointer transition-opacity",
                                  config.color,
                                  "text-white",
                                  session.completed && "opacity-50"
                                )}
                                onClick={() => handleToggleComplete(session)}
                              >
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    checked={session.completed}
                                    className="h-3 w-3 border-white data-[state=checked]:bg-white data-[state=checked]:text-current"
                                    onClick={(e) => e.stopPropagation()}
                                    onCheckedChange={() => handleToggleComplete(session)}
                                  />
                                  <Link
                                    href={getTopicLink(session)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn("font-medium truncate hover:underline", session.completed && "line-through")}
                                  >
                                    {session.topic?.title || "Unknown Topic"}
                                  </Link>
                                </div>
                                <div className="flex items-center gap-1 mt-1 opacity-80">
                                  <Clock className="h-3 w-3" />
                                  {session.duration_minutes} min
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
                  <CardContent className="p-6">
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <MonthGrid
                      sessions={sessions}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      subjectConfig={subjectConfig}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[600px] overflow-y-auto">
                    {Object.entries(groupedSessions).length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No upcoming sessions
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                          <div key={date}>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                              {format(parseISO(date), "EEEE, MMMM d")}
                            </h4>
                            <div className="space-y-2">
                              {dateSessions.map((session) => {
                                const config = subjectConfig[session.topic?.subject_id] || subjectConfig[SUBJECT_IDS.physics]
                                return (
                                  <div
                                    key={session.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                                  >
                                    <Checkbox
                                      checked={session.completed}
                                      onCheckedChange={() => handleToggleComplete(session)}
                                    />
                                    <div className={cn("w-2 h-2 rounded-full", config.color)} />
                                    <div className="flex-1">
                                      <Link
                                        href={getTopicLink(session)}
                                        className={cn("font-medium hover:underline", session.completed && "line-through opacity-50")}
                                      >
                                        {session.topic?.title || "Unknown Topic"}
                                      </Link>
                                      <p className="text-xs text-muted-foreground">
                                        {config.name} - {session.duration_minutes} min
                                      </p>
                                    </div>
                                    <Badge variant={session.completed ? "secondary" : "outline"}>
                                      {session.completed ? "Done" : "Pending"}
                                    </Badge>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                  <div className="text-2xl font-bold">{stats.sessionsThisWeek}</div>
                  <p className="text-sm text-muted-foreground">Sessions This Week</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalHours}h</div>
                  <p className="text-sm text-muted-foreground">Total Hours Scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{stats.daysUntilExam}</div>
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

// Month Grid Component
interface MonthGridProps {
  sessions: ScheduledSessionWithTopic[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
  subjectConfig: Record<string, { name: string; color: string }>
}

function MonthGrid({ sessions, selectedDate, onSelectDate, subjectConfig }: MonthGridProps) {
  const currentMonth = startOfMonth(selectedDate)

  const handleMonthChange = (newMonth: Date) => {
    // Update selectedDate to the 1st of the new month to persist it
    onSelectDate(newMonth)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  // Adjust for Monday start (0 = Monday)
  const startDayOfWeek = getDay(monthStart)
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  // Create padding for days before the month starts
  const paddingDays = Array(adjustedStartDay).fill(null)

  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return sessions.filter((session) => session.scheduled_date === dateStr)
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-lg">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="h-32" />
          ))}
          {daysInMonth.map((day) => {
            const daySessions = getSessionsForDate(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "h-32 p-1 border rounded-md cursor-pointer transition-colors hover:bg-muted/50",
                  isToday && "ring-2 ring-primary",
                  isSelected && "bg-muted"
                )}
                onClick={() => onSelectDate(day)}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isToday && "text-primary"
                )}>
                  {format(day, "d")}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {daySessions.slice(0, 3).map((session) => {
                    const config = subjectConfig[session.topic?.subject_id] || { color: "bg-gray-500", name: "Unknown" }
                    return (
                      <div
                        key={session.id}
                        className={cn(
                          "flex items-center gap-1 text-xs truncate rounded px-1 py-0.5",
                          session.completed ? "opacity-50" : ""
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full shrink-0", config.color)} />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={getTopicLink(session)}
                              className={cn("truncate hover:underline", session.completed && "line-through")}
                            >
                              {session.topic?.title || "Unknown"}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[250px]">
                            <div className="space-y-1">
                              <p className="font-medium">{session.topic?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {config.name} - {session.duration_minutes} min
                              </p>
                              {session.completed && (
                                <Badge variant="secondary" className="text-xs">Completed</Badge>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )
                  })}
                  {daySessions.length > 3 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xs text-muted-foreground pl-1">
                          +{daySessions.length - 3} more
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[300px]">
                        <div className="space-y-2">
                          {daySessions.slice(3).map((session) => {
                            const config = subjectConfig[session.topic?.subject_id] || { color: "bg-gray-500", name: "Unknown" }
                            return (
                              <div key={session.id} className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", config.color)} />
                                <Link
                                  href={getTopicLink(session)}
                                  className={cn("text-sm hover:underline", session.completed && "line-through opacity-50")}
                                >
                                  {session.topic?.title}
                                </Link>
                              </div>
                            )
                          })}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
