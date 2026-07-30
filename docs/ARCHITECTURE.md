# VantageBrief Technical Architecture

## Architecture Objective

VantageBrief must be implemented as a secure, maintainable, production-quality Next.js application.

The architecture must support:

- A premium marketing landing page
- A responsive AI discovery workspace
- Structured conversation state
- Session-based memory
- Opportunity Brief updates
- Gmail brief delivery through n8n
- Secure server-side integrations
- Local browser persistence
- Predictable loading and error states
- Automated testing
- Vercel deployment
- Future integration into the Aginyx website

The browser must never communicate directly with n8n, Gmail, or the AI provider.

The required request flow is:

```text
Browser
→ Next.js API Route
→ Server-side validation
→ Secured n8n webhook
→ AI Agent
→ Conversation Memory
→ Gmail Tool when explicitly requested
→ Structured n8n response
→ Next.js response normalization
→ Redux state
→ User interface
```

---

# Technology Stack

## Application framework

```text
Next.js App Router
React
TypeScript
```

Use the latest stable versions compatible with the active project environment.

Use Server Components by default.

Use Client Components only when required for:

- User interaction
- Redux state
- Browser storage
- Form state
- Dialogs
- Tabs
- Chat behavior
- Animations
- Browser APIs

---

## Styling

```text
Tailwind CSS
CSS custom properties
Global design tokens
```

Tailwind should implement the approved VantageBrief design system.

Do not rely on default Tailwind colors, radii, shadows, or typography when approved tokens exist.

Reusable design values must be centralized in:

```text
app/globals.css
```

or a dedicated token file when necessary.

---

## State management

```text
Redux Toolkit
React Redux
RTK Query
```

Redux Toolkit will manage the interactive discovery workspace.

Do not use Redux for static landing-page content.

Do not introduce another global state library.

---

## Validation

```text
Zod
```

Use Zod for:

- Onboarding form validation
- Chat request validation
- API request validation
- n8n response validation
- Environment-variable validation
- Structured Opportunity Brief validation

Validation must occur on both:

- Client side for immediate user feedback
- Server side for security and reliability

Client-side validation must never be treated as sufficient protection.

---

## Forms

Use controlled React forms or React Hook Form when form complexity justifies it.

Recommended for onboarding:

```text
React Hook Form
Zod resolver
```

Do not install form libraries for trivial single-field interactions.

---

## Icons

Use one lightweight and consistent outline icon library.

Recommended:

```text
Lucide React
```

Do not mix multiple icon libraries.

Do not use icons as decoration without meaning.

---

## Motion

Use CSS transitions by default.

Use Framer Motion only when the approved interaction cannot be implemented cleanly with CSS.

Motion must respect:

```css
prefers-reduced-motion
```

Avoid adding an animation dependency for basic hover states or simple fades.

---

## Testing

Use:

```text
Vitest
React Testing Library
Playwright
```

Testing responsibilities:

- Vitest for unit tests
- React Testing Library for component behavior
- Playwright for end-to-end user journeys

Use Mock Service Worker only if API mocking complexity justifies it.

---

# Application Routes

## `/`

Purpose:

- Present the VantageBrief product
- Communicate business value
- Explain the discovery process
- Present approved use cases
- Lead users into the workspace

Rendering strategy:

```text
Server-rendered marketing page
```

The landing page should contain minimal client-side JavaScript.

---

## `/workspace`

Purpose:

- Run the complete AI discovery experience
- Collect user name and email
- Maintain conversation state
- Show discovery progress
- Display the Opportunity Brief
- Trigger Gmail brief delivery
- Support session reset
- Recover state after refresh

Rendering strategy:

```text
Server-rendered route shell
Client-side workspace application
```

The route should render the structural shell on the server and mount the interactive workspace as a Client Component.

---

## `/api/chat`

Purpose:

- Receive browser chat requests
- Validate the request
- protect the n8n webhook
- Attach the private authentication header
- Apply request timeout handling
- Forward the request to n8n
- Validate the n8n response
- Normalize errors
- Return safe JSON to the browser

Allowed method:

```text
POST
```

The route must not expose:

- n8n webhook URL
- n8n authentication secret
- Gmail credentials
- AI credentials
- Raw provider errors
- Workflow execution details

---

## Future routes

The following routes are not part of Version One:

```text
/login
/signup
/dashboard
/admin
/pricing
/history
/settings
```

Do not create them unless explicitly approved.

---

# Recommended Repository Structure

