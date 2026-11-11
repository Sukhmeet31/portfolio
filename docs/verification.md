# Verification and handoff

Checked locally on 12 November 2026. This is a source-code delivery with a local production preview; it has not been deployed to Vercel.

## Implementation

- Responsive editorial homepage; real resume PDF; three static project-detail routes; deliberate 404; generated social image, favicon, robots and configurable sitemap.
- One typed profile/project/experience source. No invented project repository or impact metrics. Original abstract illustrations for all three project covers, and an actual scene capture as the workshop preview. Product screenshots are archived outside public assets.
- Separate dynamically imported 3D coastal island with three stations, direct selection, HTML project index, focus-aware panels, collision-aware rover, reset and camera controls.
- Demand rendering, hidden-tab pause, capped DPR, economical shadows, cleanup, WebGL/context-loss fallback, and reduced-motion support.
- Coastal playground: 64 × 50 world units, exactly 10× the previous 20 × 16 courtyard's area. Ordered six-gate race with elapsed time and off-track invalidation; ten-pin rover bowling with chain collisions and wobble; ocean/ripples, curved ramp, pier and lighthouse. Night mode changes both the interface and scene, with a moon, stars and illuminated track edges. Quick travel, boost, overview/follow cameras and a mini-map cover the full island. The existing sculpture, plane and paint bay remain.
- Follow camera is enabled on entry. A mobile browser check verifies that a fixed project landmark moves across the screen as the rover drives, and that overview/follow controls still switch modes. Artwork scripts explicitly select overview.
- Signal Run: an optional five-beacon circuit with ordered collection, scene/mini-map markers, progress, restart/end/replay, and pointer/keyboard directional controls.
- Project passport: three ink-style stamps collected through explicit station selection or rover proximity; browser-local persistence, duplicate protection, completion feedback and unavailable-storage fallback.
- Workshop radio: original locally synthesized ambient music at the former slider's maximum setting, with no volume slider. Attempts playback on entry and retries on ordinary workshop interaction when browser policy requires it. Play/pause controls requested playback, including pending starts; hidden-tab suspension and route-exit cleanup remain. No downloaded audio or device-volume changes.

## Checks

Final checks on the delivered application:

| Check | Result |
| --- | --- |
| `npm run lint` | Passed without warnings |
| `npm run typecheck` | Passed |
| `npm test` | 14 movement, checkpoint, world, race and bowling tests passed |
| `npm run build` | Passed; homepage and all three project routes generated statically |
| `npm run test:smoke` against the production server | 38 browser tests passed |
| Production dependency audit | 0 vulnerabilities reported; raw result in `audit-production.json` |

The browser suite covers navigation and direct project URLs, the deliberate 404, resume access, email-copy success and failure, mobile menu navigation, reduced motion, unavailable WebGL and context loss, rover movement/reset/focus, project selection and dismissal, and the three review regressions below. Responsive captures at 390, 768 and 1440px check horizontal overflow; an additional 320px case covers the contact heading. Normal production navigation recorded no console errors. Manual browser inspection also confirmed selection by clicking the document sculpture itself.

The resume, favicon, social image, robots file, and sitemap returned HTTP 200 with the expected content types. No database or backend service is required.

After the full suite, a final hover-contrast adjustment was rebuilt and both responsive visual tests passed again. The day/night/bowling capture script completed against this final production build with no page errors. Performance measurements below were refreshed after browser tests finished.

The follow-camera handoff was then rebuilt and verified: lint, types, all 14 unit tests and all 38 production browser tests pass (2.4 minutes). The mobile check covers real landmark displacement during driving, the default follow state and overview/follow switching. Git attributes keep the resume, images and fonts binary; the staged resume hash matches the working file. The Git destination is `Sukhmeet31/portfolio`, branch `codex/personal-workshop`, based on its existing main history.

