# Workshop Expansion Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Enlarge the map and add three optional toys, dusk lighting and navigation aids.
**Architecture:** Retain the dynamic scene boundary. Share plain world constants with movement and the HTML mini-map; isolate animated toys in a playground component. The shell owns action state and accessible feedback; R3F owns finite animation frames.
**Tech stack:** Existing Next.js, TypeScript, R3F/Three, React and CSS; no new packages.
**Spec:** ../specs/2026-11-11-workshop-expansion-design.md

## Global constraints
- 20 × 16 floor, bounds ±9.2/±7.2; retain start X 0 / Z 2.8.
- Preserve existing project content and all ordinary HTML navigation.
- Reduced motion is immediate; hidden tabs pause; idle scene stops rendering.

## Review focus
- Former edges must now be traversable, new edges must stop the rover.
- Repeated actions must not leave an animation or control stuck.
- Follow camera and reset must preserve focus and usable framing.
- Reduced motion and context loss must leave meaningful feedback and usable navigation.
- Project labels and touch controls must remain reachable at 390px.

## Task 1: Expanded world and movement
**Files:** lib/movement.ts, lib/workshop-world.ts, lib/content.ts, components/workshop/objects.tsx, tests/movement.test.ts.
**Interfaces:** WORLD bounds/floor dimensions, toy positions, rover colours; stepRover signature stays unchanged.
- [x] Write and run failing old-edge traversal and new-edge containment tests.
- [x] Implement shared world values, larger architecture and relocated project stations.
- [x] Run movement tests; expect all passing.

## Task 2: Interactions, lighting and navigation
**Files:** components/workshop/{playground,scene,workshop,mini-map}.tsx, app/globals.css, tests/workshop.spec.ts.
**Interfaces:** toy action counters plus busy flags in shell; onToyComplete callback from finite scene animation; shared rover position ref for camera; projected labels identified by dataset keys.
- [x] Add and run failing browser journeys for toys, repeat launch, paint cycling, dusk, follow/reset and reduced motion.
- [x] Implement three toys with direct/HTML activation, mini-map and camera/light controls.
- [x] Run targeted browser tests and existing workshop regressions; expect all passing.

## Task 3: Visual QA and handoff
**Files:** public/images/workshop-expanded.jpg, screenshots/, README.md, docs/verification.md.
- [x] Inspect the expanded world at 390, 768 and 1440px and adjust composition if needed.
- [x] Refresh the real scene preview, run lint/typecheck/unit tests/production build and browser suite.
- [x] Obtain one independent review; fix material issues and verify them.
- [x] Save updated screenshots and concise usage notes; retain a local preview.

## Execution ledger
- Ruling: Continue in the existing task branch and checkout, preserving all existing source; the original delivery has no baseline commit. Use this file for progress instead of git-range helper scripts.
- Ruling: The prior explicit delegation of routine decisions remains in effect. Implement the described studio playground without another design approval gate; choices are recorded as the agent's proposal, not a new user selection.

- Task 1: complete. Two movement regressions failed against the original bounds; all 6 movement tests now pass.
- Task 2: complete. New toy and camera journeys failed before the controls existed; targeted browser tests now pass. Lint caught an ambiguous ref name; using an explicit positionRef preserves correct mutation semantics.
- Task 3: complete. Visual QA reproduced the mobile Canvas sizing failure (150px inside320px); explicit Canvas positioning fixes it. Final lint, typecheck, production build, 6 unit tests and16 browser tests pass. Screenshots and measurements refreshed.
- Final review: independent reviewer found no remaining actionable issues, including hidden-tab pause/resume, context loss mid-flight, follow/reset focus and mobile label hit targets. No deferred findings.
- Ruling: Keep source and branch in place with a running local production preview. No merge, remote push or deployment requested.
