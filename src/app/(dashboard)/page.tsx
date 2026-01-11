import { Header } from "@/components/layout/header"
import { ExamCountdown } from "@/components/dashboard/exam-countdown"
import { ProgressOverview } from "@/components/dashboard/progress-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Plus, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Tiggy!</h2>
            <p className="text-muted-foreground">
              Track your A-Level revision progress and stay on schedule.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Progress */}
            <div className="lg:col-span-2 space-y-6">
              <ProgressOverview />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/schedule/generate">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Generate Schedule
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/practice/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Practice Note
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/todos">
                        <Sparkles className="mr-2 h-4 w-4" />
                        View Todos
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Today&apos;s Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="mb-4">No schedule generated yet</p>
                    <Button asChild>
                      <Link href="/schedule/generate">Generate Your Study Schedule</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Exam Countdown */}
            <div>
              <ExamCountdown />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
