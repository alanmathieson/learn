"use client"

import { HelpPanel, HelpSection, StatusBadge } from "@/components/layout/help-panel"

export function SyllabusHelp() {
  return (
    <HelpPanel
      title="Syllabus Help"
      description="Track your progress through each topic"
    >
      <HelpSection title="Topic Tree">
        <p>
          Topics are organised hierarchically. Click on a topic row to expand
          it and see its sub-topics. The most specific sub-topics are where
          you&apos;ll track your actual progress.
        </p>
      </HelpSection>

      <HelpSection title="Status Levels">
        <p>Use these statuses to track how well you know each topic:</p>
        <div className="mt-2 space-y-2">
          <StatusBadge
            color="bg-gray-400"
            label="Not Started"
            description="Haven't begun revision yet"
          />
          <StatusBadge
            color="bg-blue-500"
            label="In Progress"
            description="Currently working on this topic"
          />
          <StatusBadge
            color="bg-amber-500"
            label="Needs Review"
            description="Covered but needs more practice"
          />
          <StatusBadge
            color="bg-green-500"
            label="Confident"
            description="Feeling good about this topic"
          />
          <StatusBadge
            color="bg-purple-500"
            label="Mastered"
            description="Fully confident, minimal review needed"
          />
        </div>
      </HelpSection>

      <HelpSection title="Changing Status">
        <p>
          Click the status badge on any leaf topic to change it. Your progress
          is saved automatically and updates the overall subject progress.
        </p>
      </HelpSection>

      <HelpSection title="Confidence Rating">
        <p>
          You can also set a 1-5 star confidence rating for finer-grained tracking.
          This helps identify topics that might need extra attention even if
          marked as &quot;In Progress&quot;.
        </p>
      </HelpSection>

      <HelpSection title="Notes">
        <p>
          Each topic has a notes field where you can jot down key points,
          formulas to remember, or areas you find tricky. Notes are saved
          automatically as you type.
        </p>
      </HelpSection>

      <HelpSection title="What Counts as Complete?">
        <p>
          Only topics marked as &quot;Confident&quot; or &quot;Mastered&quot; count
          towards your completion percentage. &quot;In Progress&quot; and &quot;Needs
          Review&quot; topics still need more work.
        </p>
      </HelpSection>

      <HelpSection title="Exam Papers">
        <p>
          Topics are grouped by which exam paper they appear in. Focus on
          papers with earlier dates first to ensure you&apos;re prepared in time.
        </p>
      </HelpSection>
    </HelpPanel>
  )
}
