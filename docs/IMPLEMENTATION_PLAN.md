# VantageBrief Implementation Plan

## Purpose

This document controls the order in which VantageBrief is designed, implemented, reviewed, tested, and deployed.

VantageBrief must be developed one approved phase at a time.

Codex must not begin a later phase, add future features, or redesign an approved screen unless explicitly instructed.

---

# Current Project Status

```text
Current phase: Phase 6 — Structured Brief and Email Experience
Current screen: Opportunity Brief and explicit email delivery
Implementation status: Implemented — awaiting n8n email-status contract update, live verification, approval, and merge
Production deployment: Not started
n8n workflow status: Functional and published
```

Update this section whenever a phase is approved or completed.

---

# Development Rules

Before starting any task:

1. Read `AGENTS.md`.
2. Read all relevant files in `docs/`.
3. Inspect the current repository state.
4. Confirm the active phase.
5. Implement only the explicitly requested scope.
6. Do not begin the next phase automatically.
7. Do not add unapproved features.
8. Do not replace approved copy or design decisions.
9. Do not install dependencies without a clear requirement.
10. Do not claim that anything works unless it has been tested.

---

# Implementation Strategy

VantageBrief will be implemented through seven controlled phases.

```text
Phase 1 — Project Foundation
Phase 2 — Premium Landing Page
Phase 3 — Workspace Onboarding
Phase 4 — Discovery Workspace
Phase 5 — API and n8n Integration
Phase 6 — Structured Brief and Email Experience
Phase 7 — Quality Assurance and Deployment
```

Each phase has:

- Scope
- Deliverables
- Required tests
- Completion criteria
- Approval gate

A phase is complete only after its completion criteria are met and the user approves it.

---

# Phase 1 — Project Foundation

## Objective

Create a clean, stable, tested Next.js foundation that follows the approved architecture and design system.

Do not implement the full landing page or workspace during this phase.

---

## Scope

Create and configure:

- Next.js App Router project
- TypeScript
- Tailwind CSS
- ESLint
- Approved font loading
- Global design tokens
- Basic route structure
- Redux Toolkit foundation
- RTK Query foundation
- Zod validation foundation
- Testing foundation
- Environment-variable template
- Base metadata
- Initial reusable UI primitives

---

## Required dependencies

Install only approved packages required by the architecture.

Expected core dependencies:

```text
next
react
react-dom
@reduxjs/toolkit
react-redux
zod
lucide-react
```

Expected development dependencies:

```text
typescript
tailwindcss
eslint
vitest
jsdom
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
@playwright/test
```

Optional dependencies must not be added unless justified by an active requirement.

React Hook Form may be added in Phase 3 if onboarding complexity justifies it.

---

## Required routes

Create route shells only:

```text
/
 /workspace
 /api/chat
```

Expected behavior during Phase 1:

- `/` displays a minimal approved project-foundation screen.
- `/workspace` displays a minimal workspace placeholder.
- `/api/chat` returns a safe temporary not-implemented response or remains unimplemented until Phase 5.

Do not build detailed marketing sections during this phase.

---

## Required project structure

Create only the files required for the active foundation.

Expected initial structure:

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
└── workspace/
    └── page.tsx

components/
├── providers/
│   └── ReduxProvider.tsx
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    └── StatusIndicator.tsx

store/
├── index.ts
└── hooks.ts

lib/
├── constants.ts
└── env.ts

types/

