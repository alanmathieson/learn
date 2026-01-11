// User Types
export type UserRole = 'student' | 'tutor' | 'admin'

export interface User {
  id: string
  clerk_id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
}

// Subject Types
export interface Subject {
  id: string
  name: string
  exam_board: string
  code: string | null
  color: string | null
  created_at: string
}

// Paper/Exam Types
export interface Paper {
  id: string
  subject_id: string
  name: string
  paper_number: number | null
  exam_date: string | null
  exam_time: string | null
  duration_minutes: number | null
  created_at: string
}

// Topic Types
export interface Topic {
  id: string
  subject_id: string
  paper_id: string | null
  parent_id: string | null
  code: string | null
  title: string
  description: string | null
  order_index: number | null
  estimated_hours: number | null
  created_at: string
}

export interface TopicWithChildren extends Topic {
  children: TopicWithChildren[]
}

// Progress Status Types
export type ProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'needs_review'
  | 'confident'
  | 'mastered'

export const PROGRESS_STATUS_CONFIG: Record<ProgressStatus, { label: string; color: string; bgColor: string }> = {
  not_started: { label: 'Not Started', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  needs_review: { label: 'Needs Review', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  confident: { label: 'Confident', color: 'text-green-600', bgColor: 'bg-green-100' },
  mastered: { label: 'Mastered', color: 'text-purple-600', bgColor: 'bg-purple-100' },
}

export interface TopicProgress {
  id: string
  user_id: string
  topic_id: string
  status: ProgressStatus
  confidence_level: number | null
  notes: string | null
  last_reviewed_at: string | null
  created_at: string
  updated_at: string
}

// Blocked Dates
export interface BlockedDate {
  id: string
  user_id: string
  date: string
  reason: string | null
  created_at: string
}

// Scheduled Sessions
export interface ScheduledSession {
  id: string
  user_id: string
  topic_id: string
  scheduled_date: string
  scheduled_time: string | null
  duration_minutes: number
  completed: boolean
  completed_at: string | null
  notes: string | null
  created_at: string
}

export interface ScheduledSessionWithTopic extends ScheduledSession {
  topic: Topic & { subject: Subject }
}

// Ad-hoc Todos
export type TodoPriority = 'low' | 'medium' | 'high'

export interface AdhocTodo {
  id: string
  user_id: string
  subject_id: string | null
  title: string
  description: string | null
  priority: TodoPriority
  due_date: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
}

// Practice Notes
export type NoteType = 'notes' | 'formulas' | 'past_paper' | 'summary'

export interface PracticeNote {
  id: string
  user_id: string
  topic_id: string | null
  subject_id: string | null
  title: string
  content: string | null
  note_type: NoteType
  created_at: string
  updated_at: string
}

// Tutor Comments
export interface TutorComment {
  id: string
  tutor_id: string
  topic_progress_id: string
  comment: string
  created_at: string
}

// View/Computed Types
export interface SubjectWithProgress extends Subject {
  papers: Paper[]
  total_topics: number
  completed_topics: number
  progress_percentage: number
}

export interface TopicWithProgress extends Topic {
  progress: TopicProgress | null
}

// Exam countdown
export interface ExamCountdown {
  paper: Paper
  subject: Subject
  days_remaining: number
  exam_date: Date
}
