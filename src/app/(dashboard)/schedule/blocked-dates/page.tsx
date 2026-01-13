"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO, addDays } from "date-fns"
import { CalendarOff, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useBlockedDates } from "@/hooks/use-blocked-dates"

export default function BlockedDatesPage() {
  const {
    blockedDates,
    loading,
    error,
    createBlockedDate,
    deleteBlockedDate,
  } = useBlockedDates()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [reason, setReason] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAddBlockedDate = async () => {
    if (!selectedDate) return

    setIsAdding(true)
    await createBlockedDate({
      date: selectedDate,
      reason: reason || undefined,
    })
    setSelectedDate(undefined)
    setReason("")
    setIsAdding(false)
  }

  const handleRemoveBlockedDate = async (id: string) => {
    setDeletingId(id)
    await deleteBlockedDate(id)
    setDeletingId(null)
  }

  const blockedDateSet = new Set(blockedDates.map((d) => d.date))

  // Group blocked dates by month
  const groupedDates = blockedDates.reduce((acc, date) => {
    const monthKey = format(parseISO(date.date), "MMMM yyyy")
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(date)
    return acc
  }, {} as Record<string, typeof blockedDates>)

  if (error) {
    return (
      <>
        <Header title="Blocked Dates" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
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
                    blocked: blockedDates.map((d) => parseISO(d.date)),
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
                      disabled={blockedDateSet.has(format(selectedDate, "yyyy-MM-dd")) || isAdding}
                      className="w-full"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Block This Date
                        </>
                      )}
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
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ) : blockedDates.length === 0 ? (
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
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map((blocked) => (
                                <div
                                  key={blocked.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {format(parseISO(blocked.date), "EEEE, d")}
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
                                    disabled={deletingId === blocked.id}
                                  >
                                    {deletingId === blocked.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
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

        </div>
      </main>
    </>
  )
}
