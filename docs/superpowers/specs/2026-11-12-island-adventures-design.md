# Island adventures

The user approved all four proposed upgrades and a Git push. Continue inline implementation on the existing codex/personal-workshop branch; publish to its established origin after verification.

## Design
- Ghost laps: record a clean lap's timed positions, retain the fastest in this browser, and interpolate a translucent rival during the next attempt. Show personal best and gold (≤18s), silver (≤24s), or bronze medals. Invalid/cancelled laps never replace the best. Recording is bounded to 1,200 samples, keeping first/last and thinning older data as needed. Ghost time follows the visible lap clock. Corrupt/denied storage must not break gameplay.
- Treasure/garage: three collectible landmarks on the main island and a fourth bottle puzzle in the cove. Driving close collects main clues. One clue unlocks coral paint, three unlock sunset paint, three passport stamps unlock rally wheels, and solving the cove puzzle unlocks headlights. Equipment persists and cannot be selected while locked. Existing paint cycling remains available.
- Secret island: a 16 × 18 cove at (50,0), separate from the existing 64 × 50 mainland. A dock at (30,0) carries the rover to (44,4) in a six-second ferry journey; return travel is always available. Steering is released/locked during transport; camera follows. Separate movement bounds prevent driving through ocean. Hidden tabs pause travel; reduced motion arrives immediately. The bottle asks which project combines an editor and an assistant; the answer reveals an existing CodeMate-X story and rewards the fourth treasure. No invented biography.
- Recruiter tour: an optional approximately one-minute tour, with three 15-second project stops and a 15-second closing summary. Show existing verified project summaries and implementation highlights. Include pause/resume, previous/next/end, resume download and email/contact links. Navigation selects/stamps the relevant project and moves the follow camera. Manual driving/travel/reset cancels guided playback. Hidden time is excluded. The tour remains usable through HTML when WebGL is unavailable.

## Architecture and constraints
Use the existing React/R3F stack, no new dependencies. Pure expedition/ghost validation and interpolation in lib; one browser-local external store; separate adventure UI/world and tour components. Extend existing race controller rather than adding a parallel timer. Existing passport, music, camera, bowling, Signal Run, reduced-motion and fallback behavior remain covered.

The suggested alternative of remote accounts/leaderboards would add a backend and data handling beyond this request. Use browser-local personal bests and rewards. A teleport-only cove would underdeliver the ferry proposal; include a visible boat journey with an instant reduced-motion equivalent.

## Verification
Unit tests cover replay interpolation and bounds, best selection, malformed saves, collection uniqueness/unlocks, ferry interpolation and separate land bounds. Browser tests drive a lap and verify its persistent ghost, collect clues/unlock/equip rewards, board/return and solve the cove puzzle, operate/pause/cancel the tour and use it without WebGL. Review visibility gaps, stale callbacks, held input, corrupted storage and cross-feature cancellation. Inspect desktop/mobile day/night, then build, run the full suite, review independently and push.