tests/
└── setup.ts
```

Do not create every future component from `ARCHITECTURE.md` in advance.

---

## Design foundation

Configure the approved fonts:

```text
Display: Instrument Serif
Interface: Manrope
```

Use `next/font` where supported.

Configure global CSS variables for:

- Colors
- Typography
- Spacing
- Border radii
- Shadows
- Motion
- Container widths

Do not use generic default Tailwind styling as the finished design.

---

## Redux foundation

Create:

- Store configuration
- Typed `RootState`
- Typed `AppDispatch`
- Typed `useAppDispatch`
- Typed `useAppSelector`
- Workspace-only Redux provider

Do not add all slices in advance.

Add slices only when their phase requires them.

---

## Testing foundation

Configure:

- Vitest
- React Testing Library
- jest-dom matchers
- Playwright
- Type-checking script
- Test setup file

Add at least one meaningful test proving the testing environment works.

Do not create placeholder tests that assert only that `true` is `true`.

---

## Environment foundation

Create `.env.example` with empty values:

```text
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
N8N_WEBHOOK_HEADER_NAME=x-briefflow-key
N8N_REQUEST_TIMEOUT_MS=60000
```

Ensure `.env.local` is ignored by Git.

Do not place real credentials in the repository.

---

## Phase 1 verification

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Verify:

- Both routes load
- Approved fonts load
- Design tokens are active
- Redux provider works
- No secret is committed
- No console errors appear
- No broken imports exist
- Mobile viewport has no horizontal overflow

---

## Phase 1 completion criteria

Phase 1 is complete only when:

- The Next.js application runs locally
- TypeScript strict mode is enabled
- Tailwind is configured
- Approved fonts are active
- Design tokens are defined
- Redux Toolkit is configured
- Testing tools are configured
- `.env.example` exists
- Build succeeds
- Lint succeeds
- Type checking succeeds
- Tests succeed
- No later-phase UI has been implemented

---

## Phase 1 approval gate

Stop after completing Phase 1.

Report:

1. Files created
2. Dependencies installed
3. Commands executed
4. Test results
5. Build result
6. Any unresolved issue

Do not start Phase 2 until explicitly approved.

---

# Phase 2 — Premium Landing Page

## Objective

Build the complete VantageBrief marketing landing page as a premium, light, editorial B2B product experience.

Implement one screen or section at a time.

---

## Implementation order

```text
2.1 Landing header and hero
2.2 Core business value
2.3 How it works
2.4 Use cases
2.5 Final CTA
2.6 Footer
2.7 Responsive refinement
2.8 Landing-page testing
```

Each major section should be reviewed before the next section is implemented.

---

## Landing header

Include:

- VantageBrief wordmark
- How It Works
- Use Cases
- Start a Brief

Destinations:

```text
Logo → /#top
How It Works → /#how-it-works
Use Cases → /#use-cases
Start a Brief → /workspace
```

Requirements:

- Minimal navigation
- Accessible links
- Responsive mobile menu
- Clear focus states
- No login
- No pricing
- No generic mega-menu
- No unimplemented links

---

## Hero first viewport

Include:

- Product category label
- Primary headline
- Supporting copy
- Primary CTA
- Secondary CTA
- Restrained capability line
- Focused product preview

Approved headline:

> Turn business conversations into decision-ready briefs.

Approved primary CTA:

```text
Start discovery
```

Approved secondary CTA:

```text
See how it works
```

The first viewport must not contain the entire workspace.

---

## Hero preview

The visual preview should communicate:

```text
Conversation
→ Structured insight
→ Opportunity Brief
→ Email confirmation
```

Requirements:

- Large enough to read
- Not a complete dashboard
- No microscopic UI
- No fake statistics
- No fake client data
- No fake testimonials
- No generic robot imagery

---

## Core business value

Communicate three outcomes:

```text
Understand
Structure
Act
```

Each outcome must explain a practical business benefit.

Avoid generic feature-card language.

---

## How it works

Approved stages:

```text
01 Describe the challenge
02 Explore the current workflow
03 Clarify requirements
04 Receive a structured brief
```

Use deliberate editorial layout rather than a generic icon grid.

---

## Use cases

Approved use cases:

- Workflow automation discovery
- AI agent consultation
- Client project intake
- Custom product planning

Each card or section must describe the result for the user.

---

## Final CTA

Approved heading:

> Turn the conversation into your next move.

Primary action:

```text
Start a Brief
```

---

## Footer

Include:

- Shared VantageBrief wordmark and tagline
- Product links for How It Works, Use Cases, and Start a Brief
- Deferred Company and Legal items marked Coming soon
- Deferred LinkedIn presence without an invented URL
- Dynamic copyright year
- “Built for better business conversations.”

About, Contact, Support, and legal routes remain deferred to Phase 7.

---

## Landing-page UX requirements

Include:

- Smooth in-page navigation
- Visible hover states
- Visible focus states
- Responsive CTA behavior
- No layout shifts
- Reduced-motion support
- Correct mobile stacking
- No horizontal overflow
- Clear visual hierarchy

---

## Landing-page tests

### Unit and component tests

Test:

- Header links
- CTA destinations
- Mobile navigation
- Accessible menu behavior
- Product preview semantics where relevant

### End-to-end tests

Test:

- Landing page loads
- Start discovery opens `/workspace`
- See how it works scrolls correctly
- Header navigation works
- Mobile menu works
- No horizontal overflow
- Keyboard navigation works

### Visual tests

Capture:

```text
Landing hero at 1440px
Landing hero at 1024px
Landing hero at 390px
Complete landing page at 1440px
Complete landing page at 390px
```

---

## Phase 2 completion criteria

Phase 2 is complete only when:

- All approved sections exist
- The first viewport remains uncluttered
- The design follows `DESIGN_SYSTEM.md`
- The route is responsive
- CTAs work
- Accessibility checks pass
- Landing-page tests pass
- Build passes
- The user approves the complete landing page

---

# Phase 3 — Workspace Onboarding

## Objective

Build the first controlled interaction inside `/workspace`.

The user must complete onboarding before the conversation begins.

---

## Scope

Implement:

- Workspace shell
- Workspace header
- Onboarding panel
- Name field
- Business or company name field
- Work email field
- Role selection
- Initial business challenge or opportunity field
- Validation
- Redux user state
- Session creation
- Local persistence
- Responsive onboarding
- Accessibility
- Tests

Do not connect n8n during this phase.

---

## Approved onboarding copy

Heading:

> Let’s understand your business first.

Supporting copy:

> Share your context and current challenge. VantageBrief will use it to prepare a more focused discovery session.

Email explanation:

> Used only for this discovery session and a brief you explicitly request.

Privacy explanation:

> Your information is used only to personalize this discovery session.

Primary action:

```text
Continue to Workspace
```

---

## Workspace roles

```text
Business owner or executive
Operations
Strategy or consulting
Sales or business development
Product or technology
Another role
```

---

## Validation requirements

Full name:

- Required
- Trimmed
- Maximum 100 characters

Business or company name:

- Required
- Trimmed
- Maximum 120 characters

Email:

- Required
- Valid email format
- Maximum 254 characters
- Normalized to lowercase

Role:

- Required

Initial challenge or opportunity:

- Required
- Trimmed
- Maximum 1,500 characters

Show validation near the relevant field.

Move focus to the first invalid field after submission.

---

## Session requirements

On successful onboarding:

1. Generate a secure session ID using `crypto.randomUUID()`.
2. Save the user profile in Redux.
3. Save the session in Redux.
4. Persist approved data locally.
5. Transition to the empty workspace.
6. Do not send a backend request yet.

---

## Redux implementation

Add:

- `userSlice`
- `sessionSlice`
- Typed selectors
- Slice tests
- Persistence validation

Do not add conversation, brief, or email slices until their phases.

---

## Onboarding tests

Test:

- Empty form submission
- Invalid email
- Missing role
- Missing challenge
- Successful onboarding
- Name trimming
- Email normalization
- Keyboard navigation
- Role selection
- Local persistence
- Refresh recovery
- Mobile layout
- Long name
- Long email address

---

## Phase 3 completion criteria

Phase 3 is complete only when:

- Onboarding works without backend integration
- Validation is accessible
- Redux state is typed
- Session ID is generated correctly
- Local persistence works
- Refresh restores onboarding completion
- Mobile design is approved
- Tests pass
- Build passes

---

# Phase 4 — Discovery Workspace

## Objective

Build the complete frontend discovery experience using mocked responses.

Do not connect to the real n8n workflow yet.

---

## Scope

Implement:

- Workspace header
- Discovery progress
- Conversation panel
- Message list
- User messages
- AI messages
- Suggested prompts
- Composer
- Loading state
- Error state
- Retry behavior
- Opportunity Brief
- Mobile Conversation and Brief tabs
- New-session dialog
- Redux conversation state
- Redux brief state
- Mocked API behavior
- Tests

---

## Empty workspace

Display:

- Personalized welcome
- Suggested prompts
- Empty Opportunity Brief state
- Discovery progress at initial state

Approved empty brief message:

> Your brief will take shape as the conversation develops.

---

## Suggested prompts

Include examples such as:

```text
Our team spends too much time on manual follow-ups.
We want to automate a repetitive internal process.
We are exploring an AI assistant for our business.
We need help structuring a new software product.
```

Selecting a prompt should populate the composer without immediately sending it.

---

## Message composer

Requirements:

- Multiline input
- Shift + Enter creates a new line
- Enter submits when appropriate
- Duplicate requests prevented
- Message preserved on failure
- Maximum 4000 characters
- Visible send state
- Accessible label
- Mobile keyboard compatibility

---

## Conversation behavior

Use mocked asynchronous responses to verify:

- Optimistic user message
- Loading state
- Assistant response
- Failure state
- Retry state
- Long response
- Multiple messages
- Auto-scroll behavior

---

## Opportunity Brief

Implement the document-like panel with:

- Business context
- Primary objective
- Current challenge
- Existing workflow
- Tools and integrations
- Recommended direction
- Expected operational value
- Open questions
- Recommended next step

Use structured mock data.

Do not parse assistant text to populate the brief.

---

## Discovery progress

Stages:

```text
Context
Challenge
Workflow
Requirements
Direction
Brief
```

States:

```text
Not started
In progress
Identified
```

Do not add percentages or lead scores.

---

## Redux implementation

Add:

- `conversationSlice`
- `briefSlice`
- Selectors
- Listener middleware
- Persistence support
- Tests

---

## New-session behavior

A confirmed new session must:

- Generate a new session ID
- Clear conversation
- Clear brief
- Reset progress
- Preserve name and email
- Reset temporary errors
- Reset email state when it later exists

---

## Mobile workspace

Use accessible tabs:

```text
Conversation
Brief
```

Requirements:

- Tab state accessible by keyboard
- Composer remains visible
- No horizontal overflow
- Opportunity Brief readable
- New-session dialog usable
- Long messages wrap correctly

---

## Phase 4 tests

Test:

- Empty workspace
- Suggested prompts
- Message submission
- Loading state
- Assistant response
- Error state
- Retry action
- Long messages
- Brief updates
- Progress updates
- Persistence
- Refresh recovery
- New session
- Mobile tabs
- Keyboard navigation
- Reduced motion

---

## Phase 4 completion criteria

Phase 4 is complete only when:

- The full workspace works with deterministic mocked data
- No live n8n credits are used
- Redux state remains consistent
- Persistence works
- Mobile experience is approved
- Accessibility requirements pass
- Tests pass
- Build passes

---

# Phase 5 — API and n8n Integration

## Objective

Connect the approved frontend to the secured production n8n workflow through the Next.js server.

---

## Scope

Implement:

- `/api/chat`
- Environment validation
- n8n server client
- Authentication header
- Request validation
- Timeout handling
- Response validation
- Error normalization
- RTK Query integration
- Real conversation requests
- Session continuity
- Integration tests

---

## Security requirement

The browser must call only:

```text
POST /api/chat
```

The browser must never receive:

- n8n webhook URL
- n8n webhook secret
- Gmail credentials
- Gemini credentials

---

## Environment variables

Required:

```text
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
N8N_WEBHOOK_HEADER_NAME
N8N_REQUEST_TIMEOUT_MS
```

Do not prefix any secret with:

```text
NEXT_PUBLIC_
```

---

## Request validation

Validate:

- Message
- Session ID
- Name
- Email
- Starting intent
- Optional action

Reject malformed or oversized requests before contacting n8n.

---

## n8n request

Send:

```json
{
  "message": "User message",
  "sessionId": "session-id",
  "name": "User name",
  "email": "user@example.com",
  "intent": "improve_workflow",
  "action": "chat",
  "metadata": {
    "source": "vantagebrief-web",
    "requestId": "request-id",
    "timestamp": "ISO timestamp"
  }
}
```

---

## Timeout handling

Use `AbortController`.

Recommended timeout:

```text
60000ms
```

Return a safe retryable error after timeout.

---

## Response normalization

Validate every n8n response with Zod.

Do not return raw n8n errors to the browser.

Normalize responses into approved API types.

---

## RTK Query

Replace mocked communication with:

```text
POST /api/chat
```

Preserve:

- Optimistic messages
- Retry behavior
- Loading states
- Error states
- Session ID continuity

---

## Phase 5 live tests

Limit real tests to conserve credits.

Perform:

1. Normal conversation
2. Second message with same session ID
3. New session isolation
4. Invalid request rejection
5. Timeout simulation
6. Authentication failure handling
7. Malformed-response handling

Do not repeatedly trigger Gmail during this phase.

---

## Phase 5 completion criteria

Phase 5 is complete only when:

- The browser calls only `/api/chat`
- Secrets remain server-only
- Normal AI conversation works
- Memory works with the same session ID
- New sessions are isolated
- Errors are normalized
- Tests pass
- Build passes
- No webhook URL appears in browser requests

---

# Phase 6 — Structured Brief and Email Experience

## Objective

Complete the primary product differentiators:

- Structured Opportunity Brief
- Discovery progress from backend data
- Gmail brief action
- Verified email confirmation

---

## Part 6.1 — Structured n8n response

Extend the n8n workflow to return:

- `reply`
- `brief`
- `progress`
- `action`
- `emailStatus`
- `emailMessage`

The frontend must not infer the brief from assistant prose.

---

## Required brief fields

```text
Business context
Primary objective
Current challenge
Existing workflow
Tools and integrations
Recommended direction
Expected operational value
Open questions
Recommended next step
```

---

## Required progress fields

```text
Context
Challenge
Workflow
Requirements
Direction
Brief
```

---

## Part 6.2 — Email action

The `Email brief` button sends:

```json
{
  "action": "email_brief",
  "message": "Send me a structured summary of our conversation by email."
}
```

The request must preserve the validated onboarding fields and session ID used
by normal chat requests.

The n8n agent must:

1. Review memory
2. Create the summary
3. Call Gmail
4. Wait for Gmail success
5. Return confirmed action data

---

## Email processing states

The interface displays:

```text
Processing
```

This is a progress label only.

Do not display final success until the backend returns:

```json
{
  "emailStatus": "sent"
}
```

An action result, success flag, or assistant reply without this explicit field
must remain neutral and must not claim delivery.

---

## Email success state

Display:

> Your brief has been sent.

Include:

- Masked email address
- Completion timestamp when available
- Continue conversation
- Start new discovery

---

## Email failure state

Display:

> Your brief was prepared, but the email could not be sent. Please try again.

Requirements:

- Preserve conversation
- Preserve Opportunity Brief
- Offer retry
- Do not show raw error
- Do not claim delivery

---

## Redux implementation

Add:

- `emailSlice`
- Email selectors
- Email lifecycle actions
- Persistence exclusions
- Email tests

Do not persist temporary processing states after refresh.

---

## Phase 6 tests

### Mocked tests

Test:

- Structured brief response
- Partial brief
- Complete brief
- Progress updates
- Email processing
- Email success
- Email failure
- Duplicate email prevention
- Explicit retry
- Masked recipient
- Conversation preserved after success
- Conversation preserved after failure

### Live tests

Perform only deliberate tests:

1. Email request using a real session
2. Gmail tool execution
3. Email received successfully
4. HTML summary content verified
5. Failure behavior verified once
6. Confirmation shown only after success

---

## Phase 6 completion criteria

Phase 6 is complete only when:

- Structured brief data comes from n8n
- Progress updates correctly
- Gmail sends the summary
- Email success is verified
- Failure state is honest
- Email is masked in the UI
- Duplicate sending is prevented
- Tests pass
- Build passes

---

# Phase 7 — Quality Assurance and Deployment

## Objective

Polish, verify, deploy, and document the complete product.

---

## Scope

Complete:

- Full responsive review
- Accessibility review
- Performance review
- Visual consistency review
- Security review
- Unit tests
- Component tests
- API tests
- End-to-end tests
- Vercel deployment
- Production verification
- README completion
- Submission preparation

---

## Responsive review

Verify at:

```text
1440px
1280px
1024px
768px
390px
360px
```

Review:

- Landing page
- Onboarding
- Conversation workspace
- Opportunity Brief
- Email processing
- Email success
- Email failure
- Dialogs
- Mobile tabs
- Composer with mobile keyboard

---

## Accessibility review

Verify:

- Keyboard navigation
- Focus visibility
- Form labels
- Error associations
- Dialog focus management
- Tab semantics
- Status announcements
- Color contrast
- Reduced-motion behavior
- Touch targets
- Semantic heading order

---

## Security review

Verify:

- No secrets in repository
- No secrets in client bundle
- No n8n URL in browser requests
- No full emails in logs
- No raw internal errors
- Server-only environment imports
- Input validation
- Session validation
- Authentication header
- Prompt-injection recipient protection

Rotate the exposed development webhook secret before final deployment.

---

## Performance review

Verify:

- Landing-page JavaScript remains minimal
- Fonts do not cause major layout shift
- Images are optimized
- No unnecessary dependencies
- No excessive Redux rerenders
- No large unused client bundles
- No blocking decorative animation
- Reasonable Lighthouse results

Do not state a Lighthouse score unless it was measured.

---

## Final automated verification

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

All must pass before final deployment.

---

## Vercel deployment

Configure:

- Production project
- Environment variables
- Correct build command
- Correct framework detection
- Public URL
- Production n8n webhook
- Updated secret
- No preview secrets unless required

---

## Production verification

Test the deployed website:

1. Landing page loads
2. Workspace loads
3. Onboarding works
4. Normal conversation works
5. Memory works
6. Opportunity Brief updates
7. Email action works
8. Gmail receives the email
9. Success confirmation is correct
10. New session works
11. Mobile layout works
12. Browser console has no errors
13. Browser network does not reveal n8n
14. Metadata renders correctly

---

## Submission preparation

Prepare:

- Public Vercel URL
- Loom recording URL
- LinkedIn post URL
- GitHub repository URL when requested

The demonstration must show:

- Landing page
- Workspace onboarding
- Normal conversation
- Conversation memory
- n8n workflow
- Email brief request
- Gmail tool execution
- Email received
- Website success confirmation

---

## Phase 7 completion criteria

Phase 7 is complete only when:

- All automated checks pass
- Production deployment works
- Live Gmail test succeeds
- Security review passes
- Responsive review passes
- Accessibility review passes
- README is accurate
- Submission links are accessible
- The user approves the final product

---

# Testing Matrix

| Area | Unit | Component | API | E2E | Manual |
|---|---:|---:|---:|---:|---:|
| Landing page | Limited | Yes | No | Yes | Yes |
| Onboarding | Validation | Yes | No | Yes | Yes |
| Redux slices | Yes | Limited | No | Indirect | Yes |
| Persistence | Yes | Yes | No | Yes | Yes |
| Conversation | Reducers | Yes | Yes | Yes | Yes |
| Opportunity Brief | Schemas | Yes | Yes | Yes | Yes |
| Email action | Reducers | Yes | Yes | Yes | Yes |
| Session reset | Yes | Yes | No | Yes | Yes |
| Security | Helpers | No | Yes | Yes | Yes |
| Responsive UI | No | Limited | No | Yes | Yes |

---

# Definition of Done

A task is complete only when:

- The requested scope is implemented
- No unrelated changes were made
- Types are correct
- Accessibility is considered
- Loading, empty, error, and success states exist where relevant
- Responsive behavior is checked
- Relevant tests are added
- Relevant commands pass
- Documentation remains accurate
- The result is shown for review
- Planned work is not described as completed

---

# Codex Task Handoff Format

At the end of every task, report:

```text
Implemented
- ...

