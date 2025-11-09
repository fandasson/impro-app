# IMPROvariace App - Architecture Guide

A Next.js 14 application for managing interactive question-and-answer sessions during improv performances. The app serves three distinct user roles: admins (question management), performers/audience (real-time visibility), and audience members (answering questions).

## Core Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components by default)
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **State Management**: Zustand (with persistence for users store)
- **Styling**: Tailwind CSS + Radix UI components
- **Real-time**: Supabase PostgreSQL changes subscriptions via Supabase Realtime
- **Auth**: Supabase Auth (with session cookie management via @supabase/ssr)
- **UI Components**: Custom built on top of Radix UI primitives

## App Routes Structure

### Admin Routes (`/admin/*`)
- **`/admin`**: Performances list (server component, requires auth)
- **`/admin/performances/[performanceId]`**: Performance detail and question management
- **`/admin/performances/[performanceId]/add-question`**: Create new question form
- **`/admin/performances/[performanceId]/question-pools`**: Manage question pools
- **`/admin/performances/[performanceId]/question-pools/[poolId]`**: Pool detail and results
- **`/admin/questions/[questionId]/edit`**: Edit question (form with player assignment)
- **`/admin/questions/[questionId]/view`**: View question and manage answers

**Key Patterns**:
- Server components for data fetching and auth enforcement
- Uses `revalidatePath()` for ISR (Incremental Static Regeneration)
- Direct Supabase queries via server actions

### Audience Routes (`/audience/*`)
- **`/audience`**: Main audience view (server-rendered, fetches active performance)
  - Routes based on performance state: `intro` → `life` → `closing`
  - Shows intro, question detail, or upcoming performances
- **Layout**: Full-width black background container
- **Real-time Updates**: Subscribed to performance state changes

### User/Question Routes (`/question/[questionId]`)
- **`/question/[questionId]`**: Client component, loads question via hook
  - Uses `useQuestion()` hook for fetching and real-time sync
  - Renders different question type components dynamically

### Auth Routes (`/auth/*`)
- **`/auth/user`**: GET endpoint that generates/returns anonymous user ID (UUID stored in cookie)
- **`/auth/callback`**: OAuth callback handler (Supabase auth flow)

### Login Routes (`/login`)
- Supabase OAuth login flow

## Database Schema & Entity Types

### Core Entities

**Performances**
- `id`, `name`, `date`, `state` (draft|intro|life|finished|closing)
- `intro_text`: HTML for intro screen
- `url_slug`: URL identifier
- Junction: `performances_players` (many-to-many with players)

**Questions**
- `id`, `name`, `question`, `type` (text|player-pick|voting|match|options|info|select)
- `performance_id`: Links to performance
- `state` (draft|active|locked|answered): Controls visibility
- `audience_visibility` (hidden|question|results): Controls audience display
- `pool_id`: Optional grouping in voting pools
- `index_order`: Display order
- `multiple`: For multi-select options
- `following_question_id`: For conditional questions
- Junction: `questions_players` (many-to-many with players)

**Answers** (Multiple tables by type):
- `answers_text`: Open-ended responses with optional `favorite` and `drawn` fields
- `answers_vote`: Voting answers linking user to player choice
- `answers_match`: Matching answers (character-to-player)
- `answers_options`: Multiple choice selections
- All include `user_id` (anonymous UUID), `question_id`

**Supporting Entities**:
- `characters`: Optional character list for matching questions
- `questions_options`: Multiple choice options
- `questions_pool`: Grouped voting questions (with `audience_visibility` boolean)
- `players`: Available performers/characters for questions

### Type System Organization

**File**: `/utils/supabase/entity.types.ts`
- Supabase auto-generated types via `types:gen` script
- Exports: `Database`, `Tables<>`, `TablesInsert<>`, `TablesUpdate<>`, `Enums<>`

**File**: `/api/types.api.ts`
- Type aliases: `type Answer = ...`, `type Question = Tables<"questions">`
- Complex types: `QuestionDetail`, `QuestionWithPlayersAndCharacters`, `PlayerWithPhotos`
- Answer insert types (omit `user_id`): `TextAnswerInsert`, `VoteAnswerInsert`, etc.
- Response wrapper types: `AnswersResponse<T>`

## API Layer - Server Actions Pattern

All API calls are **server actions** (marked with `"use server"`), organized by domain:

