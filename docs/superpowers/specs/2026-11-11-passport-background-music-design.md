# Project passport and background music

The owner accepted the project-passport idea and requested removal of the volume option, with music playing at maximum volume while exploring. Continue the existing delegation of routine implementation decisions and local-only delivery.

## Approach
Add a compact passport to the project sidebar, using three ink-style seals matching the document, code and gathering stations. A stamp is collected through the existing station-selection path: clicking geometry, a station label, the HTML project index, or rover proximity. Repeat visits do not duplicate stamps. Show an accessible count and a completion message at three. Save only known project slugs in this browser's local storage; tolerate corrupted/unavailable storage with an in-memory fallback. Preserve stamps on rover resets and navigation.

A session-only passport would lose its souvenir value on reload; a server account would add unnecessary friction. Browser-local persistence is the implementation choice, not a new user requirement. Keep existing HTML navigation and WebGL fallback usable.

Remove the radio's volume slider. Fix the engine at the former slider's 100% setting (master gain 0.3; existing voice mix unchanged). Attempt playback on workshop entry and retry through the first workshop pointer or keyboard interaction if browser autoplay is blocked. Keep play/pause available, never disable it while resume is waiting on browser permission, and honor a manual pause through subsequent interactions. Continue hidden-tab suspension and route-exit cleanup. This changes website output only, not operating-system/device volume.

## Verification
Real browser tests cover stamps from clicks and rover proximity, duplicate visits, reload persistence, all-three completion, invalid storage, unavailable storage and fallback navigation. Inspect real audio output at the fixed maximum, autoplay fallback through ordinary exploration, manual pause, visibility changes and leaving the route. Retain existing movement/game tests and mobile/reduced-motion checks. No new packages.