The expansion adds checks for crossing the former map edges while respecting the new boundaries, repeated toy completion, actual canvas changes when painting or switching lighting, mobile camera/reset controls, reduced-motion completion, and Canvas filling its mobile frame. The play/music update adds abstract-cover checks, a full driven circuit and replay, mobile control release, held keyboard/pointer completion, actual audio output and lifecycle checks, and audio failure handling. Passport and background-music checks add persistence, proximity collection, corrupted/denied storage, autoplay permission/fallback and pending-start cancellation/cleanup. The coastal update adds six browser cases and six unit cases; the full production browser run passed all 38 tests in 2.3 minutes.

## Production measurements

Three runs per route in headless Edge at 1440 × 1000, using a fresh browser context each time, an unthrottled local production server, and warm server/OS caches. Timings below are medians. These are local observations, not Lighthouse scores, mobile estimates, or field performance guarantees.

| Measurement | Homepage `/` | Workshop `/explore` |
| --- | ---: | ---: |
| First contentful paint | 200 ms | 152 ms |
| Largest contentful paint | 200 ms | 152 ms |
| Cumulative layout shift | 0 | 0 |
| Total transferred | 295.6 KiB | 567.7 KiB |
| JavaScript transferred | 193.9 KiB | 463.3 KiB |
| Renderer ready signal | Not applicable | 705 ms |
| Three.js renderer chunk requested | No | Yes |

Workshop LCP measures HTML content, not the completed 3D image. The renderer-ready signal records Canvas initialization, not a GPU first-frame timestamp. Transfer sizes include browser-reported resource transfer overhead. The script checks production chunks for `WebGLRenderer` and compares those filenames with requested resources: the renderer was absent from all three homepage runs and present in all three Explore runs. Raw results and chunk names are in `performance.json`; the reproducible script is `scripts/measure.mjs`.

## Screenshots

Production screenshots are saved in `screenshots/`: homepage, project detail, and workshop at 390, 768 and 1440px; desktop and mobile hero crops; and the 320px contact regression. `runtime-errors.json` contains the empty normal-navigation error list. The final homepage and workshop captures were inspected visually; no development overlays are included.

The coastal island has day/night scene captures, desktop/mobile night captures and a bowling action capture under `screenshots/coastal-*.png`, plus `screenshots/workshop-night.png`. The refreshed hero/fallback artwork is `public/images/workshop-expanded.jpg`, captured from the actual implementation with `scripts/capture-workshop.mjs` with interface and development overlays excluded. `scripts/inspect-coast.mjs` reproduces the activity captures against `PLAYWRIGHT_BASE_URL`.

The active Signal Run and radio are shown in `screenshots/workshop-signal-run-1440.png` and `screenshots/workshop-signal-run-390.png`.

The completed passport and updated radio are shown in `screenshots/workshop-passport-1440.png` and `screenshots/workshop-passport-390.png`.

## Review fixes

An independent reviewer found three interaction defects. Each received a reproducing browser test that failed before the fix and passed afterward:

1. Opposing keys stopped the demand frame loop. The loop now remains active while movement keys are held, even if the directions cancel.
2. The mobile menu could hide its final items on short screens. It now scrolls internally while the page is locked.
3. Re-selecting an open project left stale focus intent. Each selection now owns its focus request, so later proximity selection keeps focus on the rover.

Additional QA found and fixed:

- The contact heading overflowed at 320px. Its mobile type size now scales to the available width.
- Entry animation moved the primary action's hit area during early interaction. Controls now remain stationary while the title and artwork animate.
- Drei's HTML helper created nested React roots that emitted development unmount errors. Station labels now live in the page's existing DOM root, with camera-projected positions.
- Next.js 16 needs an explicit smooth-scroll attribute for instant route transitions. The root layout now declares it.

Expansion QA caught a mobile flex-sizing regression: Canvas fell back to 150px inside a 320px scene frame. A failing browser assertion reproduced it; positioning Canvas to fill the scene made it pass. The independent expansion review found no remaining actionable issues after checking label hit targets, camera/reset behavior, context loss during a flight, and hidden-tab pause/resume. Visibility and context loss were simulated; physical touch devices were not exercised.