### `/api/questions.api.ts`
- **Fetch**: `fetchQuestion()`, `fetchQuestions()`, `fetchQuestionPlayers()`, `fetchQuestionCharacters()`, `fetchQuestionOptions()`, `fetchActiveOrLockedQuestion()`, `findQuestion()`
- **Mutate**: `createQuestion()`, `updateQuestion()`, `setQuestionState()`, `setAudienceVisibility()`, `hideAllForQuestion()`, `getNewIndexOrder()`
- **Pattern**: Uses React's `cache()` for deduplication within request
- **Revalidation**: Calls `revalidatePath()` on mutations to invalidate ISR

### `/api/answers.api.ts`
- **Fetch**: `fetchTextAnswers()`, `fetchVoteAnswers()`, `fetchMatchingAnswers()`, `fetchOptionsAnswers()`, `fetchPoolVoteAnswers()`, `fetchMatchingQuestionResults()` (RPC call)
- **Mutate**: `removeTextAnswers()`, `favoriteTextAnswer()`, `randomDrawAnswer()`
- **Pattern**: Generic `useAnswers<T>()` hook pattern (see below)

### `/api/submit-answer.ts`
- **Mutate**: `submitTextAnswer()`, `submitVoteAnswer()`, `submitMatchAnswer()`, `submitOptionsAnswer()`
- **Validation**: `submitVoteAnswer()` validates question state before accepting
- **Pattern**: Extracts `user_id` from cookie, throws if missing

### `/api/performances.api.ts`
- **Fetch**: `fetchPerformances()`, `fetchPerformance()`, `fetchVisiblePerformance()`, `fetchAvailablePlayers()`
- **Mutate**: `setPerformanceState()`
- **Note**: `fetchVisiblePerformance()` filters by state in (intro|life|closing)

### `/api/question-pools.api.ts`
- **Fetch**: `fetchAvailablePools()`, `fetchQuestionPool()`, `fetchVisiblePool()`
- **Mutate**: `setPoolAudienceVisibility()` (hides other pools and questions)

### `/api/web.api.ts`
- **Integrates**: External WordPress API (improvariace.cz)
- **Export**: `getUpcomingPerformances()` - fetches performances with venues, media, CTAs
- **Caching**: Next.js `revalidate: 3600` for 1-hour cache

### `/api/photos.api.ts`
- Stubbed API for fetching player photos

## State Management - Zustand Stores

### `/store/admin.store.ts`
- **State**:
  - `answers: Answer[]` - Answers for current question
  - `loading: boolean`
- **Mutations**: `setAnswers()`, `addAnswer()`, `modifyAnswer()`, `removeAnswer()`, `removeAnswers()`
- **Used By**: Admin answer display components with real-time subscriptions

### `/store/audience.store.ts`
- **State**:
  - `question: Question | null`
  - `pool: QuestionPool | null`
  - `loading: boolean`
- **Mutations**: `setQuestion()`, `setPool()`, `setLoading()`
- **Used By**: Audience-facing components

### `/store/users.store.ts` (Persisted)
- **State**:
  - `userId?: string` - Anonymous UUID
  - `question: Question | null`
  - `performance: Performance | null`
  - `answeredQuestions: Record<number, boolean>` - Track answered state
  - `answers: Record<number, string | number>` - Cached user answers
  - `onboarding: { completed, currentStep }` - Onboarding progress
- **Persistence**: Uses Zustand persist middleware → localStorage (`user-storage`)
- **Used By**: User question components, AuthUser wrapper

## Real-time Data Synchronization

### Pattern: Supabase PostgreSQL Changes

All real-time subscriptions follow this pattern:

```typescript
const supabase = createClient(); // Browser client
const channel = supabase
  .channel("unique-channel-name")
  .on<EntityType>(
    "postgres_changes",
    {
      event: "INSERT|UPDATE|DELETE",
      schema: "public",
      table: "table_name",
      filter: "column=eq.value", // Optional filtering
    },
    (payload) => {
      // Handle payload.new / payload.old / payload.old_image
      updateState();
    }
  )
  .subscribe();

// Cleanup on unmount:
return () => supabase.removeChannel(channel);
```

### Subscription Channels

**Admin Context** (hooks/admin.hooks.ts):
- `useTextAnswers()`, `useVoteAnswers()`, `useMatchingAnswers()`, `useOptionsAnswers()`
- **Pattern**: Generic `useAnswers<T>(table, questionId, fetcher)`
- **Subscribes**: INSERT and UPDATE events for current question
- **Updates**: Via `addAnswer()` and `modifyAnswer()` Zustand actions

