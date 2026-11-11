# Sukhmeet Singh — Personal project workshop

A Next.js portfolio with an editorial homepage, three project pages, and a separate interactive coastal island at `/explore`. The homepage uses a still of the implemented scene and does not import Three.js. Project pages and workshop stations share typed content.

## Run locally

Use Node.js 22.18+ (or Node.js 24/26) and npm. The lockfile pins stable dependency versions; React 19 is paired with React Three Fiber 9 and Drei 10.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production run:

```sh
npm run build
npm start
```

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run test:smoke
```

The movement tests run with Node's native TypeScript support. Browser smoke tests use Playwright and the installed Microsoft Edge channel by default. On other machines install Chromium with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium` when running the tests. Set `PLAYWRIGHT_BASE_URL` to test an already-running production server. The visual test writes screenshots at 390, 768, and 1440 pixels to `screenshots/`.

To repeat the local performance measurements, keep `npm start` running, set `PLAYWRIGHT_BASE_URL=http://localhost:3000` in your shell, and run `node scripts/measure.mjs`. It writes three samples per route to `docs/performance.json`. See `docs/verification.md` for the measured results and their limits.

## Where to edit

| Change | File |
| --- | --- |
| Profile, email, social links, education, experience | `lib/content.ts` |
| Project summaries, details, verified links, numbering, station positions | `lib/content.ts` |
| Colours, spacing, type sizes, responsive layout | `app/globals.css` |
| Homepage composition | `app/page.tsx` |
| Project template | `app/projects/[slug]/page.tsx` |
| Abstract project covers | `components/project-art.tsx` |
| Workshop shell, controls, project panels | `components/workshop/workshop.tsx` |
| Island dimensions, destinations, toy locations | `lib/workshop-world.ts` |
| Racing and bowling mechanics | `lib/coastal-games.ts`, `components/workshop/coastal-activities.tsx` |
| Ocean, track, ramps, scenery and night sky | `components/workshop/coastal-world.tsx` |
| Quick travel and island activity controls | `components/workshop/coastal-controls.tsx` |
| Signal Run checkpoints and controls | `lib/signal-run.ts`, `components/workshop/signal-run.tsx` |
| Ambient music and radio controls | `lib/workshop-audio.ts`, `components/workshop/music.tsx` |
| Project passport and browser-local stamps | `lib/project-passport.ts`, `components/workshop/passport.tsx` |
| Camera, lighting, demand rendering, rover update loop | `components/workshop/scene.tsx` |
| Procedural objects and architecture | `components/workshop/objects.tsx` |
| Kinematic movement, bounds, collisions | `lib/movement.ts` |
| Images and downloadable resume | `public/images/`, `public/sukhmeet-singh-resume.pdf` |

The Manrope variable font is self-hosted in `public/fonts/`, with its OFL licence. The code has small client boundaries for navigation, motion, contact feedback, and the workshop. GSAP controls DOM choreography. The scene is dynamically imported only by Explore; every Explore link disables speculative prefetch.

## Workshop controls and fallback