```text
vantagebrief/
├── AGENTS.md
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── .gitignore
├── .env.example
│
├── docs/
│   ├── PRODUCT.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   └── IMPLEMENTATION_PLAN.md
│
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   │
│   ├── workspace/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── icon.svg
│   └── opengraph-image.tsx
│
├── components/
│   ├── landing/
│   │   ├── LandingHeader.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HeroProductPreview.tsx
│   │   ├── ValueSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── UseCasesSection.tsx
│   │   ├── ProductPreviewSection.tsx
│   │   ├── FinalCallToAction.tsx
│   │   └── LandingFooter.tsx
│   │
│   ├── workspace/
│   │   ├── WorkspaceApp.tsx
│   │   ├── WorkspaceHeader.tsx
│   │   ├── OnboardingPanel.tsx
│   │   ├── StartingIntentCard.tsx
│   │   ├── DiscoveryProgress.tsx
│   │   ├── ConversationPanel.tsx
│   │   ├── MessageList.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── SuggestedPrompts.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── OpportunityBriefPanel.tsx
│   │   ├── OpportunityBriefSection.tsx
│   │   ├── EmailBriefButton.tsx
│   │   ├── EmailProcessingState.tsx
│   │   ├── EmailSuccessState.tsx
│   │   ├── EmailFailureState.tsx
│   │   ├── NewSessionDialog.tsx
│   │   └── MobileWorkspaceTabs.tsx
│   │
│   ├── providers/
│   │   └── ReduxProvider.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Dialog.tsx
│       ├── Tabs.tsx
│       ├── Tooltip.tsx
│       ├── StatusIndicator.tsx
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx
│
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   ├── listenerMiddleware.ts
│   ├── persistence.ts
│   │
│   ├── api/
│   │   └── chatApi.ts
│   │
│   └── features/
│       ├── user/
│       │   ├── userSlice.ts
│       │   ├── userSelectors.ts
│       │   └── userSlice.test.ts
│       │
│       ├── session/
│       │   ├── sessionSlice.ts
│       │   ├── sessionSelectors.ts
│       │   └── sessionSlice.test.ts
│       │
│       ├── conversation/
│       │   ├── conversationSlice.ts
│       │   ├── conversationSelectors.ts
│       │   └── conversationSlice.test.ts
│       │
│       ├── brief/
│       │   ├── briefSlice.ts
│       │   ├── briefSelectors.ts
│       │   └── briefSlice.test.ts
│       │
│       └── email/
│           ├── emailSlice.ts
│           ├── emailSelectors.ts
│           └── emailSlice.test.ts
│
├── lib/
│   ├── env.ts
│   ├── constants.ts
│   ├── session.ts
│   ├── email.ts
│   ├── errors.ts
│   ├── validation.ts
│   ├── accessibility.ts
│   │
│   ├── api/
│   │   ├── n8nClient.ts
│   │   ├── normalizeResponse.ts
│   │   └── apiError.ts
│   │
│   └── schemas/
│       ├── userSchema.ts
│       ├── chatSchema.ts
│       ├── briefSchema.ts
│       └── apiResponseSchema.ts
│
├── types/
│   ├── user.ts
│   ├── session.ts
│   ├── chat.ts
│   ├── brief.ts
│   ├── progress.ts
│   └── api.ts
│
├── hooks/
│   ├── useAutoScroll.ts
│   ├── useMediaQuery.ts
│   ├── useReducedMotion.ts
│   └── useWorkspacePersistence.ts
│
├── public/
│   ├── brand/
│   ├── previews/
│   └── social/
│
├── tests/
│   ├── setup.ts
│   ├── fixtures/
│   │   ├── chatResponses.ts
│   │   └── briefResponses.ts
│   │
│   └── e2e/
│       ├── landing.spec.ts
│       ├── onboarding.spec.ts
│       ├── conversation.spec.ts
│       ├── email-brief.spec.ts
│       ├── session-reset.spec.ts
│       └── responsive.spec.ts
│
└── middleware.ts
```

Do not create every file immediately.

Create files only when required by the active implementation phase.

---

# Redux Store Architecture

## Store responsibilities

Redux Toolkit manages only cross-component workspace state.

Redux should manage:

- User profile
- Current discovery session
- Conversation messages
- Opportunity Brief
- Discovery progress
- Email action status
- Hydration status
- Global workspace errors

Redux should not manage:

- Static landing-page content
- Simple local button hover states
- Temporary input values that belong to one component
- Purely visual animation state
- Server-only secrets
- Raw n8n credentials

---

# Redux Provider

The Redux provider must be mounted only where required.

Recommended placement:

```text
app/workspace/layout.tsx
```

or inside the workspace application shell.