The play/music review found that finishing the circuit while holding Enter on a directional button could leave the rover moving after the button disappeared. A browser regression reproduced this before the fix. The directional pad now releases all held driving state when it unmounts; keyboard and pointer completion regressions pass. The independent reviewer accepted the fix with no remaining findings. The focused suite also verifies actual audio samples, silence at zero volume, pause, simulated hidden-tab suspension/resumption, context closure on route exit, and graceful handling of unavailable audio.

The passport/background-music review found one pending-resume defect: the old button tracked resolved playback, so it could not cancel a start while browser permission was pending. A reproducing browser test failed before the fix. The button now tracks requested playback, and the engine suspends a late resume after cancellation. The updated audio assertions verify the fixed maximum gain instead of the removed slider. Additional checks cover permitted automatic playback, blocked-autoplay recovery through exploration, pending-start navigation cleanup, browser-local stamp persistence, repeated visits, invalid data and denied storage. Existing Signal Run/toy behavior is covered by the full regression suite; operating-system/device volume is outside website control.

## Evidence and limitations

- Coastal review identified a frame-dependent lap timer and post-Signal-Run loss of the mobile pad. Both were reproduced with failing tests. Race timing now accumulates visible wall time separately from clamped physics; a 10 fps browser test, pure 4/10/60 fps checks and hidden-tab pause/resume cover it. The pad remounts at completion, releasing held input while keeping free driving available; keyboard and pointer completion cases also verify driving can resume.
- New island checks cover a complete driven lap, off-track invalidation/restart, actual rover bowling and reset, mobile coast/wave/night controls, night cleanup on route exit, quick-travel cancellation and input release, and disabled activities without WebGL. Night and ocean visuals were inspected at desktop/mobile sizes. Visibility, reduced motion and slow rendering are simulated in browser tests.

- Both supplied Vercel demos, both project repositories, and the GitHub profile returned HTTP 200. Both demos were also inspected visually. Their protected workflows and AI quality were not validated.
- LinkedIn blocks the automated request. The site uses the exact profile URL supplied by the user.
- The resume contains dates and claims that support the conservative public descriptions. No conflicting experience dates were found. The marketplace's Node.js wording differs from its Firebase-only README; the public technology list follows the repository.
- Legal Simplifier has no confirmed repository, and the marketplace has no supplied live URL. Corresponding buttons are omitted.
- Browser QA uses desktop Edge/Chromium with responsive emulation. Physical iOS/Android devices and Safari/Firefox were not tested.
- The R3F/Three dependency combination emits a non-fatal `THREE.Clock` deprecation warning. It does not produce a runtime error. No application console errors are expected during normal navigation; deliberately blocking WebGL naturally produces a renderer diagnostic before the fallback.
- `NEXT_PUBLIC_SITE_URL` must be set to the deployment's real HTTPS origin before the final deploy so the sitemap and social metadata use the correct domain. No domain is invented in the sitemap.

## Design and implementation references

The visual references were inspected without copying their assets or worlds: [Dennis Snellenberg](https://dennissnellenberg.com/) and [Bruno Simon](https://bruno-simon.com/). Dependency pairing was checked against the npm registry and the [React Three Fiber installation guide](https://r3f.docs.pmnd.rs/getting-started/introduction). Framework conventions were checked against the installed Next.js documentation and the official [installation guide](https://nextjs.org/docs/app/getting-started/installation).

## Decisions made during execution

- Worked in the supplied empty checkout on `codex/personal-workshop`. There was no previous application or commit to isolate.
- Used inline implementation and one independent reviewer because the detailed brief delegated routine decisions and requested a complete working build.
- Kept this as a local source-code delivery with Vercel instructions. No hosting account, public deployment, or remote push was created.

These choices preserve the requested workspace and keep deployment under the owner's control. There are no deferred material review findings.
