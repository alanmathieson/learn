-- Migration: Add priority column to topics table
-- This column was missing - the application was trying to update it but the column didn't exist

ALTER TABLE topics
ADD COLUMN priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));

-- Update existing policy to allow updates (for priority changes)
-- Drop the admin-only policy that blocks updates
DROP POLICY IF EXISTS "Admins can modify topics" ON topics;

-- Create permissive update policy (RLS is permissive in this app per CLAUDE.md)
CREATE POLICY "Anyone can update topics" ON topics
  FOR UPDATE USING (true);