**User Context** (hooks/users.hooks.ts):
- `useActiveOrLockedQuestion()`: Watches for active/locked state changes
- `usePerformance()`: Watches for state changes (e.g., intro→life→closing)
- **Filters**: Listens to specific performance_id updates

**Audience Context** (hooks/audience.hooks.ts):
- `useQuestion()`: Watches audience_visibility changes (question|results|hidden)
- `usePool()`: Watches pool audience_visibility boolean changes
- **Effect**: Automatically clears state when visibility changes to hidden

### Limitation

Real-time subscriptions require browser client (`createClient()` from `utils/supabase/client.ts`). Server components cannot establish subscriptions; they fetch initial data server-side, and client components hydrate with hooks.

## Supabase Integration

### Client Initialization

**Server Context** (`utils/supabase/server.ts`):
```typescript
export const createClient = (cookieStore) => createServerClient<Database>(..., {
  cookies: { get, set, remove } // Manages session cookies
})
```

**Browser Context** (`utils/supabase/client.ts`):
```typescript
export const createClient = () => createBrowserClient(...) // Deprecated; used only for real-time
```

### Session Management

- **Middleware** (`utils/supabase/middleware.ts`): Refreshes auth tokens on every request via `getUser()`
- **Auth Endpoint** (`app/auth/user/route.ts`): Generates anonymous UUID, stored in cookie `COOKIE_USER_ID`
- **Component** (`components/users/AuthUser.tsx`): Client wrapper that calls `/auth/user` on mount, stores UUID in Zustand

### Authentication Flow

1. Anonymous users land on `/audience` or `/question/[questionId]`
2. `AuthUser` component wrapper calls `/auth/user` → generates/retrieves UUID
3. UUID stored in cookie + Zustand (persisted to localStorage)
4. All answer submissions include this `user_id`
5. Admins use Supabase auth (email/OAuth) to access `/admin` routes

## Question Type Handling

### Question Types (Enum)
- `text`: Open-ended text responses
- `player-pick`: Match/assign to player
- `voting`: Vote for a player
- `match`: Match characters to players
- `options`: Multiple choice
- `info`: Display-only (no responses)
- `select`: Dropdown selection

### Component Mapping

**User Components** (`components/users/questions/`):
- `TextQuestion.tsx`: Text input with submit
- `PlayersVotingQuestion/PlayersVotingQuestion.tsx`: Vote buttons
- `MatchQuestion/MatchQuestion.tsx`: Drag-and-drop character matching
- `OptionsQuestion.tsx`: Radio/checkbox options
- `InfoQuestion.tsx`: Display only
- `UserQuestionDetail.tsx`: Router (renders based on type)

**Audience Components** (`components/audience/answers/`):
- `TextQuestionAnswers.tsx`: Display text answers with favorite/draw
- `PlayersVotingAnswers.tsx`: Show vote counts
- `PoolVotingAnswers.tsx`: Voting results within question pool
- `MatchAnswer.tsx`: Display match results
- `VotingAnswers.tsx`: Inline voting display
- `TextResults.tsx`: Final text results

## Question Visibility Management

### Three-Layer Visibility System

**Question State** (controls answering):
- `draft`: Not shown to anyone
- `active`: Users can answer; admin can see answers
- `locked`: No more answers accepted; admin reviews
- `answered`: Results shown; no new answers

**Audience Visibility** (controls audience display):
- `hidden`: Not visible to audience
- `question`: Show question to audience (they can answer)
- `results`: Show results only (voting completed)

**Pool Visibility** (overrides individual questions):
- `audience_visibility: boolean` on `questions_pool`
- When pool is visible, grouped voting questions show results
- Setting pool visible hides all individual question visibility

### State Transitions

**Admin Controls**:
- `setQuestionState()`: Admin moves question through draft→active→locked→answered
  - When setting new state, auto-hides all other active questions
- `setAudienceVisibility()`: Admin controls what audience sees
  - Setting visibility hides all other visible questions and pools
- `setPoolAudienceVisibility()`: Toggle pool visibility
  - Hides all individual questions when pool is shown

**Audience View**:
- Audience component filters questions by `audience_visibility` in (question|results)
- Real-time subscription updates audience display when state changes

## Component Organization

### Layout Components
- `/components/ui/layout/TabletContainer.tsx`: Admin layout (desktop-first)
- `/components/ui/layout/CenteredContainer.tsx`: Audience layout (centered black background)
- `/components/ui/layout/MobileContainer.tsx`: Mobile-responsive container

