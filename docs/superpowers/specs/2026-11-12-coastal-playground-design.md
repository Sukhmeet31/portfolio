# A ten-times-larger coastal workshop

The user requested a racing track, a bowling space the rover can hit and stumble through, ocean water, more creative interactions, a 10× larger workspace, and dark/night mode. Continue the existing delegation of implementation choices and local-only delivery.

## Approach
Expand the current 20 × 16 ground to 64 × 50 world units: 3,200 square units, exactly 10× its 320-square-unit area. This interprets size as ground area, not ten times each axis. Keep project stations and Signal Run at their existing coordinates to preserve the portfolio journey. Build a coastal island around them, with a connected west circuit, east bowling lane, southeast stunt/pier area and surrounding ocean. An empty scaled courtyard would add travel without discovery; a new physics engine would add dependency and integration cost. Choose procedural scenery and deterministic lightweight gameplay using the existing R3F and movement system.

The racing circuit has a start line, ordered gates, elapsed time and completion feedback. A clean lap must stay on the circuit; excursions invalidate it until restart. Zone travel cancels a race. Time pauses while hidden. Boost is available by Shift and an on-screen toggle; the central courtyard retains precise slow movement.

Bowling has ten physical-looking pins, rover/pin and pin/pin impulse collisions, fall animation, a score and a reset/rack control. Pin impacts briefly wobble the rover without trapping it. A small stunt lane adds ramps/bumps and suspension movement. Reduced motion retains outcomes without wobble or continuous water animation.

Water is a low-poly animated ocean surrounding the island. Clicking it or choosing Make waves creates expanding ripple rings. A pier and lighthouse anchor the coast. Night mode changes the entire workshop palette, the sky and lighting, ocean, luminous track edging, stars and lighthouse beam; cleanup restores the normal site when leaving Explore.

## Navigation and compatibility
An island overview, follow camera, mini-map and named quick-travel stops make the larger space usable. Keep on-screen driving controls available during free exploration. Existing project panels, passport, music at its fixed maximum, Signal Run and toys remain functional. Stop held input on travel/reset/focus loss. Keep an accessible HTML project index and disable 3D-only activities on WebGL failure. Use no new dependencies or remote art/audio.

## Verification
Pure tests: exact area, expanded bounds, speed/substep collision, ordered race gates/off-track failure, collision-triggered bowling and pin reset. Browser tests: full driven lap, invalidation and restart, bowling with actual rover movement, mobile controls, coast ripples, night interface/canvas changes, fallback, existing 32 regressions. Inspect desktop/mobile captures and regenerate the actual scene preview. Run lint, types, units, build, production browsers and one independent review.
