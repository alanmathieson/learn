"use client"

import { HelpPanel, HelpSection, StatusBadge } from "@/components/layout/help-panel"

export function DashboardHelp() {
  return (
    <HelpPanel
      title="Dashboard Help"
      description="Your central hub for tracking revision progress"
    >
      <HelpSection title="Overview">
        <p>
          The dashboard gives you a quick snapshot of your revision progress
          across all three A-Level subjects: Physics, Mathematics, and Russian.
        </p>
      </HelpSection>

      <HelpSection title="Exam Countdown">
        <p>
          The countdown cards show how many days remain until each of your exams.
          Papers are ordered by date, so you can see which ones are coming up first.
        </p>
      </HelpSection>

      <HelpSection title="Progress Overview">
        <p>
          Each subject card shows your overall completion percentage based on
          how many topics you&apos;ve marked as &quot;Confident&quot; or &quot;Mastered&quot;.
        </p>
      </HelpSection>

      <HelpSection title="Quick Actions">
        <p>
          Click on any subject card to jump directly to that subject&apos;s
          syllabus page where you can update your progress on individual topics.
        </p>
      </HelpSection>

      <HelpSection title="What Counts as Complete?">
        <p>Only topics marked with these statuses count towards your progress:</p>
        <div className="mt-2 space-y-1">
          <StatusBadge color="bg-green-500" label="Confident" description="You feel good about this topic" />
          <StatusBadge color="bg-purple-500" label="Mastered" description="Fully confident, minimal review needed" />
        </div>
      </HelpSection>
    </HelpPanel>
  )
}
