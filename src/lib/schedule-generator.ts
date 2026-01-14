import { addDays, format, isBefore, parseISO, isAfter, startOfDay, differenceInDays } from "date-fns"
import { ProgressStatus, TopicPriority } from "@/types"

// Subject IDs
const SUBJECT_IDS = {
  physics: "11111111-1111-1111-1111-111111111111",
  maths: "22222222-2222-2222-2222-222222222222",
  russian: "33333333-3333-3333-3333-333333333333",
} as const

// Paper IDs mapped to exam dates and deadlines
const PAPER_DEADLINES: Record<string, { examDate: string; subjectId: string }> = {
  // Physics papers
  "a1111111-1111-1111-1111-111111111111": { examDate: "2026-06-03", subjectId: SUBJECT_IDS.physics }, // Paper 1 - Multiple Choice
  "a1111111-1111-1111-1111-111111111112": { examDate: "2026-05-20", subjectId: SUBJECT_IDS.physics }, // Paper 2 - AS Structured
  "a1111111-1111-1111-1111-111111111113": { examDate: "2026-04-28", subjectId: SUBJECT_IDS.physics }, // Paper 3 - Practical
  "a1111111-1111-1111-1111-111111111114": { examDate: "2026-05-11", subjectId: SUBJECT_IDS.physics }, // Paper 4 - A Level Structured
  "a1111111-1111-1111-1111-111111111115": { examDate: "2026-05-20", subjectId: SUBJECT_IDS.physics }, // Paper 5 - Planning & Analysis
  // Maths papers
  "a2222222-2222-2222-2222-222222222221": { examDate: "2026-06-03", subjectId: SUBJECT_IDS.maths }, // Paper 1 - Pure 1
  "a2222222-2222-2222-2222-222222222222": { examDate: "2026-06-11", subjectId: SUBJECT_IDS.maths }, // Paper 2 - Pure 2
  "a2222222-2222-2222-2222-222222222223": { examDate: "2026-06-18", subjectId: SUBJECT_IDS.maths }, // Paper 3 - Stats & Mechanics
  // Russian papers
  "a3333333-3333-3333-3333-333333333331": { examDate: "2026-06-01", subjectId: SUBJECT_IDS.russian }, // Paper 1 - Listening & Reading
  "a3333333-3333-3333-3333-333333333332": { examDate: "2026-06-08", subjectId: SUBJECT_IDS.russian }, // Paper 2 - Written Response
  "a3333333-3333-3333-3333-333333333333": { examDate: "2026-04-15", subjectId: SUBJECT_IDS.russian }, // Paper 3 - Speaking
}

// First exam per subject (for pacing calculation - front-loads subjects with more topics)
const SUBJECT_PACING_DEADLINE: Record<string, string> = {
  [SUBJECT_IDS.physics]: "2026-04-28", // Paper 3 Practical - first Physics exam
  [SUBJECT_IDS.maths]: "2026-06-03",   // Paper 1 - first Maths exam
  [SUBJECT_IDS.russian]: "2026-04-15", // Paper 3 Speaking - first Russian exam
}

// First exam per subject (for topics without paper_id)
const SUBJECT_FIRST_EXAM: Record<string, string> = {
  [SUBJECT_IDS.physics]: "2026-04-28",
  [SUBJECT_IDS.maths]: "2026-06-03",
  [SUBJECT_IDS.russian]: "2026-04-15",
}

// Status priority for sorting (lower = higher priority)
const STATUS_PRIORITY: Record<ProgressStatus, number> = {
  not_started: 0,
  in_progress: 1,
  needs_review: 2,
  confident: 3,
  mastered: 4,
}

// Topic priority for sorting (lower = higher priority)
const PRIORITY_ORDER: Record<TopicPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export interface TopicForScheduling {
  id: string
  title: string
  subject_id: string
  paper_id: string | null
  estimated_hours: number | null
  priority: TopicPriority
  status: ProgressStatus
}

export interface SchedulePreferences {
  weeklyHours: Record<string, number> // mon, tue, wed, etc.
  sessionDuration: number // minutes
  includeReviews: boolean
  bufferDays: number
  startDate: Date
}

export interface GeneratedSession {
  topic_id: string
  scheduled_date: string
  duration_minutes: number
  notes: string | null
}

interface TopicWithSessions extends TopicForScheduling {
  sessionsNeeded: number
  sessionsScheduled: number
  deadline: Date
}