Do not wrap the complete landing page in Redux unless there is a demonstrated requirement.

The provider component must be a Client Component.

---

# Store Configuration

The store should use:

```typescript
configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    conversation: conversationReducer,
    brief: briefReducer,
    email: emailReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(chatApi.middleware),
});
```

Export:

```typescript
RootState
AppDispatch
AppStore
```

Create typed hooks:

```typescript
useAppDispatch
useAppSelector
```

Do not use untyped `useDispatch` or `useSelector` inside product components.

---

# User Slice

## Purpose

Store the validated onboarding identity.

## State shape

```typescript
interface UserState {
  fullName: string;
  companyName: string;
  email: string;
  role: WorkspaceRole;
  challenge: string;
  onboardingCompleted: boolean;
}
```

## Workspace role values

```typescript
type WorkspaceRole =
  | "business_owner"
  | "operations"
  | "strategy_consulting"
  | "sales_business_development"
  | "product_technology"
  | "other";
```

## Actions

```text
setUserProfile
completeOnboarding
resetUser
hydrateUser
```

The email must be normalized before storage.

Store lowercase email values unless casing preservation becomes necessary.

---

# Session Slice

## Purpose

Manage one isolated discovery session.

## State shape

```typescript
interface SessionState {
  sessionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  status: "idle" | "active" | "resetting";
  hydrationStatus: "idle" | "hydrating" | "ready";
}
```

## Actions

```text
createSession
activateSession
touchSession
resetSession
hydrateSession
setHydrationStatus
```

Session IDs must be generated in the browser using:

```typescript
crypto.randomUUID()
```

If unavailable, use a secure fallback.

Do not use timestamps alone as session IDs.

A new session must:

- Generate a new session ID
- Clear messages
- Clear Opportunity Brief
- Reset progress
- Reset email state
- Preserve the validated user profile by default

---

# Conversation Slice

## Purpose

Manage messages and conversation-level state.

## Message type

```typescript
type MessageRole = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status:
    | "pending"
    | "sent"
    | "received"
    | "failed";
}
```

The `system` role should not normally be rendered to users.

## State shape

```typescript
interface ConversationState {
  messages: ChatMessage[];
  activeRequestId: string | null;
  status:
    | "idle"
    | "sending"
    | "receiving"
    | "failed";
  error: PublicError | null;
  lastSuccessfulMessageAt: string | null;
}
```

## Actions

```text
addOptimisticUserMessage
confirmUserMessage
addAssistantMessage
markMessageFailed
retryMessage
setConversationStatus
setConversationError
clearConversation
hydrateConversation
```

Do not allow simultaneous duplicate chat requests.

The composer must be disabled while a message request is actively processing.

---

# Opportunity Brief Slice

## Purpose

Store structured business information returned by the backend.

## Brief shape

```typescript
interface OpportunityBrief {
  businessContext: BriefField;
  primaryObjective: BriefField;
  currentChallenge: BriefField;
  existingWorkflow: BriefField;
  toolsAndIntegrations: BriefListField;
  recommendedDirection: BriefField;
  expectedOperationalValue: BriefListField;
  openQuestions: BriefListField;
  recommendedNextStep: BriefField;
  updatedAt: string | null;
}
```

## Brief field

```typescript
interface BriefField {
  status: "not_identified" | "in_progress" | "identified";
  value: string | null;
}
```

## Brief list field

```typescript
interface BriefListField {
  status: "not_identified" | "in_progress" | "identified";
  values: string[];
}
```

## Discovery progress

```typescript
interface DiscoveryProgress {
  context: DiscoveryStageStatus;
  challenge: DiscoveryStageStatus;
  workflow: DiscoveryStageStatus;
  requirements: DiscoveryStageStatus;
  direction: DiscoveryStageStatus;
  brief: DiscoveryStageStatus;
}
```

```typescript
type DiscoveryStageStatus =
  | "not_started"
  | "in_progress"
  | "identified";
```

## State shape

```typescript
interface BriefState {
  brief: OpportunityBrief;
  progress: DiscoveryProgress;
  status: "empty" | "updating" | "ready";
  error: PublicError | null;
}
```

## Actions

```text
updateBrief
updateProgress
setBriefStatus
clearBrief
hydrateBrief
```

The frontend must use structured backend fields.

Do not parse arbitrary assistant prose to infer critical brief content.

---

# Email Slice

## Purpose

Track the explicit Gmail brief-delivery action.

## State shape

