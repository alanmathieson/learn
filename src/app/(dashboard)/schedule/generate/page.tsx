"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Clock,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAllTopics } from "@/hooks/use-all-topics"
import { useBlockedDates } from "@/hooks/use-blocked-dates"
import { useScheduledSessions } from "@/hooks/use-scheduled-sessions"
import { generateSchedule } from "@/lib/schedule-generator"

const steps = [
  { id: 1, title: "Study Hours", description: "Set your weekly availability" },
  { id: 2, title: "Preferences", description: "Fine-tune your schedule" },
  { id: 3, title: "Generate", description: "Review and create" },
]

const daysOfWeek = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
]

const STORAGE_KEY = "tiggy-schedule-preferences"

const DEFAULT_WEEKLY_HOURS: Record<string, number> = {
  mon: 2,
  tue: 2,
  wed: 2,
  thu: 2,
  fri: 2,
  sat: 3,
  sun: 3,
}

export default function GenerateSchedulePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Fetch data needed for generation
  const { topics, loading: topicsLoading, error: topicsError } = useAllTopics()
  const { blockedDates, loading: blockedLoading } = useBlockedDates()
  const { createSessions, deleteAllSessions, sessions, supabaseUserId } = useScheduledSessions()

  // Step 1: Study Hours
  const [weeklyHours, setWeeklyHours] = useState<Record<string, number>>(DEFAULT_WEEKLY_HOURS)

  // Step 2: Preferences
  const [sessionDuration, setSessionDuration] = useState(60)
  const [includeReviews, setIncludeReviews] = useState(true)
  const [bufferBeforeExams, setBufferBeforeExams] = useState(5)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.weeklyHours) setWeeklyHours(parsed.weeklyHours)
        if (parsed.sessionDuration) setSessionDuration(parsed.sessionDuration)
        if (typeof parsed.includeReviews === "boolean") setIncludeReviews(parsed.includeReviews)
        if (parsed.bufferBeforeExams) setBufferBeforeExams(parsed.bufferBeforeExams)
      }
    } catch (e) {
      console.error("Error loading schedule preferences:", e)
    }
    setIsHydrated(true)
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        weeklyHours,
        sessionDuration,
        includeReviews,
        bufferBeforeExams,
      }))
    } catch (e) {
      console.error("Error saving schedule preferences:", e)
    }
  }, [weeklyHours, sessionDuration, includeReviews, bufferBeforeExams, isHydrated])

  const totalWeeklyHours = Object.values(weeklyHours).reduce((a, b) => a + b, 0)
  const dataLoading = topicsLoading || blockedLoading
  const hasExistingSchedule = sessions.length > 0

  const handleGenerate = async () => {
    if (!supabaseUserId) {
      setGenerationError("User not found. Please try again.")
      return
    }

    setIsGenerating(true)
    setGenerationError(null)

    try {
      // Delete existing sessions if any
      if (hasExistingSchedule) {
        await deleteAllSessions()
      }

      // Generate new schedule
      const generatedSessions = generateSchedule(
        topics,
        blockedDates.map((d) => d.date),
        {
          weeklyHours,
          sessionDuration,
          includeReviews,
          bufferDays: bufferBeforeExams,
          startDate: new Date("2026-01-19"), // Monday 19th January 2026
        }
      )

      if (generatedSessions.length === 0) {
        setGenerationError("No sessions could be generated. Check that you have topics to schedule.")
        setIsGenerating(false)
        return
      }

      // Save to database
      const success = await createSessions(
        generatedSessions.map((s) => ({
          ...s,
          user_id: supabaseUserId,
          completed: false,
          scheduled_time: null,
        }))
      )

      if (!success) {
        setGenerationError("Failed to save schedule. Please try again.")
        setIsGenerating(false)
        return
      }

      router.push("/schedule")
    } catch (error) {
      console.error("Generation error:", error)
      setGenerationError("An error occurred while generating the schedule.")
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Header title="Generate Schedule" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/schedule">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Generate Study Schedule</h2>
              <p className="text-muted-foreground">
                Create a balanced revision plan leading up to your exams
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="text-xs mt-2 text-center max-w-[80px]">
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-1 w-16 mx-2",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Set how many hours you can study each day. The scheduler will
                    distribute your revision across these available slots.
                  </p>
                  <div className="grid grid-cols-7 gap-4">
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="text-center">
                        <Label className="text-xs">{day.label}</Label>
                        <Input
                          type="number"
                          min={0}
                          max={8}
                          value={weeklyHours[day.id]}
                          onChange={(e) =>
                            setWeeklyHours({
                              ...weeklyHours,
                              [day.id]: parseInt(e.target.value) || 0,
                            })
                          }
                          className="text-center mt-1"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Total Weekly Hours</span>
                    <Badge variant="secondary" className="text-lg px-3">
                      {totalWeeklyHours}h
                    </Badge>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Session Duration</Label>
                        <p className="text-sm text-muted-foreground">
                          Length of each study session
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{sessionDuration} min</span>
                      </div>
                    </div>
                    <Slider
                      value={[sessionDuration]}
                      onValueChange={([v]) => setSessionDuration(v)}
                      min={30}
                      max={120}
                      step={15}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Review Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Schedule revisits for topics marked as &quot;Needs Review&quot;
                      </p>
                    </div>
                    <Switch
                      checked={includeReviews}
                      onCheckedChange={setIncludeReviews}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Buffer Before Exams</Label>
                        <p className="text-sm text-muted-foreground">
                          Days to leave free before each exam for final review
                        </p>
                      </div>
                      <span className="font-medium">{bufferBeforeExams} days</span>
                    </div>
                    <Slider
                      value={[bufferBeforeExams]}
                      onValueChange={([v]) => setBufferBeforeExams(v)}
                      min={1}
                      max={7}
                      step={1}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {dataLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : topicsError ? (
                    <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <p className="text-destructive">{topicsError}</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <h4 className="font-medium">Schedule Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Weekly Hours:</span>
                          <span>{totalWeeklyHours}h</span>
                          <span className="text-muted-foreground">Session Length:</span>
                          <span>{sessionDuration} minutes</span>
                          <span className="text-muted-foreground">Review Sessions:</span>
                          <span>{includeReviews ? "Yes" : "No"}</span>
                          <span className="text-muted-foreground">Exam Buffer:</span>
                          <span>{bufferBeforeExams} days</span>
                          <span className="text-muted-foreground">Topics to Schedule:</span>
                          <span>{topics.filter(t => t.status !== "confident" && t.status !== "mastered" && (includeReviews || t.status !== "needs_review")).length}</span>
                          <span className="text-muted-foreground">Blocked Dates:</span>
                          <span>{blockedDates.length}</span>
                        </div>
                      </div>

                      {hasExistingSchedule && (
                        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            You have an existing schedule with {sessions.length} sessions.
                            Generating a new schedule will replace it.
                          </p>
                        </div>
                      )}

                      {generationError && (
                        <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <p className="text-destructive">{generationError}</p>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground text-center">
                        Ready to generate your schedule? This will create study sessions
                        from January 16th 2026 until your exams.
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {currentStep === 1 ? (
              <Button variant="outline" asChild>
                <Link href="/schedule">
                  Cancel
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}

            {currentStep < 3 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={isGenerating || dataLoading || !!topicsError}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    {hasExistingSchedule ? "Regenerate Schedule" : "Generate Schedule"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
