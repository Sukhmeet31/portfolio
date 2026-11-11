# Passport and Background Music Implementation Plan

> Use superpowers:executing-plans for inline implementation, followed by one independent review.

**Goal:** Collect project stamps while exploring, and play fixed-volume background music without a volume slider.
**Architecture:** A browser-local passport store observed with useSyncExternalStore, rendered by a small sidebar component and updated by the existing select callback. Extend the existing music lifecycle with automatic entry/interaction activation; keep the audio engine's revision guards.
**Tech stack:** Existing Next.js, React, TypeScript, Web Audio and Playwright; no new packages.
**Spec:** ../specs/2026-11-11-passport-background-music-design.md

## Constraints and review focus
- Unknown/corrupt stored values must not grant stamps; denied storage must not break exploration.
- Proximity must collect without stealing scene focus; resets must preserve collection.
- A pending autoplay promise must not disable controls or start sound after manual pause/route exit.
- Strict Mode, rapid interactions, hidden tabs and route re-entry must not create duplicate music loops.
- Passport and audio must work with the static WebGL fallback and narrow layouts.

## Tasks
- [x] Add failing passport and updated background-audio browser tests; observe expected failures.
- [x] Add lib/project-passport.ts (subscribe/snapshot/collect), components/workshop/passport.tsx and responsive seal styling; connect collection to Workshop.select.
- [x] Remove slider and volume API; implement automatic entry/interaction playback at fixed maximum with pause/visibility/unmount handling.
- [x] Run focused checks and independent review; fix reproduced defects.
- [x] Build, run the full production suite, inspect responsive screenshots and update documentation/preview.

## Ledger
- Existing supplied checkout and inline execution remain. No commits, push or deployment requested; all original source is untracked. Record progress here rather than invoking commit-dependent workspace helpers.
- Pre-flight: passport and music share workshop interactions but no state; passport selection must not restart playing music or override a manual pause.
- Evidence: initial assertions failed on missing passport UI and still-present volume slider. Focused 8 browser tests pass, including real audio samples at gain 0.3; lint and typecheck pass. Desktop/mobile captures inspected.
- Environment: sandboxed Edge could not create its temporary profile and could not reach the sandboxed dev server from an external browser. Approved escalation runs the local preview and browser checks together; no application changes were made for this environment issue.
- Review: pending audio start could not be cancelled because the button used resolved playback state. Regression failed before fix, then passed. Requested playback now controls the button; a late resume is suspended when a newer pause exists. Focused suite: 11 passed. Reviewer reported no other issues.
- Review scope: existing game/toys remain covered by full regression tests; desktop/mobile inspection and production checks are performed by the implementer. Device volume is not changed; maximum means the existing audio mix's 100% level.
- Startup is scheduled after mount and cancelled on immediate exit, which also avoids synchronous error-state updates during React effect setup. Final lint passes.
- Final evidence: production build/TypeScript, lint, 8 unit tests and all 32 production browser tests pass (1.8 minutes). Updated production screenshots inspected; no normal-navigation runtime errors. Performance measurements and README refreshed. In-app preview completed all three stamps and confirmed background playback without a volume slider.
- Handoff: http://localhost:3000/explore remains running locally. No unresolved review findings, new packages, commits, push or deployment.