Files changed
- ...

Verification
- ...

Remaining limitations
- ...

Next approved step
- ...
```

Do not automatically implement the next step.

---

# Project Completion Checklist

## Product

- [ ] Landing page communicates clear value
- [ ] Workspace onboarding works
- [ ] AI conversation works
- [ ] Session memory works
- [ ] Opportunity Brief updates
- [ ] Discovery progress updates
- [ ] Gmail brief action works
- [ ] Success depends on confirmed Gmail execution
- [ ] New sessions are isolated
- [ ] Local persistence works

## Design

- [ ] Approved typography is active
- [ ] Approved color system is used
- [ ] Landing page is premium and uncluttered
- [ ] Workspace is professional and usable
- [ ] Mobile layout is intentional
- [ ] States are visually consistent
- [ ] No prohibited generic AI styling exists

## Engineering

- [ ] Strict TypeScript
- [ ] Redux Toolkit
- [ ] RTK Query
- [ ] Zod validation
- [ ] Secure API proxy
- [ ] Server-only secrets
- [ ] Error normalization
- [ ] Persistence validation
- [ ] Build succeeds

## Testing

- [ ] Unit tests pass
- [ ] Component tests pass
- [ ] API tests pass
- [ ] E2E tests pass
- [ ] Responsive tests pass
- [ ] Accessibility review passes
- [ ] Live n8n tests pass
- [ ] Live Gmail test passes

## Deployment

- [ ] Vercel deployment is live
- [ ] Environment variables are configured
- [ ] Webhook secret is rotated
- [ ] Production workflow is published
- [ ] Public URL works
- [ ] Loom link works
- [ ] LinkedIn post link works
