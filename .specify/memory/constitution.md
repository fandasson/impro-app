<!--
  Sync Impact Report
  ==================
  Version Change: [NEW] → 1.0.0

  Modified Principles:
  - ADDED: I. Real-time First
  - ADDED: II. Server Actions & ISR
  - ADDED: III. Test-First (Non-Negotiable)

  Added Sections:
  - Role-Based Architecture
  - Development Workflow
  - Governance

  Removed Sections: N/A (initial constitution)

  Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md - Constitution Check aligned
  ✅ .specify/templates/spec-template.md - Testing requirements aligned
  ✅ .specify/templates/tasks-template.md - Test-first workflow aligned
  ⚠  .specify/templates/agent-file-template.md - Review for real-time patterns

  Follow-up TODOs: None
-->

# IMPROvariace App Constitution

## Core Principles

### I. Real-time First

All features MUST support real-time updates via Supabase PostgreSQL changes subscriptions. State changes (question visibility, answer submissions, performance state transitions) MUST be visible to all roles (Admin/Audience/User) instantly without polling or manual refresh.

**Rules**:
- Every client component displaying dynamic data MUST establish a Supabase channel subscription
- INSERT and UPDATE events MUST trigger immediate store updates (Zustand actions)
- Filter subscriptions by entity ID (e.g., `question_id`, `performance_id`) to minimize payload
- Clean up channels on component unmount to prevent memory leaks
- Server components fetch initial state; client components hydrate with real-time hooks

**Rationale**: The improv performance experience depends on synchronized state across devices. Admin changes (activating questions, locking answers) must propagate instantly to audience screens and user devices. Polling introduces lag and degrades the live experience.

### II. Server Actions & ISR

All data mutations MUST use Next.js server actions (marked `"use server"`). All data fetching in server components MUST use React's `cache()` for request deduplication. ISR (Incremental Static Regeneration) MUST be triggered via `revalidatePath()` after mutations.

**Rules**:
- NO client-side API routes (`/api/*` endpoints) for CRUD operations
- Server actions organize by domain: `questions.api.ts`, `answers.api.ts`, `performances.api.ts`, `question-pools.api.ts`
- Extract `user_id` from cookies server-side; NEVER trust client-supplied IDs
- Wrap fetch functions with `cache()` to deduplicate within request lifecycle
- Call `revalidatePath(path)` in mutation actions to invalidate static pages
- Server actions handle auth checks via `supabase.auth.getUser()` for admin routes

**Rationale**: Server actions simplify auth enforcement, eliminate API boilerplate, and leverage Next.js's built-in caching. `revalidatePath()` enables dynamic content while preserving static generation benefits. This pattern reduces surface area for security issues (no client-exposed endpoints).

### III. Test-First (Non-Negotiable)

TDD MUST be followed for all new features and bug fixes. Write tests, get user approval, verify tests fail (Red), then implement (Green), then refactor (Refactor). Tests run before code commits.

**Rules**:
- Write tests FIRST: integration tests for user journeys, contract tests for server actions
- Get explicit user approval on test scenarios before implementation
- Run tests; verify ALL fail before writing implementation code
- Implement minimal code to make tests pass
- Refactor only after tests pass
- NO code commits without passing tests
- Focus areas: real-time subscription correctness, state visibility rules, answer submission validation

**Rationale**: The app's three-layer visibility system (question state × audience visibility × pool visibility) is complex. Untested state transitions risk breaking the live performance flow. TDD ensures correctness before deployment and documents expected behavior for future changes.

## Role-Based Architecture

The application serves three distinct roles with zero UI overlap:

**Admin** (`/admin/*`): Performance management, question lifecycle control (draft→active→locked→answered), answer review, visibility toggles. Requires Supabase authentication. Desktop-first layout via `TabletContainer`.

**Audience** (`/audience`): Passive display for projector/screen. Shows intro text, active question, or voting results based on performance state (intro|life|closing) and audience_visibility settings. Real-time synchronized. Full-width black background via `CenteredContainer`.

**User** (`/question/[questionId]`): Mobile-first question answering. Anonymous UUID-based identification (cookie + localStorage via Zustand persistence). Onboarding flow, answer submission, "already answered" state tracking. Responsive via `MobileContainer`.

**Constraints**:
- NO cross-role component reuse (separate `components/admin/`, `components/audience/`, `components/users/`)
- Each role subscribes only to relevant real-time events (no global subscriptions)
- Admin routes MUST enforce Supabase auth; user routes MUST generate/retrieve anonymous UUID via `/auth/user`

## Development Workflow

1. **Feature Planning**: Use `/speckit.plan` to generate `plan.md` with architecture decisions
2. **Test Writing**: Draft integration/contract tests in `tests/` (currently no test infrastructure—add Jest + Supabase test client)
3. **User Approval**: Review test scenarios with stakeholders
4. **Red-Green-Refactor**: Verify tests fail → implement → verify tests pass → refactor
5. **Real-time Validation**: Manually test subscriptions across multiple browsers/devices
6. **Deployment**: Push to Vercel; verify Supabase connection via `NEXT_PUBLIC_SUPABASE_URL`

**Commit Standards**:
- Prefix: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`
- Include test coverage summary if TDD followed
- Reference issue/story number if applicable

## Governance

This constitution supersedes conflicting practices in README.md, CLAUDE.md, or legacy code comments. When architectural decisions conflict with these principles, file an exception request documenting:
1. Which principle is violated
2. Why the exception is necessary
3. What simpler alternatives were rejected and why

**Amendment Process**:
1. Propose change via documented rationale (GitHub issue or design doc)
2. Get approval from project maintainer(s)
3. Update this file using `/speckit.constitution` command
4. Increment version per semantic versioning:
   - **MAJOR**: Backward-incompatible governance changes (e.g., removing real-time requirement)
   - **MINOR**: New principle or materially expanded section (e.g., adding security principle)
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
5. Run `/speckit.analyze` to verify cross-artifact consistency

**Compliance Reviews**:
- Every PR MUST pass Constitution Check in `plan.md` (gates implementation)
- Code reviewers MUST verify real-time subscription correctness and server action usage
- Quarterly audits: scan for unapproved API routes, missing `revalidatePath()` calls, untested features

**Guidance File**: Use `/Users/f.pac/_work/impro-app/CLAUDE.md` (project-specific) and `/Users/f.pac/.claude/CLAUDE.md` (global) for runtime development patterns not covered here.

**Version**: 1.0.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17
