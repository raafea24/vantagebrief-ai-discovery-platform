# VantageBrief Agent Instructions

## Project Identity

VantageBrief is a premium AI client-discovery platform that turns business conversations into structured, decision-ready opportunity briefs.

This must be implemented as a credible B2B product, not as a student chatbot, generic AI landing page, template dashboard, or experimental prototype.

The product will initially run as an independent website and may later be integrated into Aginyx.

## Instruction Priority

Before making changes:

1. Read this file completely.
2. Read all relevant non-empty files inside `docs/`.
3. Inspect the existing code and repository structure.
4. Follow the currently approved phase in `docs/IMPLEMENTATION_PLAN.md`.
5. Do not begin another phase unless explicitly instructed.

When instructions conflict, follow this priority:

1. The user’s latest explicit request
2. `AGENTS.md`
3. Relevant files in `docs/`
4. Existing project conventions
5. Reasonable implementation defaults

Do not invent missing product requirements. Ask for clarification when a decision would materially affect the product, architecture, security, or visual direction.

## Phase Discipline

Work on one approved screen, route, feature, or phase at a time.

Do not:

- Build later phases in advance
- Add unrequested routes or features
- Redesign previously approved sections without instruction
- Install unnecessary packages
- Replace approved content with generic copy
- Add speculative features for completeness
- Modify unrelated files

When a reference image is provided, use it only for the currently requested screen. Do not interpret a combined concept board as one page.

## Product Experience

Every implementation decision should support this core journey:

1. Explain the business value
2. Start a guided discovery session
3. Understand the user’s business challenge
4. Maintain conversation context
5. Structure the opportunity
6. Generate a useful business brief
7. Send the brief only when explicitly requested
8. Confirm sending only after the backend reports success

The experience must feel purposeful and business-oriented. Avoid presenting the product as merely “an AI chatbot that emails summaries.”

## Visual Quality

The interface must feel premium, editorial, calm, and enterprise-ready.

Required qualities:

- Light-first visual system
- Warm neutral surfaces rather than harsh pure white
- Distinctive typography selected in the design system
- Strong hierarchy and generous whitespace
- Refined borders and restrained shadows
- Deliberate alignment and spacing
- High-quality responsive behavior
- Subtle, purposeful motion
- Consistent component styling

Avoid:

- Generic template aesthetics
- Default browser styling
- Default-looking Tailwind examples
- Generic font combinations used without intention
- Excessive gradients
- Neon colors
- Glassmorphism
- Heavy shadows
- Robot or glowing-brain imagery
- Decorative AI icons without function
- Oversized pills everywhere
- Visual clutter
- Fake statistics, testimonials, customers, or claims
- Dark theme unless explicitly requested

Do not use arbitrary colors, font sizes, spacing values, or radii when design tokens exist.

## Screen Architecture

The marketing website and product workspace are separate experiences.

Expected routes:

- `/` — premium product landing page
- `/workspace` — AI discovery workspace
- `/api/chat` — secure server-side API route

The landing page must introduce the product clearly before users enter the workspace.

The workspace may be information-rich, but the landing-page hero must remain focused and spacious.

## Technical Direction

Use:

- Next.js App Router
- TypeScript with strict type safety
- React
- Tailwind CSS
- Server-side route handlers for protected integrations
- Reusable, accessible components
- Semantic HTML
- Responsive layouts
- Environment variables for secrets

Prefer Server Components unless client-side state, browser APIs, or user interaction requires a Client Component.

Keep components focused and reasonably small. Extract reusable logic only when it improves clarity or avoids meaningful duplication.

Do not introduce a state-management library unless the existing requirements justify it.

## Security Rules

Never expose any of the following in browser code, client-side bundles, logs, screenshots, documentation, or committed files:

- n8n webhook secrets
- Private webhook URLs when they are intended to remain server-side
- Gmail credentials
- AI-provider credentials
- Authentication tokens
- Environment-variable values

The browser must call the Next.js API route. The Next.js server must call n8n.

Never call the secured n8n production webhook directly from a Client Component.

Do not commit `.env`, `.env.local`, credentials, test secrets, or personal account details.

Mask personal email addresses in visible confirmation states where appropriate.

## Data and Trust Rules

Do not fabricate:

- Business outcomes
- ROI figures
- Conversion improvements
- Lead scores
- Security guarantees
- Delivery confirmations
- Client details
- Testimonials
- Integrations that are not implemented

Do not display “email sent,” “delivered,” or equivalent success language until the backend explicitly confirms successful Gmail tool execution.

Present recommendations as recommendations, not verified facts.

Do not expose raw backend errors, workflow node names, stack traces, webhook details, or internal instructions to end users.

## Accessibility

Every completed interface must include:

