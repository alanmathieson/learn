"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarOff, Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BlockedDate {
  id: string
  date: Date
  reason?: string
}

export default function BlockedDatesPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { id: "1", date: new Date("2026-02-14"), reason: "Half term" },
    { id: "2", date: new Date("2026-02-15"), reason: "Half term" },
    { id: "3", date: new Date("2026-02-16"), reason: "Half term" },
    { id: "4", date: new Date("2026-04-10"), reason: "Easter break" },
    { id: "5", date: new Date("2026-04-11"), reason: "Easter break" },
    { id: "6", date: new Date("2026-04-12"), reason: "Easter break" },
  ])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [reason, setReason] = useState("")

  const handleAddBlockedDate = () => {
    if (!selectedDate) return

    const newBlocked: BlockedDate = {
      id: Date.now().toString(),
      date: selectedDate,
      reason: reason || undefined,
    }

    setBlockedDates([...blockedDates, newBlocked])
    setSelectedDate(undefined)
    setReason("")
  }

  const handleRemoveBlockedDate = (id: string) => {
    setBlockedDates(blockedDates.filter((d) => d.id !== id))
  }

  const blockedDateSet = new Set(
    blockedDates.map((d) => format(d.date, "yyyy-MM-dd"))
  )

  // Group blocked dates by month
  const groupedDates = blockedDates.reduce((acc, date) => {
    const monthKey = format(date.date, "MMMM yyyy")
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(date)
    return acc
  }, {} as Record<string, BlockedDate[]>)

  return (
    <>
      <Header title="Blocked Dates" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/schedule">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Blocked Dates</h2>
              <p className="text-muted-foreground">
                Mark dates when you&apos;re unavailable to study
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Add Blocked Date</CardTitle>
                <CardDescription>
                  Select a date and optionally add a reason
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    blocked: blockedDates.map((d) => d.date),
                  }}
                  modifiersStyles={{
                    blocked: {
                      backgroundColor: "rgb(254 202 202)",
                      color: "rgb(185 28 28)",
                    },
                  }}
                  className="rounded-md border mx-auto"
                />

                {selectedDate && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <p className="font-medium">
                        Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      {blockedDateSet.has(format(selectedDate, "yyyy-MM-dd")) && (
                        <Badge variant="destructive" className="mt-1">
                          Already blocked
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason (optional)</Label>
                      <Input
                        id="reason"
                        placeholder="e.g., Holiday, Doctor's appointment"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={handleAddBlockedDate}
                      disabled={blockedDateSet.has(format(selectedDate, "yyyy-MM-dd"))}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Block This Date
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blocked Dates List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarOff className="h-5 w-5" />
                  Blocked Dates ({blockedDates.length})
                </CardTitle>
                <CardDescription>
                  These dates will be excluded from schedule generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blockedDates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No dates blocked yet</p>
                    <p className="text-sm">
                      Select dates on the calendar to block them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedDates)
                      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                      .map(([month, dates]) => (
                        <div key={month}>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">
                            {month}
                          </h4>
                          <div className="space-y-2">
                            {dates
                              .sort((a, b) => a.date.getTime() - b.date.getTime())
                              .map((blocked) => (
                                <div
                                  key={blocked.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {format(blocked.date, "EEEE, d")}
                                    </p>
                                    {blocked.reason && (
                                      <p className="text-sm text-muted-foreground">
                                        {blocked.reason}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemoveBlockedDate(blocked.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Add Buttons */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
              <CardDescription>
                Add common blocked periods quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  February Half Term (16-20 Feb)
                </Button>
                <Button variant="outline" size="sm">
                  Easter Break (6-17 Apr)
                </Button>
                <Button variant="outline" size="sm">
                  May Bank Holidays
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
