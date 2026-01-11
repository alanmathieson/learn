# Claude Code Guidelines for TiggyLearn

## Development Workflow

1. **Never start a local server** - The user manages and runs the dev server themselves.

2. **No Supabase CLI** - Do not use Supabase CLI commands. The user handles database migrations manually.

3. **No automatic builds** - Do not run `npm run build` at the end of every request. Only run builds when specifically asked.

4. **No pushing to origin** - Do not run `git push` unless specifically asked to do so.
