# Island Adventures Implementation Plan

> Use superpowers:executing-plans for inline work, then one independent final review.

**Goal:** Implement the four accepted upgrades and push them to the established Git branch.
**Architecture:** Pure mechanics and a persistent external store; ghost recording in the race controller; separate exploration world/UI and tour UI; shell coordinates mode changes.
**Tech Stack:** Existing Next/React/R3F/Three/TypeScript/Playwright.
**Spec:** ../specs/2026-11-12-island-adventures-design.md

## Review Focus
- Corrupt, oversized or unavailable storage must not break rendering or grant invalid equipment.
- Cancelled/invalid races never save a ghost; visibility gaps must not advance a replay or ferry.
- Travel/reset/tour changes release held inputs and cancel stale ferry/race/tour callbacks.
- Mainland/cove bounds exclude water and every return route remains available.
- Tour controls work with keyboard, reduced motion and unavailable WebGL; manual exploration can interrupt it.

## Tasks
- [x] 1. Write failing pure tests; implement ghost/expedition types, validation, interpolation, unlocks, movement bounds and browser storage. Verify units.
- [x] 2. Extend clean-lap recording, ghost playback and best/medal UI. Drive real laps and verify persistence/replay.
- [x] 3. Add treasure landmarks, garage visuals, cove/ferry/puzzle and separate land bounds. Verify actual discovery, travel/reset and rewards.
- [x] 4. Add recruiter tour and integrate cancellation, hidden-time handling, fallback and mobile layout. Verify tour completion/pause/manual interruption.
- [x] 5. Run full checks, inspect visuals, request one independent review, fix reproduced material findings, update documentation and push.

## Interfaces and ledger
- Baseline: 0de1164, clean codex/personal-workshop with origin tracking. Existing branch is the authorized workspace; native Windows workflow uses this ledger rather than Bash workspace helpers.
- Task 1 defines BestLap/Sample, AdventureSave, clue locations, bounds and ferry endpoints consumed by tasks 2–4. Use one authoritative rover position; the race controller continues to own lap elapsed time.
- Shell resets cancel race, voyage and tour. Voyage moves the rover before camera update. Project stamps remain in their existing store and only determine the wheel unlock.
- No new libraries, accounts, external assets or hosting deployment. Push is explicitly authorized.
- Five new unit tests failed before implementation. All 19 units now pass. Ten focused browser tests pass, along with lint, types and production build.
- Independent review verified ferry cancellation and found four issues. Tour stops now select their project, manual navigation preserves pause, saved ghosts must contain the six ordered gate crossings, and position reporting uses monotonic time across renderer visibility resets. Browser and unit checks exercise these behaviors.
- Final production run passed all 42 browser tests in 2.5 minutes. Visually checked the ferry and cove at night and confirmed the adventure controls in the in-app preview. Published on the existing codex/personal-workshop branch.
