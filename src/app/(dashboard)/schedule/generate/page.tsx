"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Clock,
  Atom,
  Calculator,
  Languages,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Study Hours", description: "Set your weekly availability" },
  { id: 2, title: "Subject Balance", description: "Adjust time per subject" },
  { id: 3, title: "Preferences", description: "Fine-tune your schedule" },
  { id: 4, title: "Generate", description: "Review and create" },
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

export default function GenerateSchedulePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  // Step 1: Study Hours
  const [weeklyHours, setWeeklyHours] = useState<Record<string, number>>({
    mon: 2,
    tue: 2,
    wed: 2,
    thu: 2,
    fri: 2,
    sat: 3,
    sun: 3,
  })

  // Step 2: Subject Balance (percentages)
  const [subjectBalance, setSubjectBalance] = useState({
    physics: 33,
    maths: 33,
    russian: 34,
  })

  // Step 3: Preferences
  const [sessionDuration, setSessionDuration] = useState(60)
  const [includeReviews, setIncludeReviews] = useState(true)
  const [bufferBeforeExams, setBufferBeforeExams] = useState(3)

  const totalWeeklyHours = Object.values(weeklyHours).reduce((a, b) => a + b, 0)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    router.push("/schedule")
  }

  const updateSubjectBalance = (subject: string, value: number) => {
    const others = Object.entries(subjectBalance).filter(([k]) => k !== subject)
    const remaining = 100 - value
    const perOther = Math.floor(remaining / others.length)

    setSubjectBalance({
      ...subjectBalance,
      [subject]: value,
      ...Object.fromEntries(others.map(([k], i) => [
        k,
        i === others.length - 1 ? remaining - (perOther * (others.length - 1)) : perOther
      ]))
    })
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
                  <p className="text-sm text-muted-foreground">
                    Adjust how your study time is split between subjects.
                    The schedule will weight topics based on these percentages.
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Atom className="h-5 w-5 text-blue-500" />
                          <Label>Physics</Label>
                        </div>
                        <span className="font-medium">{subjectBalance.physics}%</span>
                      </div>
                      <Slider
                        value={[subjectBalance.physics]}
                        onValueChange={([v]) => updateSubjectBalance("physics", v)}
                        max={60}
                        min={20}
                        step={1}
                        className="[&_[role=slider]]:bg-blue-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-emerald-500" />
                          <Label>Mathematics</Label>
                        </div>
                        <span className="font-medium">{subjectBalance.maths}%</span>
                      </div>
                      <Slider
                        value={[subjectBalance.maths]}
                        onValueChange={([v]) => updateSubjectBalance("maths", v)}
                        max={60}
                        min={20}
                        step={1}
                        className="[&_[role=slider]]:bg-emerald-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Languages className="h-5 w-5 text-red-500" />
                          <Label>Russian</Label>
                        </div>
                        <span className="font-medium">{subjectBalance.russian}%</span>
                      </div>
                      <Slider
                        value={[subjectBalance.russian]}
                        onValueChange={([v]) => updateSubjectBalance("russian", v)}
                        max={60}
                        min={20}
                        step={1}
                        className="[&_[role=slider]]:bg-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <div className="flex-1 h-4 bg-blue-500 rounded-l" style={{ width: `${subjectBalance.physics}%` }} />
                    <div className="flex-1 h-4 bg-emerald-500" style={{ width: `${subjectBalance.maths}%` }} />
                    <div className="flex-1 h-4 bg-red-500 rounded-r" style={{ width: `${subjectBalance.russian}%` }} />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
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

              {currentStep === 4 && (
                <div className="space-y-6">
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
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Subject Distribution</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Atom className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                        <p className="font-medium">{subjectBalance.physics}%</p>
                        <p className="text-xs text-muted-foreground">Physics</p>
                      </div>
                      <div>
                        <Calculator className="h-6 w-6 mx-auto text-emerald-500 mb-1" />
                        <p className="font-medium">{subjectBalance.maths}%</p>
                        <p className="text-xs text-muted-foreground">Maths</p>
                      </div>
                      <div>
                        <Languages className="h-6 w-6 mx-auto text-red-500 mb-1" />
                        <p className="font-medium">{subjectBalance.russian}%</p>
                        <p className="text-xs text-muted-foreground">Russian</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Ready to generate your schedule? This will create study sessions
                    from now until your exams in June 2026.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Generate Schedule
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
