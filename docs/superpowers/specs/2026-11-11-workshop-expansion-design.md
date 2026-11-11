# A larger studio playground

The user wants a bigger workshop map, additional interactive objects, and ideas that make it more memorable while retaining the existing portfolio design. Their earlier brief delegates routine choices and asks for complete implementation, so this extension continues that authorization.

## Approach

Three approaches were considered: simply enlarging the courtyard (more driving space but little discovery), adding a game with objectives (more machinery and a different purpose), or expanding the studio with a few tactile toys. The third is the implementation choice: it keeps project discovery central and adds optional play.

- Expand the architectural floor from 12.5 × 10.5 to 20 × 16 world units, approximately 2.44 times the area. Driving bounds are ±9.2 X and ±7.2 Z.
- Spread the three existing project stations across the rear court. Keep CodeMate-X on the centre axis so approaching it from the start remains intuitive.
- Add a kinetic ring sculpture, a paper-plane launch pad, and a paint bay that cycles the rover through cobalt, sage and ink.
- Each toy can be clicked in the world or activated through keyboard-accessible HTML buttons. Announce the result in a polite status region. Repeat activation remains safe.
- Provide a compact live mini-map, an optional follow-rover camera, an overview reset, and a day/dusk light switch. The site outside the workshop keeps its established colour treatment.
- Keep bounded movement, collisions, project panels, reduced-motion support, hidden-tab pause, demand rendering, and WebGL fallback. Toy motion is finite and user initiated. Reduced motion uses immediate final poses.
- Refresh the workshop preview from the expanded implementation. No new dependencies, accounts, deployment, or invented portfolio content.

## Acceptance

The rover can travel beyond the former edges but cannot leave the expanded floor. All toys visibly change the scene, complete and can be repeated. Project selection still works by geometry, labels and HTML list. Camera controls and toys work at mobile widths. Disabling WebGL leaves useful project navigation and clearly unavailable scene controls. Existing checks and targeted regressions pass; save new screenshots.

## Future idea, not part of this change

A small AI evaluation lab could let visitors compare two authored example answers and reveal a subtle error, connecting the world to Sukhmeet's evaluation work. It needs carefully written example content before implementation.