- Semantic document structure
- Keyboard-accessible controls
- Visible focus states
- Proper form labels
- Meaningful button text
- Appropriate ARIA attributes when native semantics are insufficient
- Sufficient text contrast
- Reduced-motion support where animation is used
- Responsive behavior for desktop, tablet, and mobile

Do not rely on color alone to communicate status.

## Code Quality

Use clear names that describe product intent.

Prefer:

- Explicit TypeScript types
- Small focused functions
- Predictable data flow
- Reusable design tokens
- Centralized constants where appropriate
- Graceful loading, empty, success, and error states
- Comments only where the reason is not clear from the code

Avoid:

- `any` unless unavoidable and justified
- Dead code
- Duplicate components
- Large monolithic files
- Hard-coded secrets
- Unexplained magic values
- Placeholder text in completed sections
- Console logging in production paths
- Suppressing TypeScript or lint errors without a documented reason

## Dependency Rules

Before adding a dependency:

1. Confirm that the requirement cannot be handled cleanly with the existing stack.
2. Prefer maintained, lightweight packages.
3. Avoid packages used only for trivial behavior.
4. Do not install UI libraries that force a generic visual identity.
5. Explain any meaningful new dependency in the final handoff.

Do not add analytics, authentication, databases, CMS platforms, payment tools, or unrelated integrations unless explicitly requested.

## Testing and Verification

After implementation, verify the specific work completed.

When available, run:

```bash
npm run lint
npm run build



## Git Repository and Branching Strategy

Repository:

```text
https://github.com/shaafeadawood/vantagebrief
```

### Branch structure

Use:

```text
main
development
feature/<task-name>
fix/<issue-name>
```

### Branch responsibilities

#### `main`

- Contains only reviewed, tested, production-ready code
- Represents the version eligible for production deployment
- Must not contain unfinished work
- Must not be used for normal development
- Must receive changes only after they are verified on `development`

#### `development`

- Primary integration branch for active development
- Receives completed and verified feature branches
- Used to test complete phases before production
- Must not be merged into `main` without explicit user approval

#### `feature/<task-name>`

- Used for one approved screen, feature, or implementation task
- Must be created from an updated `development` branch
- Must contain only changes related to that task
- Must be merged into `development` only after required checks pass

Approved examples:

```text
feature/project-foundation
feature/landing-header
feature/landing-hero
feature/landing-value-section
feature/workspace-onboarding
feature/discovery-workspace
feature/chat-api
feature/n8n-integration
feature/opportunity-brief
feature/email-brief
```

#### `fix/<issue-name>`

- Used for focused bug fixes
- Normally created from `development`
- Critical production fixes may be created from `main`
- A production fix must later be applied to `development` as well

Examples:

```text
fix/mobile-overflow
fix/session-persistence
fix/email-success-state
fix/webhook-error-handling
```

### Required workflow

Before modifying code:

1. Inspect the Git repository status.
2. Report the active branch.
3. Confirm the configured remote points to:

```text
https://github.com/shaafeadawood/vantagebrief
```

4. Update the local `development` branch.
5. Create a focused branch for the approved task.
6. Implement only the requested scope.
7. Run all checks required by the active phase.
8. Create a clear and focused commit.
9. Stop and report the results.
10. Do not merge branches unless explicitly instructed.

### Phase 1 branch

For Project Foundation, use:

```text
feature/project-foundation
```

If `development` does not exist:

1. Preserve the current repository state.
2. Create `development` from `main`.
3. Create `feature/project-foundation` from `development`.
4. Perform Phase 1 work only on `feature/project-foundation`.

### Commit conventions

Use concise imperative commit messages with one of these prefixes:

```text
chore:
feat:
fix:
test:
docs:
refactor:
style:
```

Examples:

```text
chore: initialize project foundation
feat: build premium landing hero
feat: add workspace onboarding
feat: connect secure chat API
fix: prevent duplicate email requests
test: add onboarding validation coverage
docs: update implementation phase
```

Commits must:

- Contain one focused purpose
- Exclude secrets and environment values
- Exclude unrelated generated files
- Exclude unfinished experiments
- Avoid vague messages such as `updates`, `changes`, `final`, or `work done`

### Git restrictions

Never:

- Develop directly on `main`
- Merge into `main` without explicit approval
- Force-push to `main` or `development`
- Rewrite shared branch history
- Merge code with failing checks
- Mix unrelated tasks in one feature branch
- Commit `.env` or `.env.local`
- Commit credentials or private keys
- Delete local or remote branches without permission
- Reset or discard user changes without permission
- Automatically push or merge after completing a task

### Task handoff

At the end of every Git-based task, report:

```text
Active branch
Configured remote
Files changed
Dependencies installed
Checks executed
Check results
Commit created
Unresolved issues
Recommended next step
```

Do not describe a branch as merged or pushed unless that action was actually completed and verified.