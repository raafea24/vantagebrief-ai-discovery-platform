# VantageBrief

VantageBrief is an AI-assisted client-discovery platform that turns business conversations into structured, decision-ready Opportunity Briefs.

The application guides users through discovery, maintains session context, organizes important business information, and supports approval-driven brief delivery only when explicitly requested.

## Core capabilities

- Guided business discovery with contextual follow-up questions
- Structured Opportunity Brief generation and progressive updates
- Session persistence across browser refreshes
- Approval-driven n8n/Gmail email requests with strict delivery-confirmation gating
- Responsive landing page and discovery workspace
- Secure server-side integration with validated requests and responses
- Accessible keyboard, focus, dialog, status, and mobile interactions

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Redux Toolkit and RTK Query
- Zod
- Vitest and React Testing Library
- Playwright
- n8n orchestration with Google Gemini and Gmail as external workflow services
- Vercel

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page |
| `/workspace` | Guided discovery workspace |
| `/api/chat` | Server-side n8n integration endpoint |

## Architecture

The browser communicates only with the Next.js API route. The API validates requests, calls the authenticated n8n webhook, validates the response, and returns a safe normalized result to the client.

```text
Browser
  -> Next.js /api/chat
  -> Request validation
  -> Authenticated n8n webhook
  -> AI and conversation workflow
  -> Gmail when explicitly requested
  -> Response validation and normalization
  -> Redux state and interface
```

Webhook URLs, authentication secrets, Gmail credentials, and AI-provider credentials must remain server-side.

## Requirements

- Node.js 20.9 or newer
- npm
- Git

Clone this repository:

```bash
git clone https://github.com/raafea24/vantagebrief-ai-discovery-platform.git
cd vantagebrief-ai-discovery-platform
```

## Local setup

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and configure:

```env
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
N8N_WEBHOOK_HEADER_NAME=x-briefflow-key
N8N_REQUEST_TIMEOUT_MS=60000
```

Use the published n8n webhook URL and its matching header-authentication secret. Never commit `.env.local` or expose these values through variables prefixed with `NEXT_PUBLIC_`.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Validate TypeScript |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit, component, and API tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Open the Playwright test interface |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |

## Verification

Before deployment, run:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Automated coverage includes validation, Redux state, persistence, API boundaries, n8n response handling, email success and failure states, navigation, responsive layouts, and the complete discovery journey.

Live integration verification should confirm:

- Normal discovery responses
- Conversation continuity within a session
- Isolation between new sessions
- Opportunity Brief updates
- Successful Gmail receipt after an explicit request
- Failure handling without false delivery confirmation
- Duplicate-email prevention
- Server-side webhook authentication

## Deployment

The application is configured for Vercel using the standard Next.js build settings:

- Framework: Next.js
- Root directory: `./`
- Install command: Vercel default
- Build command: `npm run build`
- Output directory: Vercel default

Configure the four n8n environment variables in Vercel before testing `/api/chat`. Environment-variable changes require a new deployment.

After deployment, verify the landing page, workspace, onboarding, discovery flow, session persistence, Opportunity Brief, email delivery, responsive behavior, browser console, and browser network security.

## Integration status

The repository implements the Next.js application, validated server-side n8n adapter, structured response contracts, local session recovery, and approval-gated email workflow. The n8n workflow itself, Gemini model configuration, Gmail credentials, and Vercel environment are external resources and are intentionally not included. Production deployment and live n8n, Gemini, and Gmail execution remain unverified external acceptance steps documented in `docs/PHASE_7_QA.md`.

## Security

- The browser must never call n8n directly.
- Secrets and private webhook URLs must never enter client bundles or logs.
- Raw workflow errors and internal instructions must not be returned to users.
- Email success must be displayed only when the backend returns `success: true` and `emailStatus: "sent"`.
- Development webhook credentials must be rotated before production use.

## Documentation

- `AGENTS.md` - repository contribution and security rules
- `docs/PRODUCT.md` - product requirements and user journeys
- `docs/ARCHITECTURE.md` - application, state, API, and deployment architecture
- `docs/IMPLEMENTATION_PLAN.md` - implementation phases and acceptance criteria
- `docs/PHASE_7_QA.md` - quality-assurance and deployment-verification checklist

## License

No public license has been selected. All rights reserved.
