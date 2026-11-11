# Coastal Playground Implementation Plan

> Use superpowers:executing-plans for inline implementation and one independent final review.

**Goal:** Expand the workshop ground 10× and add real racing, bowling, ocean interactions and night mode.
**Architecture:** Shared world/zone constants and pure race/bowling functions; procedural coastal scenery and a frame-driven activity controller; integration through the existing workshop shell and rover. Keep project content at its current coordinates.
**Stack:** Existing Next/React/R3F/Three/TypeScript/Playwright. No new packages.
**Spec:** ../specs/2026-11-12-coastal-playground-design.md

## Constraints / review focus
- Exactly 64 × 50 ground; bounds and mini-map must agree with visuals.
- Boost must not tunnel through obstacles; travel/reset clears held input and in-progress races.
- Race gates must be ordered, starting on the finish line must not finish a lap, off-track invalidates, hidden time does not accumulate.
- Pins must fall through real collisions, settle, reset and remain playable after repeated attempts.
- Night theme cleans up on navigation; reduced motion and WebGL/context loss keep useful HTML controls and stable state.
- Wide overview labels must remain usable; mobile driving must stop on release/cancel.

## Tasks
- [x] Write and observe failing world/game unit tests and browser acceptance cases.
- [x] Expand world bounds and movement speed; implement pure circuit/bowling mechanics in lib/coastal-games.ts.
- [x] Add coastal scenery, ocean, track, bowling, stunt ramps, light sources and activity animation components.
- [x] Integrate travel, race/bowling/wave feedback, boost, driving controls, camera/minimap and night UI.
- [x] Run focused checks and inspect the experience; independently review and fix reproduced findings.
- [x] Regenerate preview, build, run all production tests and update screenshots/README/verification.

## Ledger
- Continue the supplied checkout and native implementation; all source is untracked, with no commit/push/deploy requested. Use this ledger instead of commit-dependent helper scripts.
- Scope decision: 10× refers to area. The source 20 × 16 and target 64 × 50 are recorded above so the interpretation is reviewable.
- Tasks 1–4 complete: new unit tests observed RED before mechanics existed; missing travel button observed RED before UI integration. `npm test`: 13/13 passed. Three browser acceptance cases now pass (two in the first run, mobile after correcting the wave button's accessible name). Lint and types pass after naming the shared animation ref explicitly.
- Pre-flight interfaces: movement, camera and minimap consume WORLD; scenery and activities share gate/ramp geometry; shell owns reset/travel generations and UI state. Reset effects run after rover placement, before pin/race integration. Existing project coordinates remain unchanged.
- Inspected desktop day/night, bowling and mobile night captures. Ocean extended past the camera frame and moon lowered to keep it inside overview. Production captures remain to be regenerated.
- Independent final review: one important timer defect and one mobile-control finding. Treat missing post-win driving as important to the requested continuous mobile exploration; fix alongside the timer. No declined-to-judge items or deferred minors.
- Reproduced both findings before fixing: 4 fps pure timing counted 4s for 10s; a browser throttled to 10 fps showed 0.9s over 1.8s; the post-Signal-Run driving-pad assertion failed. Timer now counts visible wall time independently of physics steps; completion remounts the pad to release held input while retaining controls. Focused and full verification pending.
- Final fixes verified: equal-time unit regression RED→GREEN; slow-renderer browser regression RED→GREEN; held-key finish/pad-resume regression RED→GREEN. Four targeted browser checks (including hidden time and pointer finish) pass, along with all 14 units, lint and types. Production build passes. Full production suite running.
- Refreshed hero artwork from the implemented island. Native browser inspection confirms night palette, controls, working radio and preserved passport. Small final CSS correction keeps a selected travel toggle legible under hover; rebuild and visual checks will cover it.
- Full production suite: 38/38 browser tests pass in 2.3 minutes; 14/14 unit tests pass. Final hover-only CSS is being rebuilt and rechecked with the responsive visual suite. Independent review fixes verified without a second review; no unresolved findings.
- Task 6 complete: final build passed; both visual browser tests passed again after the hover correction. Final coastal capture script reports no page errors and a 10/10 bowling hit. Refreshed six production performance samples and all screenshots; updated README and verification. Production preview remains at http://localhost:3000/explore (session 17110), with source kept in the supplied checkout. No push/deployment or branch deletion requested.
