# Covers, Signal Run and workshop music

User request: remove the original project pictures, add a playable component, and add music while using the workshop. Continue the prior authorization to make routine choices and deliver a working local application.

## Approach
Replace the two live-product screenshots with original code-native abstract illustrations. Preserve project text, links, and the existing pavilion artwork. A light interactive cover was considered, but an optional rover activity uses the larger world meaningfully. A timed racing game would add pressure; choose a relaxed five-beacon Signal Run with ordered collection, progress, restart and completion instead.

Add visible Start/End controls above the scene and a directional pad inside it for touch and keyboard-button use. WASD and arrows retain existing focus rules. Checkpoints are traversable ground markers; reset cancels a run, replay starts fresh, and unavailable WebGL disables the game while preserving project navigation. No timer or mandatory objective.

Add a small workshop radio beside the game controls. Compose a quiet ambient loop with Web Audio synthesis, avoiding remote audio, licensed tracks, and dependencies. Explicit Play/Pause and a volume slider control it. Start only on Play; pause when the page is hidden, resume only if the user left music enabled, and close audio resources when leaving Explore. Audio failures show useful feedback. Music also works with the static workshop fallback.

## Verification
Test ordered checkpoint collection and completion in pure logic, complete a real keyboard-driven run in the browser, check mobile pad release, verify removed screenshot requests, and inspect real AudioContext output/lifecycle. Check responsive covers and the activity bar, run the full existing checks, and save screenshots. Preserve local-only delivery.
