-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for clerk_id lookups
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  exam_board TEXT NOT NULL,
  code TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Papers/Exams table
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  paper_number INTEGER,
  exam_date DATE,
  exam_time TIME,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_papers_subject ON papers(subject_id);

-- Topics table (syllabus items)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  paper_id UUID REFERENCES papers(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  estimated_hours DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_topics_parent ON topics(parent_id);
CREATE INDEX idx_topics_paper ON topics(paper_id);

-- Topic progress table
CREATE TABLE topic_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'needs_review', 'confident', 'mastered')),
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  notes TEXT,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

CREATE INDEX idx_topic_progress_user ON topic_progress(user_id);
CREATE INDEX idx_topic_progress_topic ON topic_progress(topic_id);
CREATE INDEX idx_topic_progress_status ON topic_progress(status);

-- Tutor comments on progress
CREATE TABLE tutor_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_progress_id UUID REFERENCES topic_progress(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tutor_comments_progress ON tutor_comments(topic_progress_id);

-- Blocked dates table
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_blocked_dates_user ON blocked_dates(user_id);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(date);

-- Scheduled sessions table
CREATE TABLE scheduled_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_minutes INTEGER DEFAULT 60,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_sessions_user ON scheduled_sessions(user_id);
CREATE INDEX idx_scheduled_sessions_date ON scheduled_sessions(scheduled_date);
CREATE INDEX idx_scheduled_sessions_topic ON scheduled_sessions(topic_id);

-- Ad-hoc todos table
CREATE TABLE adhoc_todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_adhoc_todos_user ON adhoc_todos(user_id);
CREATE INDEX idx_adhoc_todos_completed ON adhoc_todos(completed);

-- Practice notes table
CREATE TABLE practice_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  note_type TEXT DEFAULT 'notes' CHECK (note_type IN ('notes', 'formulas', 'past_paper', 'summary')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_practice_notes_user ON practice_notes(user_id);
CREATE INDEX idx_practice_notes_topic ON practice_notes(topic_id);
CREATE INDEX idx_practice_notes_subject ON practice_notes(subject_id);
CREATE INDEX idx_practice_notes_type ON practice_notes(note_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_topic_progress_updated_at
  BEFORE UPDATE ON topic_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_notes_updated_at
  BEFORE UPDATE ON practice_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhoc_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_notes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Tutors and admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role IN ('tutor', 'admin')
    )
  );

-- Subjects, papers, topics - everyone can read
CREATE POLICY "Everyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Everyone can view papers" ON papers FOR SELECT USING (true);
CREATE POLICY "Everyone can view topics" ON topics FOR SELECT USING (true);

-- Only admins can modify syllabus data
CREATE POLICY "Admins can modify subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can modify papers" ON papers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can modify topics" ON topics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role = 'admin'
    )
  );

-- Topic progress policies
CREATE POLICY "Users can view own progress" ON topic_progress
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

CREATE POLICY "Tutors can view all progress" ON topic_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role IN ('tutor', 'admin')
    )
  );

CREATE POLICY "Users can manage own progress" ON topic_progress
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- Tutor comments policies
CREATE POLICY "Users can view comments on their progress" ON tutor_comments
  FOR SELECT USING (
    topic_progress_id IN (
      SELECT tp.id FROM topic_progress tp
      JOIN users u ON tp.user_id = u.id
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

CREATE POLICY "Tutors can view all comments" ON tutor_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role IN ('tutor', 'admin')
    )
  );

CREATE POLICY "Tutors can create comments" ON tutor_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role IN ('tutor', 'admin')
      AND u.id = tutor_id
    )
  );

-- Blocked dates policies
CREATE POLICY "Users can manage own blocked dates" ON blocked_dates
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- Scheduled sessions policies
CREATE POLICY "Users can manage own sessions" ON scheduled_sessions
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

CREATE POLICY "Tutors can view all sessions" ON scheduled_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role IN ('tutor', 'admin')
    )
  );

-- Ad-hoc todos policies
CREATE POLICY "Users can manage own todos" ON adhoc_todos
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

-- Practice notes policies
CREATE POLICY "Users can manage own notes" ON practice_notes
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'
    )
  );

CREATE POLICY "Tutors can view all notes" ON practice_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.clerk_id = current_setting('request.jwt.claims')::json->>'sub'
      AND u.role IN ('tutor', 'admin')
    )
  );
