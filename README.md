# VantageBrief

**AI Client Discovery and Opportunity Intelligence**

VantageBrief transforms business conversations into structured requirements, practical recommendations, and decision-ready Opportunity Briefs.

It provides a guided AI discovery experience, maintains conversation context, organizes business information, and sends a professional summary by email when the user explicitly requests it.

---

## Product Status

```text
Development status: In progress
Current phase: Project Foundation
Deployment status: Not deployed
n8n workflow: Functional and published
```

This repository is developed through controlled implementation phases defined in:

```text
docs/IMPLEMENTATION_PLAN.md
```

---

## Product Purpose

Traditional website forms often collect too little context.

VantageBrief provides a more useful first interaction by helping users explain:

- Their business or industry
- Their operational challenge
- Their current workflow
- The tools currently involved
- Their desired outcome
- Important requirements and limitations

The resulting conversation is structured into an Opportunity Brief that can be sent to the user by email.

VantageBrief is not intended to replace professional consultation or guarantee business outcomes.

---

## Core Journey

```text
Landing page
→ Start discovery
→ Complete onboarding
→ Discuss the business challenge
→ Maintain conversation memory
→ Structure the Opportunity Brief
→ Request the brief by email
→ Send through Gmail using n8n
→ Confirm successful sending
```

---

## Main Features

### Premium product landing page

Communicates the business value of VantageBrief before users enter the workspace.

### Guided client discovery

The AI asks focused, context-aware questions rather than presenting a rigid questionnaire.

### Conversation memory

Messages from the same session retain their context through n8n conversation memory.

### Opportunity Brief

The product organizes the conversation into:

- Business context
- Primary objective
- Current challenge
- Existing workflow
- Tools and integrations
- Recommended direction
- Expected operational value
- Open questions
- Recommended next step

### Discovery progress

The workspace represents progress across:

```text
Context
Challenge
Workflow
Requirements
Direction
Brief
```

### Gmail automation

When explicitly requested, the AI Agent:

1. Reviews the conversation
2. Creates a structured summary
3. Calls the Gmail tool
4. Waits for successful execution
5. Confirms the email action in the interface

### Local session persistence

Approved workspace state survives browser refreshes.

### Secure server integration

The browser communicates only with the Next.js API.

The n8n webhook and authentication secret remain server-side.

---

## Technology Stack

```text
Next.js App Router
React
TypeScript
Tailwind CSS
Redux Toolkit
RTK Query
Zod
n8n
Google Gemini
Gmail
Vitest
React Testing Library
Playwright
Vercel
```

---

## Application Routes

```text
/             Premium product landing page
/workspace    AI discovery workspace
/api/chat     Secure server-side integration route
```

---

## Architecture

```text
Browser
→ Next.js /api/chat
→ Request validation
→ Secured n8n webhook
→ AI Agent
→ Google Gemini
→ Conversation Memory
→ Gmail Tool when explicitly requested
→ Structured n8n response
→ Next.js response normalization
→ Redux state
→ Interface
```

The browser must never call n8n directly.

---

## Repository Documentation

```text
AGENTS.md
```

Permanent instructions for Codex and repository-wide development rules.

```text
docs/PRODUCT.md
```

Product purpose, target users, journeys, UX requirements, features, and non-goals.

```text
docs/DESIGN_SYSTEM.md
```

Typography, colors, layout, interaction, motion, responsive behavior, and visual-quality rules.

```text
docs/ARCHITECTURE.md
```

Routes, Redux architecture, API design, security, persistence, testing, and deployment structure.

```text
docs/IMPLEMENTATION_PLAN.md
```

Controlled development phases, acceptance criteria, tests, and approval gates.

---

## Development Phases

```text
Phase 1 — Project Foundation
Phase 2 — Premium Landing Page
Phase 3 — Workspace Onboarding
Phase 4 — Discovery Workspace
Phase 5 — API and n8n Integration
Phase 6 — Structured Brief and Email Experience
Phase 7 — Quality Assurance and Deployment
```

Only one approved phase should be implemented at a time.

---

## Local Development

### Requirements

Use a supported Node.js version for the active Next.js release.

Recommended:

```text
Node.js 20.9 or newer
npm
Git
```

Verify:

```bash
node -v
npm -v
git --version
```

---

## Installation

After the Next.js project is initialized:

```bash
npm install
```

---

## Environment Variables

Create:

```text
.env.local
```

Required values:

```env
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
N8N_WEBHOOK_HEADER_NAME=x-briefflow-key
N8N_REQUEST_TIMEOUT_MS=60000
```

Use the production n8n webhook URL.

Do not commit `.env.local`.

Do not expose any server secret through a variable beginning with:

```text
NEXT_PUBLIC_
```

---

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available Commands

```bash
npm run dev
```

Starts the local development server.

```bash
npm run typecheck
```