### UI Primitives
- `Button`, `Input`, `Label`, `Select`, `Switch`, `Textarea`, `Badge`, `Table`
- Drag-and-drop: `Draggable`, `Droppable` (@dnd-kit)
- Toggle: `Toggle`, `ToggleGroup` (Radix)

### Admin Components
- **Questions**: Question list, form, editing
- **Answers**: Type-specific answer displays (text, voting, matching)
- **Performance**: State toggle (draft→intro→life→closing)
- **Pools**: Pool visibility management

### User Components
- **Questions**: Type-specific question forms
- **Onboarding**: Welcome/instructions flow
- **Sharing**: QR codes and social sharing actions

### Audience Components
- **Display**: Real-time question and answer rendering
- **Index**: Router logic based on performance state

## Authentication & Authorization

### Current Implementation

- **Anonymous Users** (audience/users): UUID-based identification (not secure)
  - No password required
  - Tracked via cookie + localStorage
  - Each browser/device gets unique ID
  - Vulnerability: Can spoof userId in requests

- **Admins** (admin routes): Supabase Auth required
  - Email/password or OAuth
  - Session managed via Supabase + middleware cookie refresh
  - Check: `const user = await supabase.auth.getUser()`

### Potential Issues

1. **Missing RLS (Row-Level Security)**: No Supabase policies visible; any authenticated user could query any data
2. **User ID Spoofing**: Browser can manipulate cookie/localStorage
3. **Admin Auth**: Only checked at route level; no fine-grained permissions

## Data Flow Examples

### User Answering a Text Question

1. User loads `/question/[questionId]` (client component)
2. `useQuestion()` hook fetches question details via `fetchQuestion()` (server action)
3. Question rendered; user types response and submits
4. `submitTextAnswer()` server action called
5. Action extracts `user_id` from cookie, inserts into `answers_text`
6. Admin's real-time subscription (`useTextAnswers()`) fires INSERT event
7. `addAnswer()` updates Zustand store
8. Answer appears in admin UI instantly

### Admin Changing Question Visibility

1. Admin clicks toggle on question detail page
2. `setAudienceVisibility()` server action called
3. Action:
   - Sets other questions to `hidden`
   - Sets target question to desired state
   - Calls `revalidatePath()` to bust ISR cache
4. Server component re-renders with new state
5. Audience's `useQuestion()` subscription fires UPDATE event
6. If visibility changed to `hidden`, audience display clears via `setQuestion(null)`

### Audience Watching Voting Pool Results

1. Performance moves to `life` state
2. Admin enables pool visibility via `setPoolAudienceVisibility()`
3. Audience's `usePool()` subscription fires UPDATE event
4. `AudienceIndex` renders `AudiencePoolResults` component
5. Real-time answer updates displayed as users vote

## Key Architectural Decisions

1. **Server Actions for All Mutations**: Simplifies auth, avoids API route boilerplate
2. **Client-Side Real-time Only**: Server components fetch initial state; browser clients handle subscriptions
3. **Persisted User Store**: Retains performance/question context across refreshes
4. **No API Routes**: RESTful endpoints for questions/answers not exposed; all via server actions
5. **Visibility Management via Enums**: Type-safe state machine for question visibility
6. **Zustand Over Context**: Simpler state management for real-time updates
7. **External CMS Integration**: WordPress API for upcoming performances (decoupled)

## Development Workflow

### Type Generation
```bash
pnpm run types:gen  # Regenerate from Supabase schema
```

### Environment Setup
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...  # Server-side only
```

### Common Tasks
- **Add Question Type**: Create component + add enum value + update question form
- **Add Answer Type**: Create table + api functions + admin/audience components
- **Change Visibility Logic**: Modify `setAudienceVisibility()` + add subscription filter
- **Add Audience Feature**: Create audience component + hook with Supabase subscription

## Performance Considerations

1. **ISR via revalidatePath()**: Admin mutations invalidate paths, allowing incremental static regeneration
2. **React.cache()**: Server-side deduplication of identical requests (e.g., same player fetch)
3. **Supabase Subscriptions**: Real-time pushes reduce polling; potential for too many connections
4. **No Pagination**: All answers loaded at once; could be problematic with thousands of responses
5. **Client Bundle**: Zustand + Supabase realtime adds ~100KB to bundle

## Testing & Debugging

- No test files present; coverage not enforced
- Real-time subscriptions best debugged via Supabase Studio (monitoring)
- Middleware cookie logs in server console
- Anonymous user ID visible in browser DevTools Storage

---

**Last Updated**: Analysis of v2.0.0 branch
**Stack**: Next.js 15 + Supabase + Zustand
