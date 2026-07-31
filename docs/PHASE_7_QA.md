# Phase 7 Quality Assurance

This document records the reproducible checks for the VantageBrief quality-assurance and deployment phase. It does not claim production deployment or live Gmail verification until those external checks have actually been completed.

## Automated quality gate

Run from the repository root:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

The browser suite covers the landing page and onboarding at 1440, 1280, 1024, 768, 390 and 360 CSS pixels. It also covers mobile navigation, horizontal overflow, onboarding, discovery completion, Opportunity Brief navigation, confirmation-dialog focus, explicit email success, malformed email responses, retry, refresh recovery and browser-only API boundaries.

## Security review

- Browser requests are restricted to the same-origin `/api/chat` route.
- n8n URLs, authentication headers and environment access remain in server-only modules.
- Request and response payloads are validated with Zod.
- Email success requires both `success: true` and `emailStatus: "sent"`.
- Raw workflow errors are normalized before reaching the browser.
- The email recipient comes from validated onboarding state rather than conversation content.
- No environment file, credential, build output or original large video source is tracked.
- `npm audit --omit=dev` reports no production dependency vulnerabilities. Patched PostCSS and Sharp releases are pinned through scoped npm overrides while the current stable Next release catches up.

The full development-tree audit still reports the upstream ESLint/minimatch `brace-expansion` advisory. The available forced resolution requires a major ESLint change, and overriding the nested package directly is API-incompatible with the supported ESLint toolchain. This does not enter the production bundle; revisit it when ESLint and `eslint-config-next` publish a compatible upgrade.

Before production deployment, rotate the development webhook secret and configure the replacement only in the Vercel production environment and n8n authentication header.

## Manual review matrix

Verify these states at 1440, 1280, 1024, 768, 390 and 360 CSS pixels:

- Landing header, hero video fallback, navigation, section anchors and footer
- Onboarding validation, keyboard order and long field content
- Conversation messages, pending reply, safe error and retry
- Opportunity Brief pending, active and complete sections
- Email dialog, processing, success, failure and retry
- New-discovery dialog and mobile Conversation/Brief switcher
- No document-level horizontal overflow or clipped focused controls
- Reduced-motion behavior with the operating-system preference enabled

## Performance review

- The landing page remains server-rendered except for interactive navigation and the cinematic video controller.
- Hero media uses responsive WebM/MP4 sources, a fixed 16:9 frame and a WebP poster to prevent layout shift.
- Videos contain no audio and are not preloaded aggressively.
- Fonts use `next/font` with swap behavior.
- No new runtime dependency is required for Phase 7 testing.

Record measured Lighthouse results only after running Lighthouse against the deployed production URL.

## Deployment verification

After Vercel production configuration is authorized:

1. Rotate and configure the production webhook secret.
2. Confirm the production build and framework detection.
3. Verify `/`, `/workspace` and `/api/chat` on the public origin.
4. Complete onboarding and two normal messages in one session to verify memory.
5. Confirm a structured brief update and progress advancement.
6. Request exactly one email brief and verify direct Gmail receipt and HTML content.
7. Confirm the browser reports success only after Gmail success.
8. Start a new discovery and verify session isolation.
9. Check browser console and network logs for internal URLs, secrets and raw errors.
10. Verify title, description and social metadata from the public origin.

## External completion evidence

The following remain external acceptance gates and must be recorded after completion:

- Public Vercel production URL
- Successful production n8n conversation and memory check
- Successful Gmail receipt and HTML-content check
- Rotated webhook secret confirmation
- Loom demonstration URL
- LinkedIn post URL