interface SubjectPacing {
  id: string
  key: string
  totalSessions: number
  scheduledSessions: number
  endDate: Date
  sessionsPerDay: number
  accumulatedDebt: number // Tracks fractional sessions owed
}

/**
 * Get the deadline for a topic based on its paper or subject
 */
function getTopicDeadline(topic: TopicForScheduling, bufferDays: number): Date {
  let examDate: string

  if (topic.paper_id && PAPER_DEADLINES[topic.paper_id]) {
    examDate = PAPER_DEADLINES[topic.paper_id].examDate
  } else if (SUBJECT_FIRST_EXAM[topic.subject_id]) {
    examDate = SUBJECT_FIRST_EXAM[topic.subject_id]
  } else {
    // Fallback to a late date
    examDate = "2026-06-18"
  }

  return addDays(parseISO(examDate), -bufferDays)
}

/**
 * Get day of week key from date
 */
function getDayKey(date: Date): string {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  return days[date.getDay()]
}

/**
 * Get the best topic from a subject for the current date
 * Prioritizes by: deadline urgency, status, priority
 */
function getBestTopicForSubject(
  topics: TopicWithSessions[],
  subjectId: string,
  currentDate: Date
): TopicWithSessions | null {
  const available = topics.filter(
    (t) =>
      t.subject_id === subjectId &&
      t.sessionsScheduled < t.sessionsNeeded &&
      !isAfter(currentDate, t.deadline)
  )

  if (available.length === 0) return null

  // Sort by deadline, then status, then priority
  available.sort((a, b) => {
    // First by deadline
    const deadlineDiff = a.deadline.getTime() - b.deadline.getTime()
    if (deadlineDiff !== 0) return deadlineDiff

    // Then by status
    const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    if (statusDiff !== 0) return statusDiff

    // Then by priority
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  })

  return available[0]
}

/**
 * Calculate available study days between two dates, excluding blocked dates
 */
function countAvailableDays(
  startDate: Date,
  endDate: Date,
  blockedSet: Set<string>,
  weeklyHours: Record<string, number>
): number {
  let count = 0
  let current = startOfDay(startDate)

  while (isBefore(current, endDate)) {
    const dateStr = format(current, "yyyy-MM-dd")
    const dayKey = getDayKey(current)
    const dailyHours = weeklyHours[dayKey] || 0

    if (!blockedSet.has(dateStr) && dailyHours > 0) {
      count++
    }
    current = addDays(current, 1)
  }

  return count
}

/**
 * Generate a study schedule with proportional pacing per subject
 */
