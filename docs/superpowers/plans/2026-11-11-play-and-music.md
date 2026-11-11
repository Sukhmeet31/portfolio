# Play and Music Implementation Plan

> Use superpowers:executing-plans for native implementation, with meaningful regression tests and one final independent review.

**Goal:** Remove product screenshots and add an optional playable rover circuit with workshop music.
**Architecture:** Server-rendered abstract covers; a small pure checkpoint module consumed by the workshop and scene; an isolated radio component and Web Audio engine. Existing scene boundary and movement engine remain.
**Tech stack:** Existing Next.js/React/TypeScript/R3F; browser Web Audio; no packages.
**Spec:** ../specs/2026-11-11-play-and-music-design.md

## Constraints and review focus
- Preserve portfolio content and general composition. No original screenshots in rendered project covers.
- Only collect the next beacon; restarting resets progress and rover position.
- Touch release, keyboard-button release, blur and hidden tabs must stop driving.
- Music must produce real audio, pause reliably, resume only when enabled, and close on navigation.
- WebGL/audio failure and reduced motion retain usable navigation and controls.

## Tasks
- [x] Add failing pure checkpoint and browser acceptance tests; observe expected failures.
- [x] Replace screenshot covers with abstract SVG artwork and remove screenshot references from shared content.
- [x] Implement ordered checkpoints, world markers, mini-map markers, start/end/replay and directional controls.
- [x] Implement original ambient synthesis, accessible radio controls and lifecycle cleanup.
- [x] Run focused tests, inspect mobile/desktop, fix observed issues and obtain independent review.
- [x] Run full checks/build and production browser suite; update screenshots, measurements and README.

## Ledger
- Ruling: Existing task checkout and delegated design choices continue. Preserve the current branch and source; no publication or merge requested.
- Ruling: Interpret playable component as a real optional game in the workshop; abstract covers replace the product images without embedding a second app in each card.
- Evidence: 8 unit tests and 23 production browser tests pass; lint, TypeScript and production build pass. Real audio samples, volume silence, pause, simulated visibility changes and route-exit teardown verified.
- Review: One P2 held-direction completion issue reproduced, fixed by pad-unmount cleanup, and covered for keyboard and pointer. Independent follow-up accepted the fix; no remaining findings.
- Handoff: Updated local production preview at http://localhost:3000/explore. All work remains in the supplied checkout; no commit, push or deployment.