```typescript
interface EmailState {
  status:
    | "idle"
    | "reviewing"
    | "structuring"
    | "preparing"
    | "sending"
    | "success"
    | "failed";
  maskedRecipient: string | null;
  sentAt: string | null;
  error: PublicError | null;
}
```

## Actions

```text
startEmailProcess
setEmailStage
setEmailSuccess
setEmailFailure
resetEmailState
```

Do not show the success state until the API response explicitly confirms email completion.

Do not infer email success from:

- A successful AI response
- A completed chat request
- A generated summary
- A tool-call intention
- A timeout without an error

---

# RTK Query Architecture

## API slice

Create:

```text
store/api/chatApi.ts
```

Use:

```typescript
createApi
fetchBaseQuery
```

Base URL:

```text
/api
```

Endpoint:

```text
POST /api/chat
```

## Mutation

```typescript
sendChatMessage
```

Request type:

```typescript
interface ChatRequest {
  message: string;
  sessionId: string;
  name: string;
  email: string;
  intent?: StartingIntent;
  action?: "chat" | "email_brief";
}
```

Response type:

```typescript
interface ChatResponse {
  success: boolean;
  type:
    | "chat_response"
    | "email_confirmation"
    | "validation_error"
    | "service_error";
  reply: string;
  sessionId: string;
  brief?: OpportunityBrief;
  progress?: DiscoveryProgress;
  action?: EmailActionResult | null;
}
```

Email action result:

```typescript
interface EmailActionResult {
  name: "send_conversation_summary";
  status: "completed" | "failed";
  recipient?: string;
  completedAt?: string;
}
```

RTK Query must not call n8n directly.

Its only destination is:

```text
/api/chat
```

---

# Request Lifecycle

## Normal conversation

1. Validate composer content.
2. Add an optimistic user message.
3. Set conversation state to `sending`.
4. Call `sendChatMessage`.
5. Receive normalized API response.
6. Add assistant response.
7. Update Opportunity Brief when structured data exists.
8. Update discovery progress when structured data exists.
9. Mark the user message as sent.
10. Set conversation status to `idle`.
11. Persist approved state.

## Failed conversation

1. Preserve the user message.
2. Mark it as failed.
3. Store a public-safe error.
4. Present a retry action.
5. Do not add a false assistant response.
6. Do not clear the Opportunity Brief.

---

# Email Brief Lifecycle

## Trigger

The email workflow may start through:

- The explicit `Email brief` button
- A user-written request detected by the AI Agent

The interface button should send:

```typescript
{
  action: "email_brief",
  message: "Send me a structured summary of our conversation by email."
}
```

## UI stages

The frontend may progressively display:

```text
reviewing
structuring
preparing
sending
```

These are processing indicators only.

## Success condition

Set email status to `success` only when the API response contains:

```typescript
action.status === "completed"
```

## Failure condition

Set email status to `failed` when:

```typescript
action.status === "failed"
```

or when the API request fails.

---

# Local Persistence

## Purpose

Preserve the discovery experience after a browser refresh.

Persist only:

- User name
- Business or company name
- User email
- Role
- Initial business challenge or opportunity
- Onboarding completion
- Session ID
- Session timestamps
- Conversation messages
- Opportunity Brief
- Discovery progress

Do not persist:

- Secrets
- Webhook URLs
- Raw API errors
- Internal tool responses
- Gmail metadata
- Temporary loading states
- Active request IDs
- Stack traces

---

## Storage mechanism

Use:

```text
localStorage
```

Recommended storage key:

```text
vantagebrief.workspace.v1
```

Use a versioned persisted state shape.

Example:

```typescript
interface PersistedWorkspaceState {
  version: 1;
  user: PersistedUserState;
  session: PersistedSessionState;
  conversation: PersistedConversationState;
  brief: PersistedBriefState;
}
```

---

## Persistence implementation

Use Redux listener middleware or a controlled subscription.

Do not write to localStorage on every render.

Recommended behavior:

- Persist only after relevant state changes
- Debounce frequent updates
- Validate stored data before hydration
- Ignore corrupt or outdated persisted state
- Gracefully reset invalid state

Do not introduce `redux-persist` unless explicitly justified.

A custom small persistence layer is preferred for Version One.

---

## Hydration

Hydration must occur only in the browser.

While hydrating:

- Do not flash onboarding if a valid session exists
- Do not send requests
- Do not overwrite persisted data with empty initial state

After hydration:

```text
hydrationStatus = ready
```

---

# Next.js API Architecture

## Route file

```text
app/api/chat/route.ts
```

## Responsibilities

The route must:

1. Accept POST requests
2. Apply a request-body size limit
3. Parse JSON safely
4. Validate the payload using Zod
5. Validate environment variables
6. Build the n8n request
7. Attach the authentication header
8. Apply a timeout
9. Validate the n8n response
10. Normalize errors
11. Return safe JSON
12. Prevent caching

---

## Request schema

```typescript
const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  sessionId: z
    .string()
    .trim()
    .min(8)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  intent: startingIntentSchema.optional(),
  action: z.enum(["chat", "email_brief"]).optional(),
});
```

The server must normalize:

- Name spacing
- Email casing
- Message whitespace

---

## n8n request shape

```typescript
interface N8nChatRequest {
  message: string;
  sessionId: string;
  name: string;
  email: string;
  intent?: StartingIntent;
  action?: "chat" | "email_brief";
  metadata: {
    source: "vantagebrief-web";
    requestId: string;
    timestamp: string;
  };
}
```

Do not forward unnecessary browser information.

Do not forward:

- Full user agent
- IP address
- Browser fingerprint
- Cookies
- Referrer details

unless a future requirement explicitly justifies it.

---

# n8n Client

Create:

```text
lib/api/n8nClient.ts
```

Responsibilities:

- Read validated environment variables
- Send the request
- Add the private header
- Apply timeout handling
- Parse the response
- Throw typed internal errors
- Never expose secrets in errors

Use:

```typescript
AbortController
```

Recommended timeout:

```text
45–60 seconds
```

The Gmail tool may require longer than a normal chat response.

Do not allow an unlimited request duration.

---

# n8n Response Contract

## Current minimum response

```json
{
  "success": true,
  "type": "chat_response",
  "reply": "AI response",
  "sessionId": "session-id"
}
```

## Target professional response

```json
{
  "success": true,
  "type": "chat_response",
  "reply": "AI response",
  "sessionId": "session-id",
  "brief": {
    "businessContext": {
      "status": "identified",
      "value": "Recruitment agency managing candidate communication."
    },
    "primaryObjective": {
      "status": "identified",
      "value": "Reduce manual candidate follow-up."
    },
    "currentChallenge": {
      "status": "identified",
      "value": "Recruiters repeatedly request missing documents."
    },
    "existingWorkflow": {
      "status": "in_progress",
      "value": "Candidate records are tracked manually."
    },
    "toolsAndIntegrations": {
      "status": "identified",
      "values": [
        "Google Sheets",
        "Gmail",
        "WhatsApp"
      ]
    },
    "recommendedDirection": {
      "status": "identified",
      "value": "Automated document collection and reminder workflow."
    },
    "expectedOperationalValue": {
      "status": "identified",
      "values": [
        "Less repetitive follow-up",
        "More consistent candidate communication"
      ]
    },
    "openQuestions": {
      "status": "identified",
      "values": [
        "Which document types are mandatory?",
        "How often should reminders be sent?"
      ]
    },
    "recommendedNextStep": {
      "status": "identified",
      "value": "Map required documents and reminder rules."
    },
    "updatedAt": "2026-07-30T16:00:00.000Z"
  },
  "progress": {
    "context": "identified",
    "challenge": "identified",
    "workflow": "in_progress",
    "requirements": "in_progress",
    "direction": "identified",
    "brief": "in_progress"
  },
  "action": null
}
```

## Email success response

```json
{
  "success": true,
  "type": "email_confirmation",
  "reply": "Your conversation brief was sent successfully.",
  "sessionId": "session-id",
  "action": {
    "name": "send_conversation_summary",
    "status": "completed",
    "recipient": "dsh••••@gmail.com",
    "completedAt": "2026-07-30T16:00:00.000Z"
  }
}
```

## Email failure response

```json
{
  "success": false,
  "type": "service_error",
  "reply": "Your brief was prepared, but the email could not be sent.",
  "sessionId": "session-id",
  "action": {
    "name": "send_conversation_summary",
    "status": "failed"
  }
}
```

---

# Response Validation

All n8n responses must be validated with Zod before being returned to the browser.

If n8n returns malformed data:

- Log a safe internal diagnostic
- Return a normalized service error
- Do not pass malformed JSON to Redux
- Do not expose the raw n8n output

---

# API Error Model

## Public error type

```typescript
interface PublicError {
  code:
    | "VALIDATION_ERROR"
    | "NETWORK_ERROR"
    | "SERVICE_UNAVAILABLE"
    | "REQUEST_TIMEOUT"
    | "EMAIL_SEND_FAILED"
    | "UNKNOWN_ERROR";
  message: string;
  retryable: boolean;
}
```

## Internal errors

Internal errors may contain technical information for server logging.