export function generateSchedule(
  topics: TopicForScheduling[],
  blockedDates: string[], // Array of date strings "YYYY-MM-DD"
  preferences: SchedulePreferences
): GeneratedSession[] {
  const {
    weeklyHours,
    sessionDuration,
    includeReviews,
    bufferDays,
    startDate,
  } = preferences

  const blockedSet = new Set(blockedDates)
  const sessionHours = sessionDuration / 60

  // Filter out confident and mastered topics
  // Also filter out needs_review if includeReviews is false
  const eligibleTopics = topics.filter((t) => {
    if (t.status === "confident" || t.status === "mastered") return false
    if (t.status === "needs_review" && !includeReviews) return false
    return true
  })

  // Create topics with session tracking
  const topicsWithSessions: TopicWithSessions[] = eligibleTopics.map((t) => ({
    ...t,
    sessionsNeeded: Math.max(1, Math.ceil((t.estimated_hours || 1) / sessionHours)),
    sessionsScheduled: 0,
    deadline: getTopicDeadline(t, bufferDays),
  }))

  // Calculate total sessions needed per subject
  const sessionsBySubject: Record<string, number> = {
    [SUBJECT_IDS.physics]: 0,
    [SUBJECT_IDS.maths]: 0,
    [SUBJECT_IDS.russian]: 0,
  }

  for (const topic of topicsWithSessions) {
    if (sessionsBySubject[topic.subject_id] !== undefined) {
      sessionsBySubject[topic.subject_id] += topic.sessionsNeeded
    }
  }

  // Calculate pacing for each subject (use first exam to front-load)
  const subjectPacing: SubjectPacing[] = [
    { key: "physics", id: SUBJECT_IDS.physics },
    { key: "maths", id: SUBJECT_IDS.maths },
    { key: "russian", id: SUBJECT_IDS.russian },
  ].map((s) => {
    const endDate = addDays(parseISO(SUBJECT_PACING_DEADLINE[s.id]), -bufferDays)
    const totalSessions = sessionsBySubject[s.id]
    const availableDays = countAvailableDays(startDate, endDate, blockedSet, weeklyHours)

    return {
      ...s,
      totalSessions,
      scheduledSessions: 0,
      endDate,
      sessionsPerDay: availableDays > 0 ? totalSessions / availableDays : 0,
      accumulatedDebt: 0,
    }
  })

  const sessions: GeneratedSession[] = []
  const lastExamDate = parseISO("2026-06-18") // Last exam

  let currentDate = startOfDay(startDate)

  // Schedule day by day
  while (isBefore(currentDate, lastExamDate)) {
    const dateStr = format(currentDate, "yyyy-MM-dd")
    const dayKey = getDayKey(currentDate)
    const dailyHours = weeklyHours[dayKey] || 0

    // Skip blocked dates and days with no hours
    if (blockedSet.has(dateStr) || dailyHours === 0) {
      currentDate = addDays(currentDate, 1)
      continue
    }

    // Calculate sessions for this day
    const dailySessions = Math.floor(dailyHours / sessionHours)
    if (dailySessions === 0) {
      currentDate = addDays(currentDate, 1)
      continue
    }

    // Accumulate debt for each subject that still has sessions to schedule
    for (const pacing of subjectPacing) {
      if (pacing.scheduledSessions < pacing.totalSessions &&
          !isAfter(currentDate, pacing.endDate)) {
        pacing.accumulatedDebt += pacing.sessionsPerDay
      }
    }

    let sessionsScheduledToday = 0

    // Schedule sessions based on accumulated debt (highest debt first)
    while (sessionsScheduledToday < dailySessions) {
      // Sort subjects by debt (highest first), but only those with remaining sessions
      const availableSubjects = subjectPacing
        .filter((p) => {
          // Has remaining sessions
          if (p.scheduledSessions >= p.totalSessions) return false
          // Not past end date
          if (isAfter(currentDate, p.endDate)) return false
          // Has at least 1 debt accumulated
          if (p.accumulatedDebt < 0.5) return false
          // Has available topics for today
          const hasTopic = topicsWithSessions.some(
            (t) =>
              t.subject_id === p.id &&
              t.sessionsScheduled < t.sessionsNeeded &&
              !isAfter(currentDate, t.deadline)
          )
          return hasTopic
        })
        .sort((a, b) => b.accumulatedDebt - a.accumulatedDebt)

      if (availableSubjects.length === 0) {
        // No subjects with debt, try any subject with remaining topics
        const anyAvailable = subjectPacing.find((p) => {
          if (p.scheduledSessions >= p.totalSessions) return false
          return topicsWithSessions.some(
            (t) =>
              t.subject_id === p.id &&
              t.sessionsScheduled < t.sessionsNeeded &&
              !isAfter(currentDate, t.deadline)
          )
        })

        if (!anyAvailable) break

        // Schedule from this subject
        const topic = getBestTopicForSubject(topicsWithSessions, anyAvailable.id, currentDate)
        if (!topic) break

        sessions.push({
          topic_id: topic.id,
          scheduled_date: dateStr,
          duration_minutes: sessionDuration,
          notes: null,
        })
        topic.sessionsScheduled++
        anyAvailable.scheduledSessions++
        sessionsScheduledToday++
        continue
      }

      // Pick the subject with highest debt
      const selectedSubject = availableSubjects[0]

      // Get the best topic from this subject
      const topic = getBestTopicForSubject(topicsWithSessions, selectedSubject.id, currentDate)
      if (!topic) break

      sessions.push({
        topic_id: topic.id,
        scheduled_date: dateStr,
        duration_minutes: sessionDuration,
        notes: null,
      })
      topic.sessionsScheduled++
      selectedSubject.scheduledSessions++
      selectedSubject.accumulatedDebt -= 1 // Pay off one session of debt
      sessionsScheduledToday++
    }

    currentDate = addDays(currentDate, 1)
  }

  return sessions
}

/**
 * Get subject name from ID
 */
export function getSubjectName(subjectId: string): string {
  switch (subjectId) {
    case SUBJECT_IDS.physics:
      return "Physics"
    case SUBJECT_IDS.maths:
      return "Maths"
    case SUBJECT_IDS.russian:
      return "Russian"
    default:
      return "Unknown"
  }
}

export { SUBJECT_IDS }
