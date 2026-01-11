"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { UserButton, useUser } from "@clerk/nextjs"
import { Bell, Moon, Download, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <>
      <Header title="Settings" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-16 w-16",
                    },
                  }}
                />
                <div>
                  <p className="font-semibold">{user?.fullName || "Student"}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Click on your avatar to manage your Clerk account settings, including
                password, email, and security options.
              </p>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders about scheduled sessions
                    </p>
                  </div>
                </div>
                <Switch id="notifications" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>

          {/* Data */}
          <Card>
            <CardHeader>
              <CardTitle>Data</CardTitle>
              <CardDescription>Manage your data and exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Export Progress</p>
                    <p className="text-sm text-muted-foreground">
                      Download your progress data as JSON
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Reset Progress</p>
                    <p className="text-sm text-muted-foreground">
                      Clear all progress data and start fresh
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Version:</span> 1.0.0
                </p>
                <p>
                  <span className="text-muted-foreground">Built for:</span> Tiggy&apos;s
                  A-Level Revision 2026
                </p>
                <p className="text-muted-foreground">
                  Physics (CIE) • Mathematics (Edexcel) • Russian (Edexcel)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