Runs TypeScript validation without generating output.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run test
```

Runs the Vitest test suite.

```bash
npm run test:watch
```

Runs tests in watch mode.

```bash
npm run test:coverage
```

Generates test coverage when configured.

```bash
npm run test:e2e
```

Runs Playwright end-to-end tests.

```bash
npm run test:e2e:ui
```

Opens the Playwright test interface.

```bash
npm run build
```

Creates the production Next.js build.

```bash
npm run start
```

Runs the completed production build locally.

---

## Design Direction

VantageBrief uses a premium light-first design system.

### Typography

```text
Display: Instrument Serif
Interface: Manrope
```

### Visual language

- Warm ivory canvas
- Paper-like surfaces
- Deep ink typography
- Midnight accents
- Restrained burnished brass
- Fine borders
- Subtle shadows
- Deliberate whitespace
- Purposeful motion

The interface must not use:

- Generic blue-purple gradients
- Neon colors
- Glassmorphism
- Robot imagery
- Fake statistics
- Fake testimonials
- A copied ChatGPT layout
- Generic Tailwind styling
- Dark theme as the default

---

## State Management

Redux Toolkit is used only for the interactive workspace.

Expected workspace state includes:

- User profile
- Discovery session
- Messages
- Opportunity Brief
- Discovery progress
- Email action status
- Hydration status
- Safe public errors

RTK Query communicates only with:

```text
/api/chat
```

It must never call n8n directly.

---

## Security Rules

Never commit or expose:

- n8n webhook secrets
- Gmail credentials
- Gemini credentials
- Authentication tokens
- Real `.env.local` values
- Full private emails in logs
- Raw n8n errors
- Internal AI instructions

The production webhook secret used during early testing must be rotated before final deployment.

---

## Testing Strategy

### Unit tests

Cover:

- Validation schemas
- Redux reducers
- Selectors
- Session generation
- Email masking
- Persistence
- Error normalization
- n8n response normalization

### Component tests

Cover:

- Onboarding
- Chat composer
- Suggested prompts
- Messages
- Loading states
- Error states
- Opportunity Brief
- Email processing
- Email success
- Email failure
- New-session dialog
- Mobile tabs

### API tests

Cover:

- Valid requests
- Invalid requests
- Missing environment variables
- Timeout
- Malformed n8n response
- Gmail success
- Gmail failure

### End-to-end tests

Cover:

- Landing-page navigation
- Onboarding
- Normal conversation
- Session continuity
- Opportunity Brief updates
- Email brief action
- Session reset
- Persistence
- Responsive behavior

---

## Live n8n Testing

Live testing should remain deliberate to conserve trial credits.

Required live checks:

1. Normal AI conversation
2. Conversation memory using the same session ID
3. New-session isolation
4. Gmail conversation-summary request
5. Email received successfully
6. Failed email behavior
7. Production webhook authentication
8. Invalid-request rejection

Routine UI development should use deterministic mocked responses.

---

## Accessibility

VantageBrief must support:

- Keyboard navigation
- Visible focus states
- Semantic headings
- Connected input labels
- Accessible validation errors
- Accessible dialogs
- Accessible tabs
- Screen-reader status updates
- Sufficient color contrast
- Reduced-motion preferences
- Responsive touch targets

Color must not be the only indication of status.

---

## Deployment

The final application will be deployed to:

```text
Vercel
```

Before deployment:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

All commands must pass.

Configure the required environment variables in Vercel before testing the production API integration.

---

## Production Verification

After deployment, verify:

- Landing page
- Workspace
- Onboarding
- Normal conversation
- Session memory
- Opportunity Brief
- Gmail email action
- Email receipt
- Confirmed success state
- Email failure state
- Session reset
- Mobile design
- Browser console
- Browser network security
- Metadata
- Public accessibility

---

## Future Aginyx Integration

VantageBrief is designed to operate independently first and later integrate with Aginyx.

Potential future locations:

```text
aginyxsystems.com/vantagebrief
```

or:

```text
vantagebrief.aginyxsystems.com
```

The initial implementation should keep:

- Product components portable
- Design tokens centralized
- API integration isolated
- Product copy centralized
- Workspace independent from the marketing layout

---

## Version One Non-Goals

The first version does not include:

- User authentication
- Team accounts
- Billing
- Subscription management
- CRM integration
- Admin dashboard
- File uploads
- Voice input
- PDF generation
- Appointment booking
- Multiple AI agents
- Analytics dashboard
- Cross-device history
- Database persistence
- Dark theme

These features must not be added without explicit approval.

---

## Current Completion Checklist

### Documentation

- [x] `AGENTS.md`
- [x] `docs/PRODUCT.md`
- [x] `docs/DESIGN_SYSTEM.md`
- [x] `docs/ARCHITECTURE.md`
- [x] `docs/IMPLEMENTATION_PLAN.md`
- [x] `README.md`

### Product

- [ ] Project foundation
- [ ] Landing page
- [ ] Workspace onboarding
- [ ] Discovery workspace
- [ ] Next.js API
- [ ] n8n integration
- [ ] Structured Opportunity Brief
- [ ] Gmail experience
- [ ] Responsive polish
- [ ] Automated tests
- [ ] Vercel deployment

---

## License

No public license has been selected yet.

Unless a license is explicitly added, all rights remain reserved.