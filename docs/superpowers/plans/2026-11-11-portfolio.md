# Personal workshop implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The supplied brief authorizes autonomous choices and complete execution.

**Goal:** Deliver a truthful, polished portfolio and an optional, accessible 3D project workshop.

**Architecture:** Next.js App Router with static Server Component pages, small DOM interaction boundaries, and an Explore-only dynamically imported R3F scene. A typed content module supplies all project pages and workshop stations. Local implementation in the user's empty repository, with Vercel deployment instructions.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, GSAP, R3F 9, Drei 10, Three.js, Lucide.

**Spec:** ../specs/2026-11-11-portfolio-brief.md

## Global constraints
- Warm off-white #EEEDE8, near-black #151515, cobalt #4355F9, secondary #62625D. Locally hosted Manrope.
- No invented professional claims, metrics, photos, project repositories, or demonstrably broken public links.
- Three.js stays outside homepage JavaScript. Native scrolling and reduced-motion support.
- All project information has ordinary HTML navigation. WebGL is optional for visitors.
- Keep tests focused on critical behavior. No database, auth, or backend.

## Review focus
- Focus lost while driving: movement stops; normal page navigation resumes.
- WebGL context loss: static preview and project links remain usable.
- Very narrow layouts and enlarged text: no clipping or inaccessible controls.
- Clipboard failure: no false success; email remains selectable.
- Deep links and invalid slugs: useful static pages and a deliberate 404.

## Design decisions
An oversized two-line name anchors an editorial opening. A cobalt signal and an off-white architectural workshop connect the homepage to Explore. Three large, alternating project illustrations lead into a dark AI-evaluation section, concise education, and a full-width contact ending. The world contains a document sculpture, coding terminal, and event pavilion around a small cobalt rover. The fixed isometric default has optional orbit controls, demand rendering, and no decorative continuous loop.

### Task 1: Content and main portfolio
**Files:** package.json, app/layout.tsx, app/page.tsx, app/globals.css, app/projects/[slug]/page.tsx, app/not-found.tsx, app/sitemap.ts, app/robots.ts, components/{header,motion,contact,project-art}.tsx, lib/content.ts, tests/smoke.spec.ts.
**Interfaces:** export typed `profile`, `experience`, and `projects`; each project has slug, number, name, summary, tags, sections, links, and station coordinates.
- [x] Establish package scripts, compatible stable dependencies, metadata and local fonts.
- [x] Write critical browser smoke cases for direct routes, mobile navigation, copy email, and HTML project discovery.
- [x] Build the responsive homepage, shared content, project pages, and contact/menu interaction.
- [x] Verify types and browser journeys; inspect 390/768/1440 compositions.

### Task 2: Functional workshop
**Files:** components/workshop/{workshop,scene,objects}.tsx, lib/movement.ts, tests/movement.test.ts, app/explore/page.tsx.
**Interfaces:** `stepRover(position, direction, delta, obstacles)` returns bounded x/z; scene consumes `projects` and selection callback; shell owns HTML panel and focus restoration.
- [x] Write and run movement tests for wall bounds, obstacle collisions, diagonal speed, and frame independence; observe failure before implementation.
- [x] Build procedural architectural objects, project stations and rover.
- [x] Add focus-scoped keys, direct station selection, reset, camera controls, demand rendering, visibility pausing and context-loss fallback.
- [x] Verify keyboard and HTML selection, mobile interaction, reset, and fallback.

### Task 3: Polish, verification and handoff
**Files:** public/images/workshop-preview.*, README.md, docs/verification.md, tests/smoke.spec.ts.
- [x] Capture the actual workshop as the hero/fallback preview and produce project artwork.
- [x] Run lint, typecheck, tests and production build; fix observed defects.
- [x] Browser QA at 390, 768 and 1440, reduced motion and WebGL fallback. Record actual measurements separately per route.
- [x] Obtain one independent whole-project review and resolve material findings.
- [x] Save screenshots, content uncertainties, editing instructions and Vercel deployment steps.

## Execution ledger
- Ruling: Work in the empty provided checkout on codex/personal-workshop; there is no existing work or baseline commit requiring isolation.
- Ruling: Use native inline execution and proceed without approval gates because the brief explicitly delegates routine decisions and asks for a complete build.
- Ruling: Deliver local code and deployment instructions as specified; no external hosting registration or publication is needed.

- Completed all three tasks on 11 November 2026. Final production build, lint, typecheck, 5 movement tests and 14 browser tests passed.
- Independent review findings were reproduced and fixed: opposing movement keys, short mobile-menu overflow, and repeated project selection focus. No material review findings remain.
- Saved production screenshots, per-route measurements, verified-content notes, editing guidance and deployment instructions. The production preview remains available locally; no public deployment was made.
