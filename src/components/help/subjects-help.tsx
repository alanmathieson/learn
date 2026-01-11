"use client"

import { HelpPanel, HelpSection, StatusBadge } from "@/components/layout/help-panel"

export function SubjectsHelp() {
  return (
    <HelpPanel
      title="Subjects Overview Help"
      description="View all your A-Level subjects at a glance"
    >
      <HelpSection title="Subject Cards">
        <p>
          Each card represents one of your three A-Level subjects. You can see
          the exam board, subject code, and your current progress at a glance.
        </p>
      </HelpSection>

      <HelpSection title="Progress Tracking">
        <p>
          The progress bar shows what percentage of topics you&apos;ve completed.
          Only &quot;leaf&quot; topics (the most specific sub-topics) are counted,
          not the parent categories.
        </p>
      </HelpSection>

      <HelpSection title="Exam Papers">
        <p>
          Each subject shows its exam papers with dates. These are your target
          deadlines - all topics for a paper should be revised before that date.
        </p>
      </HelpSection>

      <HelpSection title="Estimated Hours">
        <p>
          The estimated hours give you a rough idea of total revision time needed.
          This is based on the complexity and number of topics in each subject.
        </p>
      </HelpSection>

      <HelpSection title="View Syllabus">
        <p>
          Click &quot;View Syllabus&quot; on any subject card to see the full topic
          breakdown and update your progress on individual topics.
        </p>
      </HelpSection>
    </HelpPanel>
  )
}
