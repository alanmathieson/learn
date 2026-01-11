# Claude Code Guidelines for TiggyLearn

## Development Workflow

1. **Never start a local server** - The user manages and runs the dev server themselves.

2. **No Supabase CLI** - Do not use Supabase CLI commands. The user handles database migrations manually.

3. **No automatic builds** - Do not run `npm run build` at the end of every request. Only run builds when specifically asked.

4. **No pushing to origin** - Do not run `git push` unless specifically asked to do so.

## Subject UUIDs (used throughout the app)

- Physics: `11111111-1111-1111-1111-111111111111`
- Mathematics: `22222222-2222-2222-2222-222222222222`
- Russian: `33333333-3333-3333-3333-333333333333`

## What's Wired to Supabase

- **Syllabus/Topics** - `useTopics` hook, `useSubject`/`useSubjects` hooks
- **Practice Notes** - `usePracticeNotes`, `usePracticeNote` hooks (full CRUD)
- **Todos** - `useTodos` hook (full CRUD)
- **Exam Countdown** - Hardcoded (exam dates don't change)
- **Dashboard Progress** - Uses `useSubjects` for real stats

## RLS Policies

RLS is enabled on all tables but policies are permissive (`USING (true)`) because:
- Clerk handles authentication, not Supabase Auth
- JWT-based policies don't work with Clerk's auth flow
- App logic controls access via user_id checks in hooks

## Pending Issues

- **Clerk SSL** - Custom domain `accounts.learn.tiggymathieson.com` has SSL provisioning issue. Clerk support ticket raised. CAA records updated to allow letsencrypt.org and pki.goog.

## Next Up

- Schedule generator (needs to be done with Tiggy)
- Dashboard could show today's scheduled sessions once schedule is built
