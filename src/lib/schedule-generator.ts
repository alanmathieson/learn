import { addDays, format, isBefore, parseISO, isAfter, startOfDay } from "date-fns"
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
  subjectBalance: Record<string, number> // physics, maths, russian percentages
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
 * Sort topics by status, then priority
 */
function sortTopics(topics: TopicForScheduling[]): TopicForScheduling[] {
  return [...topics].sort((a, b) => {
    // First by status
    const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    if (statusDiff !== 0) return statusDiff

    // Then by priority
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  })
}

/**
 * Get day of week key from date
 */
function getDayKey(date: Date): string {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  return days[date.getDay()]
}

/**
 * Generate a study schedule
 */
export function generateSchedule(
  topics: TopicForScheduling[],
  blockedDates: string[], // Array of date strings "YYYY-MM-DD"
  preferences: SchedulePreferences
): GeneratedSession[] {
  const {
    weeklyHours,
    subjectBalance,
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

  // Group topics by subject
  const topicsBySubject: Record<string, TopicForScheduling[]> = {
    [SUBJECT_IDS.physics]: [],
    [SUBJECT_IDS.maths]: [],
    [SUBJECT_IDS.russian]: [],
  }

  for (const topic of eligibleTopics) {
    if (topicsBySubject[topic.subject_id]) {
      topicsBySubject[topic.subject_id].push(topic)
    }
  }

  // Sort each subject's topics
  for (const subjectId of Object.keys(topicsBySubject)) {
    topicsBySubject[subjectId] = sortTopics(topicsBySubject[subjectId])
  }

  // Calculate sessions needed per topic
  interface TopicWithSessions extends TopicForScheduling {
    sessionsNeeded: number
    sessionsScheduled: number
    deadline: Date
  }

  const topicsWithSessions: TopicWithSessions[] = eligibleTopics.map((t) => ({
    ...t,
    sessionsNeeded: Math.max(1, Math.ceil((t.estimated_hours || 1) / sessionHours)),
    sessionsScheduled: 0,
    deadline: getTopicDeadline(t, bufferDays),
  }))

  // Sort all topics for scheduling
  topicsWithSessions.sort((a, b) => {
    // First by deadline (earlier deadlines first)
    const deadlineDiff = a.deadline.getTime() - b.deadline.getTime()
    if (deadlineDiff !== 0) return deadlineDiff

    // Then by status
    const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    if (statusDiff !== 0) return statusDiff

    // Then by priority
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  })

  const sessions: GeneratedSession[] = []
  const lastExamDate = parseISO("2026-06-18") // Last exam

  // Track sessions per day
  let currentDate = startOfDay(startDate)

  // Track subject session counts for balance
  const subjectSessionCounts: Record<string, number> = {
    [SUBJECT_IDS.physics]: 0,
    [SUBJECT_IDS.maths]: 0,
    [SUBJECT_IDS.russian]: 0,
  }

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

    // Find topics that can be scheduled today
    // They must have sessions remaining and deadline not passed
    const availableTopics = topicsWithSessions.filter(
      (t) =>
        t.sessionsScheduled < t.sessionsNeeded &&
        !isAfter(currentDate, t.deadline)
    )

    if (availableTopics.length === 0) {
      currentDate = addDays(currentDate, 1)
      continue
    }

    // Schedule sessions for today
    let sessionsToday = 0

    while (sessionsToday < dailySessions) {
      // Find the next topic to schedule
      // Prioritize by: deadline urgency, status, priority, and subject balance
      const remainingTopics = availableTopics.filter(
        (t) => t.sessionsScheduled < t.sessionsNeeded
      )

      if (remainingTopics.length === 0) break

      // Calculate which subject is most under-represented
      const totalSessions =
        subjectSessionCounts[SUBJECT_IDS.physics] +
        subjectSessionCounts[SUBJECT_IDS.maths] +
        subjectSessionCounts[SUBJECT_IDS.russian] || 1

      const subjectDeficit: Record<string, number> = {}
      for (const [key, subjectId] of Object.entries({
        physics: SUBJECT_IDS.physics,
        maths: SUBJECT_IDS.maths,
        russian: SUBJECT_IDS.russian,
      })) {
        const targetPercent = subjectBalance[key] / 100
        const actualPercent = subjectSessionCounts[subjectId] / totalSessions
        subjectDeficit[subjectId] = targetPercent - actualPercent
      }

      // Score each topic
      const scoredTopics = remainingTopics.map((t) => {
        // Urgency: how close is the deadline?
        const daysUntilDeadline = Math.max(
          0,
          (t.deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        const urgencyScore = daysUntilDeadline < 7 ? 1000 : daysUntilDeadline < 14 ? 500 : 0

        // Status score
        const statusScore = (2 - STATUS_PRIORITY[t.status]) * 100

        // Priority score
        const priorityScore = (2 - PRIORITY_ORDER[t.priority]) * 50

        // Subject balance score
        const balanceScore = (subjectDeficit[t.subject_id] || 0) * 200

        return {
          topic: t,
          score: urgencyScore + statusScore + priorityScore + balanceScore,
        }
      })

      // Pick the highest scoring topic
      scoredTopics.sort((a, b) => b.score - a.score)
      const selectedTopic = scoredTopics[0].topic

      // Create session
      sessions.push({
        topic_id: selectedTopic.id,
        scheduled_date: dateStr,
        duration_minutes: sessionDuration,
        notes: null,
      })

      selectedTopic.sessionsScheduled++
      subjectSessionCounts[selectedTopic.subject_id]++
      sessionsToday++
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