They must never be serialized directly to the client.

---

# Public Error Messages

## Validation error

```text
Review the highlighted information and try again.
```

## Network error

```text
We could not reach the discovery service. Your message has not been lost. Please try again.
```

## Timeout

```text
The discovery service took longer than expected. Please try again.
```

## Service unavailable

```text
The discovery service is temporarily unavailable. Please try again shortly.
```

## Email failure

```text
Your brief was prepared, but the email could not be sent. Please try again.
```

## Unknown error

```text
Something prevented the request from completing. Please try again.
```

---

# Environment Variables

## Required server variables

```text
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
```

Optional:

```text
N8N_WEBHOOK_HEADER_NAME
N8N_REQUEST_TIMEOUT_MS
```

Recommended defaults:

```text
N8N_WEBHOOK_HEADER_NAME=x-briefflow-key
N8N_REQUEST_TIMEOUT_MS=60000
```

The current n8n header name may later be renamed to match VantageBrief.

Do not rename it until both n8n and the application are updated together.

---

## `.env.example`

The committed `.env.example` file may contain:

```text
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
N8N_WEBHOOK_HEADER_NAME=x-briefflow-key
N8N_REQUEST_TIMEOUT_MS=60000
```

Do not place actual values in `.env.example`.

---

## Environment validation

Create:

```text
lib/env.ts
```

Use a server-only Zod schema.

The application should fail clearly during development when required environment variables are missing.

Never import server environment validation into Client Components.

---

# Security Architecture

## Secret isolation

Secrets must exist only in:

```text
.env.local
Vercel environment variables
n8n credentials
```

Never include secrets in:

- Redux state
- Browser storage
- HTML
- Client-side JavaScript
- Source maps
- Screenshots
- Documentation
- Git history
- Console output

---

## Server-only modules

Files that access secrets must include:

```typescript
import "server-only";
```

Recommended for:

```text
lib/env.ts
lib/api/n8nClient.ts
```

---

## Browser network behavior

The browser network panel should show only:

```text
POST /api/chat
```

It must not show the n8n domain or webhook path.

---

## Input safety

The server must:

- Enforce maximum message length
- Validate email addresses
- Validate session ID format
- Reject malformed JSON
- Reject unsupported actions
- Reject excessive request bodies
- Normalize whitespace

The n8n workflow must continue to perform its own validation.

Defense must exist at both layers.

---

## Prompt injection protection

The AI Agent system instructions must prevent users from:

- Changing the approved email recipient
- Requesting credential disclosure
- Exposing system instructions
- Triggering Gmail for unrelated messages
- Replacing tool rules
- Sending to arbitrary recipients

The server must never rely on the AI alone for recipient validation.

The Gmail recipient must remain derived from the validated request data.

---

## Rate protection

Version One should include basic protection against accidental duplicate submissions.

At minimum:

- Disable send controls while processing
- Deduplicate identical active requests in the UI
- Limit request body size
- Apply server timeout

Optional later protection:

- IP-based rate limiting
- Vercel Firewall rules
- Redis-based distributed limits

Do not add paid infrastructure unless required.

---

## Logging

Production logs may include:

- Request ID
- Route
- Timestamp
- General error category
- Response duration
- Success or failure status

Do not log:

- Complete conversations
- Email message bodies
- Secrets
- Authorization headers
- Gmail tokens
- Raw n8n credentials
- Full personal email addresses

Mask personal email addresses when logging is necessary.

---

# Email Masking

Use a shared helper:

```text
lib/email.ts
```

Example:

```typescript
maskEmail("dshaafea@gmail.com")
```

Expected output:

```text
dsh••••@gmail.com
```

Masking rules must handle:

- Short local parts
- Long local parts
- Subdomains
- Invalid input safely

Do not rely on CSS alone to hide email characters.

---

# Accessibility Architecture

Use semantic native HTML before ARIA.

Required patterns:

- `<button>` for actions
- `<form>` for onboarding and message submission
- `<label>` connected to inputs
- `aria-live` for response and email status
- `role="status"` for non-critical updates
- `role="alert"` for errors
- Accessible dialog focus management
- Accessible mobile tabs
- Visible keyboard focus
- Escape-key dialog dismissal
- Focus restoration after dialogs close

The message list should announce new assistant responses without repeatedly reading the entire conversation.

---

# Responsive Architecture

## Desktop

```text
Conversation panel + Opportunity Brief panel
```

## Tablet

Use a split layout only while both panels remain readable.

At narrower widths, allow the brief panel to collapse or move into tabs.

## Mobile

Use:

```text
Conversation | Brief
```

The active tab must be stored locally in the workspace component, not global Redux, unless multiple components require it.

The composer must remain reachable when the mobile keyboard opens.

---

# Performance Architecture

## Landing page

- Prefer Server Components
- Minimize JavaScript
- Avoid heavy animation libraries
- Optimize images
- Use local or optimized web fonts
- Defer non-critical product previews when necessary

## Workspace

- Memoize expensive selectors
- Avoid rerendering the entire message list
- Use stable message keys
- Limit unnecessary Redux subscriptions
- Use RTK Query caching appropriately
- Keep persisted state compact
- Do not store duplicate derived state

## Fonts

Load approved fonts using:

```text
next/font
```

Prefer locally bundled or officially supported font loading.

Prevent layout shifts through correct font configuration.

---

# Message Rendering Safety

AI responses must be rendered as plain text or sanitized structured content.

Do not render arbitrary model-generated HTML.

If Markdown rendering is introduced:

- Use a trusted Markdown renderer
- Disable raw HTML
- Sanitize output
- Style all supported elements
- Test long links and code blocks

The Gmail email body may contain HTML inside n8n, but that HTML must not be returned and rendered directly in the browser.

---

# Component Architecture Rules

## Container components

Container components may:

- Read Redux state
- Dispatch actions
- Call RTK Query
- Coordinate complex product behavior

## Presentational components

Presentational components should:

- Receive typed props
- Avoid direct store access where unnecessary
- Remain reusable
- Remain easy to test

## Component size

Split components when they:

- Handle multiple unrelated responsibilities
- Become difficult to understand
- Contain reusable interface patterns
- Contain complex state and rendering together

Do not split every small element into an unnecessary file.

---

# Server and Client Boundaries

## Server Components

Use for:

- Landing page sections
- Static copy
- Metadata
- Layout shells
- SEO content
- Server-only environment access

## Client Components

Use for:

- Redux provider
- Workspace application
- Onboarding form
- Chat composer
- Message interactions
- Dialogs
- Mobile tabs
- Local persistence
- RTK Query requests

Do not mark large route trees with `"use client"` when only one nested component requires it.

---

# Metadata and SEO

The landing page should define:

```text
Title:
VantageBrief | AI Client Discovery Platform
```

```text
Description:
Turn business conversations into structured requirements, practical recommendations, and decision-ready opportunity briefs.
```

Use:

- Canonical metadata
- Open Graph metadata
- Twitter metadata
- Correct page title
- Meaningful description
- Product favicon
- Semantic heading structure

Do not make unsupported SEO claims.

---

# Testing Architecture

## Unit testing

Use Vitest for:

- Email masking
- Session generation
- Zod schemas
- Error normalization
- Redux reducers
- Redux selectors
- Persistence serialization
- Persistence hydration
- n8n response normalization

---

## Component testing

Use React Testing Library for:

- Onboarding validation
- Starting-intent selection
- Composer behavior
- Suggested prompts
- Message rendering
- Loading states
- Error states
- Email processing
- Email success
- Email failure
- New-session dialog
- Mobile tabs
- Opportunity Brief sections

Test behavior rather than implementation details.

Prefer queries by:

- Role
- Label
- Accessible name
- Visible text

Avoid relying heavily on test IDs.

---

## API route testing

Test:

- Valid chat request
- Invalid email
- Missing session ID
- Empty message
- Message over maximum length
- n8n timeout
- n8n malformed response
- n8n validation response
- Gmail success response
- Gmail failure response
- Secret absence
- Unsupported HTTP method

Mock n8n at the server boundary.

Do not call the real production webhook during ordinary unit tests.

---

## End-to-end testing

Use Playwright for:

### Landing page

- Header navigation
- Hero CTA
- Responsive navigation
- Workspace route transition

### Onboarding

- Empty validation
- Invalid email
- Intent selection
- Successful onboarding

### Conversation

- Send normal message
- Display optimistic user message
- Show loading state
- Display assistant response
- Update Opportunity Brief
- Preserve session after refresh

### Email brief

- Trigger email action
- Display processing state
- Display confirmed success
- Display masked email
- Preserve conversation after success
- Display recoverable failure

### Session reset

- Open confirmation dialog
- Cancel reset
- Confirm reset
- Generate new session ID
- Clear old conversation
- Clear old Opportunity Brief
- Preserve name and email

### Mobile

- Conversation tab
- Brief tab
- Composer visibility
- Dialog behavior
- No horizontal overflow

---

# Visual Testing

Capture stable screenshots for:

```text
Landing hero desktop
Landing hero mobile
Onboarding desktop
Onboarding mobile
Empty workspace
Active conversation
Populated Opportunity Brief
Email processing
Email success
Email failure
Mobile conversation tab
Mobile brief tab
```

Screenshots should use deterministic mocked data.

Do not use live AI responses in visual tests.

---

# Manual Testing

Before completing a phase, verify:

- Chrome desktop
- Responsive browser widths
- Keyboard-only navigation
- Reduced-motion preference
- Long user name
- Long email address
- Long user message
- Long assistant response
- Multiple conversation messages
- API timeout
- Email failure
- Browser refresh
- New session
- Invalid persisted state

---

# Integration Testing with n8n

Real n8n integration tests should be limited and deliberate to conserve credits.

Required live tests:

1. Normal conversation
2. Memory with same session ID
3. New conversation isolation
4. Gmail summary request
5. Confirmed Gmail delivery
6. Gmail failure behavior
7. Invalid request rejection
8. Production webhook authentication

Do not repeatedly trigger Gmail during frontend development.

Use mocked API responses for routine interface work.

---

# Test Data

Create reusable fixtures containing:

- Recruitment workflow example
- E-commerce operations example
- Customer-support automation example
- Custom software planning example
- Email success response
- Email failure response
- Partial Opportunity Brief
- Complete Opportunity Brief

Do not include real client data.

---

# Build Verification

Before completing a phase, run when available:

```bash
npm run lint
npm run test
npm run build
```

Before deployment, also run:

```bash
npm run test:e2e
```

Do not claim these commands passed unless they were executed successfully.

---

# Package Scripts

Recommended scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "typecheck": "tsc --noEmit"
}
```

Final verification should include:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

---

# Deployment Architecture

## Hosting

```text
Vercel
```

## Required Vercel environment variables

```text
N8N_WEBHOOK_URL
N8N_WEBHOOK_SECRET
N8N_WEBHOOK_HEADER_NAME
N8N_REQUEST_TIMEOUT_MS
```

Set secrets for:

- Production
- Preview only when appropriate
- Development through `.env.local`

Do not expose secrets through variables beginning with:

```text
NEXT_PUBLIC_
```

---

## Deployment checks

After deployment verify:

- Landing page loads
- Workspace loads
- Fonts load correctly
- Responsive layout works
- API route can reach n8n
- Production webhook accepts authentication
- Conversation memory works
- Email brief works
- No secret appears in browser network requests
- No console errors
- Metadata renders correctly
- Vercel logs contain no sensitive content

---

# Future Aginyx Integration

VantageBrief should remain portable.

Future integration options:

```text
aginyxsystems.com/vantagebrief
```

or:

```text
vantagebrief.aginyxsystems.com
```

To support future integration:

- Keep product copy centralized
- Keep brand tokens centralized
- Avoid hard-coding route assumptions
- Keep n8n integration isolated behind `/api/chat`
- Keep product components independent from landing-page layout
- Avoid coupling VantageBrief to personal data
- Preserve reusable workspace modules

---

# Architectural Non-Goals

Version One must not include:

- Database
- User authentication
- Team accounts
- Billing
- Subscription management
- Admin dashboard
- CRM
- PDF generation
- Voice input
- File uploads
- Multiple AI agents
- Analytics platform
- Cross-device history
- Background jobs
- WebSockets
- Streaming AI responses
- Dark theme

These may be considered only after the complete primary journey is stable.

---

# Architecture Decision Rules

Before introducing a new architectural pattern, Codex must evaluate:

1. Is it required by the approved product scope?
2. Can the existing stack handle it cleanly?
3. Does it improve maintainability?
4. Does it increase security risk?
5. Does it add unnecessary dependency weight?
6. Does it affect future Aginyx integration?
7. Does it require documentation updates?
8. Does it require additional tests?

Do not introduce complexity for theoretical scalability.

---

# Completion Standard

The architecture is implemented successfully when:

1. The landing page uses minimal client JavaScript.
2. The workspace uses typed Redux state.
3. RTK Query communicates only with `/api/chat`.
4. `/api/chat` securely communicates with n8n.
5. Secrets remain server-only.
6. Requests and responses are validated.
7. Session state persists after refresh.
8. New sessions are isolated.
9. Structured Opportunity Brief data is supported.
10. Email success depends on confirmed backend execution.
11. Public errors hide internal details.
12. Accessibility requirements are implemented.
13. Unit, component, API, and end-to-end tests exist.
14. Type checking, linting, tests, and production build pass.
15. The deployed Vercel application works with the published n8n workflow.