- The 64 × 50 island has exactly 10 times the previous 20 × 16 courtyard's area. The project court remains in its centre, with a west circuit, east bowling lane and coastal ramp, pier and lighthouse.
- Click or focus the scene, then use WASD or arrow keys, or hold the on-screen direction buttons. Hold Shift or toggle Boost to accelerate. Movement stays inside the shoreline and slides along obstacles.
- The camera follows the rover from the moment the workshop opens. Use the named quick-travel stops to visit a district; travel clears held input and active challenges. Island overview restores the wide view, and Follow rover returns to driving view. The mini-map tracks the rover across the entire island.
- Choose “Start a lap” for the coastal circuit. Drive through six golden gates in order and return to the finish line. Crossing the infield or leaving the asphalt invalidates the lap. Restart for another attempt; time pauses in hidden tabs.
- Drive into the bowling rack to knock down pins, with pin-to-pin impacts, a visible rover wobble and a live score. “Re-rack & drive” restores all ten pins and the approach position.
- Cross the curved orange ramp to lift the rover. Visit the ocean pier, click the water or choose “Make waves” to send out ripples.
- Click a numbered station, the station geometry, or a project in the HTML index. Approaching a station reveals a panel without navigating away or stealing driving focus.
- Reset the rover or camera, drag to orbit, and use the zoom buttons. On mobile, use the station buttons and camera controls.
- Choose “Start run” to play Signal Run: drive through five beacons in order, following the glowing marker and mini-map. Use WASD/arrows or hold the on-screen directional buttons. Restart, end or replay at any time.
- Collect a passport stamp by opening each project station or driving close to it. Repeat visits count once; all three complete the passport. Progress is stored in this browser and survives reloads and rover resets. When storage is unavailable, stamps remain usable in memory for the current page session.
- The original “Soft Circuit” ambient loop starts on entry when browser autoplay permits, otherwise on the first workshop click/tap or key interaction. The former volume slider is removed; playback is fixed at its 100% setting. Play/pause remains available, and a manual pause is respected during further exploration. Audio pauses in hidden tabs and closes when leaving the workshop. It is synthesized locally, with no audio download or service. Device/system volume remains under the visitor's control.
- Click the kinetic sculpture to spin it, launch the paper plane on a short circuit, or use the paint bay to cycle the rover through cobalt, sage and ink. The same actions are available in the “Off the clock” buttons, with spoken status feedback.
- “Night mode” darkens the workshop interface and island, adds a moon and stars, illuminates the circuit edges and lights the lighthouse beam. Leaving Explore restores the normal portfolio theme. Right-drag pans in overview mode.
- Escape closes the panel and restores focus, or releases the courtyard. Moving focus away clears held keys.
- Frames render on demand, with a 20 Hz wake-up for the animated ocean, and stop when the document is hidden. DPR is capped at 1.5; there is one 1024px shadow map and no post-processing or remote models.
- A WebGL failure or context loss switches to the static scene and the same HTML index. A no-JavaScript project list is included.
- Reduced-motion users get immediate DOM content, no parallax, immediate toy poses, a still ocean and static ripple feedback. Rover wobble is suppressed; driving, challenges and pin collision outcomes remain available.

`lib/workshop-world.ts` holds the map dimensions, toy positions and rover colours. `components/workshop/playground.tsx` contains the finite toy animations. To regenerate the hero/fallback artwork from the actual world, run `node scripts/capture-workshop.mjs` against the development server on port 3001, or set `PLAYWRIGHT_BASE_URL` to another running instance.

## Deploy on Vercel

1. Push this source to a repository you control, then import it in Vercel.
2. Choose the Next.js framework preset, repository root as the root directory, and `npm run build` as the build command. Use Node.js 24 or another supported current LTS version.
3. Add `NEXT_PUBLIC_SITE_URL` with your actual HTTPS origin (for example your assigned Vercel domain). Build-time metadata and the sitemap use this value. Without it, the sitemap intentionally contains no invented domain.
4. Deploy. Once a custom domain is configured, update this variable and redeploy.
5. Verify the resume download, all three direct project URLs, and `/explore` on the deployed domain.

There are no database, authentication, CMS, or third-party API secrets to configure. The Git handoff uses `codex/personal-workshop` in [Sukhmeet31/portfolio](https://github.com/Sukhmeet31/portfolio); hosting is configured separately.

## Content provenance and limits

Copy comes from the supplied resume and build brief, plus the public CodeMate-X and Event Services Marketplace READMEs. The two supplied live demos loaded on 11 November 2026. At the owner's request, their screenshots have been replaced by original abstract artwork; reference captures remain outside public assets in `docs/reference-captures/`. Their AI processing, authenticated flows, output accuracy, and impact metrics were not validated. No usage or performance claims from those landing pages are repeated in the portfolio copy.

- Legal Document Simplifier has no confirmed repository URL, so its source button is omitted.
- The marketplace README specifies Firebase Authentication and Firestore only; the resume lists Node.js. The public copy uses the repository's supported stack. No live marketplace URL was supplied.
- Experience dates use the resume. No date conflict with the brief was found. The original resume PDF is distributed unchanged; it retains the author's original claims.
- All three project covers are original abstract illustrations, labelled as such. The courtyard preview is a screenshot of this implementation.
- LinkedIn is the supplied profile URL. Public scraping restrictions may prevent an automated availability check.

See `docs/verification.md` for measured results, test coverage, and remaining limitations. The full user brief and implementation plan are in `docs/superpowers/`.
