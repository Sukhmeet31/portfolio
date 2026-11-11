Build a complete, polished portfolio website for Sukhmeet Singh, a 2026 B.Tech graduate interested in software development and AI evaluation.

Take ownership of the design and implementation. Make sensible decisions without asking me to choose routine details. Implement the application, run it, inspect it in a browser, fix problems, and deliver working code.

Follow the repository’s instructions and the environment’s permission requirements. Preserve unrelated existing work. If the workspace is empty, initialise the project. If it already contains a suitable application, adapt it.

## 1. Creative direction

My two main references are:

- https://dennissnellenberg.com/
- https://bruno-simon.com/

I like Dennis’s oversized typography, confident layout, restrained colours, spacious project presentation, and fluid motion. I like Bruno’s sense of discovery and the fact that his portfolio is an interactive experience.

I explicitly do not want the Brittany Chiang style: a fixed text sidebar beside a dense résumé-like column.

Create an original design inspired by the qualities above. Do not reproduce either reference’s identity, portrait, assets, exact layouts, or recognisable 3D world.

If browsing is available, inspect the current reference websites before implementing. If they are inaccessible, proceed using this brief and report that limitation accurately.

### Chosen concept: a personal project workshop

Build one coherent portfolio with two complementary views:

1. A visually striking scrolling website that introduces me and presents my work.
2. An explorable 3D workshop at `/explore`, where visitors discover the same projects through interactive stations.

Both views must share the same colours, typography, project names, numbering, and content.

The 3D experience is a required deliverable. Entering it is optional for visitors. All important information must also be available through ordinary HTML navigation.

## 2. Technology and architecture

Use:

- Next.js with App Router.
- TypeScript.
- Tailwind CSS.
- GSAP with `@gsap/react` for coordinated DOM and scroll animations.
- Three.js with `@react-three/fiber` and selected `@react-three/drei` helpers for the 3D workshop.
- A small, consistent icon set where useful.

Use current stable, compatible releases. Check React and React Three Fiber compatibility before installing. Avoid experimental rendering technologies and prerelease dependencies.

Use one principal DOM animation system. CSS transitions are sufficient for simple button and colour effects.

Keep the architecture understandable:

- Server Components for mostly static content.
- Small Client Components for interactive UI.
- A dedicated client boundary for the 3D experience.
- Dynamically load the 3D module when the visitor enters Explore.
- Keep Three.js and the interactive scene outside the initial homepage JavaScript bundle.
- Store profile, experience, links, and project information in one typed content source.
- Generate project pages and workshop stations from the same project data.
- Respect an existing package manager and lockfile.

Suggested routes:

- `/` — main portfolio.
- `/projects/[slug]` — individual project pages.
- `/explore` — interactive workshop.
- A deliberate not-found page.

No database, authentication, CMS, or separate backend is needed for this scope.

## 3. Visual design

Use this as the starting design system:

- Warm off-white: `#EEEDE8`.
- Near-black: `#151515`.
- Cobalt accent: `#4355F9`.
- Readable secondary text: approximately `#62625D`.
- Manrope for primary typography, with an appropriate system fallback.
- A restrained monospace face for small project numbers and technical labels.

Use `next/font` or locally hosted font assets where practical. Keep font usage limited.

The site should have:

- Very large, carefully composed typography.
- Generous spacing.
- Strong alignment and deliberate asymmetry.
- Large project imagery.
- Fine separators and restrained labels.
- A limited number of well-designed interactions.
- Light and dark sections where they improve the composition.

Build one excellent colour treatment first. A theme switch is unnecessary.

Avoid generic startup landing-page styling, repetitive small cards, excessive gradients, and decorative effects that obscure the work.

### Main-page composition

#### Header

Include:

- A simple “Sukhmeet Singh” wordmark.
- Work.
- Explore.
- About.
- Contact.
- A résumé link only when a real résumé file is available.

Ensure the header stays readable against each background. Build an accessible mobile menu.

#### Hero

Make the opening screen visually memorable.

Use “SUKHMEET SINGH” as the dominant typographic element. Compose the name deliberately across one or two lines depending on screen size.

Supporting text:

“Software, systems & AI evaluation.”

Include a concise identity line:

“B.Tech graduate · Delhi, India”

Main actions:

- View my work.
- Enter the workshop.

Integrate a striking visual preview of the workshop into the composition. Prefer a still rendered from the actual implemented scene, with restrained CSS or GSAP movement around it.

The initial hero must look complete before the 3D code loads. Do not depend on WebGL to display my name, navigation, or introduction.

No portrait has been supplied. Use original geometric artwork and the workshop visual instead of inventing a photograph of me.

#### Selected work

Present the strongest projects as large editorial entries, numbered 01, 02, and 03 where appropriate.

Each entry should include:

- A substantial image or designed cover.
- Project name.
- A concise description.
- Project type or focus.
- A small set of relevant technologies when supported.
- A clear action to view the project page.

Use spacing, scale, and composition to make the section distinctive.

Desktop hover interactions may reveal or move a preview slightly. Mobile users must see the useful content without hovering.

#### Experience and AI evaluation

Give my evaluation experience a clear, readable section.

Explain the nature of the work in plain language: designing tasks, defining success criteria, checking sources, assessing outputs, and examining model failures where supported by my materials.

Use a compact timeline or a few structured entries. Keep the writing specific and avoid inflated titles.

#### About and areas of focus

Include a short personal introduction and education.

Present areas of focus through examples of work. Do not invent proficiency percentages or portray every résumé keyword as expertise.

The technologies used to build this portfolio can appear in a small “Built with” note. That does not imply years of professional experience with them.

#### Contact and footer

End with a strong typographic contact section.

Include:

- Email action.
- Copy-email control with real success feedback.
- GitHub.
- LinkedIn.
- A simple return-to-top action if useful.

Use working links. A contact form is unnecessary for the first version.

## 4. Required 3D workshop

Create a compact, original 3D courtyard or studio that feels intentionally designed.

Use:

- Warm architectural surfaces.
- Cobalt accents.
- Soft, economical lighting.
- A few recognisable sculptural objects.
- Clear project stations.
- A small original wheeled rover that visitors can control.

Do not copy Bruno’s car, world layout, orange identity, or decorative objects.

### Project stations

Create a distinct station for each supported featured project.

Possible visual interpretations:

- Legal Document Simplifier: layered document slabs or a small document-processing apparatus.
- CodeMate-X: a sculptural coding terminal or monitor.
- Event Services Marketplace: a small arrangement suggesting an event space or service stalls.

Use simple procedural geometry where possible. Make the objects coherent with the same visual world.

Each station must connect to a real project entry in the shared content data. If fewer projects are supported by the available material, create fewer stations.

### Interaction

On desktop:

- Allow arrow keys or WASD to move the rover while the scene is focused.
- Use bounded, frame-rate-independent movement.
- Provide simple collision boundaries.
- Use an isometric or gently following camera.
- Show concise instructions.
- Provide a reset-position control.

A physics engine is unnecessary. Implement predictable kinematic movement.

Visitors must also be able to select stations directly.

Approaching or selecting a station should reveal an HTML project panel containing:

- Project name.
- Short description.
- “Read case study” action.

Do not automatically navigate away when the rover touches a station.

### Accessible navigation

Always show an ordinary HTML list of project shortcuts alongside the scene.

Provide:

- A clearly visible exit back to the portfolio.
- Keyboard-accessible station selection.
- Proper focus handling for project panels.
- Escape to dismiss a panel or leave the interactive mode where appropriate.
- Clear button labels.

Only capture movement keys when the workshop is active and focused. Do not interfere with normal page navigation or text inputs.

### Mobile

Use direct tap-to-select stations and simple camera controls.

A mobile virtual joystick is not required. Keep the world enjoyable without making precise steering necessary.

Include visible project shortcuts and an obvious exit on small screens.

### Rendering and fallback behaviour

- Keep geometry and material counts modest.
- Reuse resources where appropriate.
- Cap device pixel ratio.
- Use economical shadows.
- Avoid expensive post-processing and large remote assets.
- Pause rendering when the tab is hidden.
- Render on demand when the scene is idle where practical.
- Clean up scene resources, event listeners, and animation callbacks.
- Handle WebGL errors or context loss gracefully.

If WebGL is unavailable, show a designed static workshop preview and the same accessible project list. The visitor must still be able to use the site.

No autoplay sound, mandatory fullscreen, pointer lock, long introduction sequence, or required game objectives.

## 5. Profile and content

Use these supplied details:

- Name: Sukhmeet Singh.
- Location: Delhi, India.
- Degree: B.Tech in Information Technology.
- Institution: Guru Tegh Bahadur Institute of Technology.
- Graduation year: 2026.
- Email: 31sukhmeet@gmail.com.
- GitHub: https://github.com/Sukhmeet31
- LinkedIn: https://www.linkedin.com/in/sukhmeet-singh-060399227/

My résumé describes AI evaluation contract work with Handshake AI, a virtual frontend internship through IBM SkillsBuild, and involvement in a student technical society.

Use the supplied résumé and available project material to write concise, conservative descriptions.

Important: do not assume I have mastered every technology in the résumé. Do not invent expertise, employment dates, client relationships, awards, testimonials, user counts, benchmark results, or impact metrics.

If dates conflict across supplied materials, leave them out of public copy and note the discrepancy in the handoff.

### Candidate projects

**Legal Document Simplifier**

- Listed demo: https://legal-simplifier-rho.vercel.app/
- General subject: an AI-assisted document analysis and simplification project.
- No exact repository URL has been confirmed in this brief.

**CodeMate-X**

- Listed demo: https://code-mate-x.vercel.app/
- Repository: https://github.com/Sukhmeet31/CodeMate-x
- General subject: a coding interface with an editor and AI assistance.

**Event Services Marketplace**

- Repository: https://github.com/Sukhmeet31/Event_Services_Marketplace
- General subject: connecting event-service providers and customers.

Treat these as candidate entries from supplied material.

Check public links when network access permits. Do not infer that every described feature works merely because a homepage loads.

Do not invent a repository URL or use my GitHub profile as though it were a project repository.

Where implementation details or personal contributions are uncertain, use a modest overview and omit unsupported claims. Keep questions and editing notes in the content source or README rather than showing unfinished editorial notes to visitors.

### Project imagery

Use real screenshots from supplied assets or accessible live projects when available.

Otherwise, create attractive abstract covers representing the project’s subject. These should read as illustrations, not fabricated product screenshots or invented analytics.

### Résumé

If a résumé PDF is present, use it for the résumé link and give the downloadable file a clean filename.

If no file is available, omit that control and record the missing asset in the handoff. Do not create a broken download link.

## 6. Project-detail pages

Each project should have a directly accessible URL and a consistent, well-designed layout.

Include the supported parts of:

- Project title and short overview.
- A large visual.
- The problem or intended workflow.
- My actual role and contribution.
- Relevant implementation details.
- A meaningful decision or challenge.
- Validation or results where evidence exists.
- Limitations or next steps where known.
- Verified demo and source links.
- Navigation back to selected work.

Do not pad pages with generic explanations or invented engineering decisions.

Write natural, specific English. Keep the tone appropriate for a graduate building a professional portfolio.

## 7. Motion, accessibility, and performance

Use GSAP for purposeful choreography:

- A restrained hero entrance.
- Section reveals.
- Selected project transitions.
- Clear menu opening and closing.
- Small magnetic effects on suitable desktop controls, if they improve the result.

Use `useGSAP` with scoped selectors and proper cleanup. Avoid duplicate listeners and animation conflicts.

Keep native scrolling. Avoid scroll hijacking.

Respect `prefers-reduced-motion`:

- Remove parallax and continuous decorative motion.
- Show content immediately.
- Use simple transitions or immediate state changes.
- Offer a calm workshop experience.

Essential content must remain visible if an animation fails.

Use semantic HTML, visible keyboard focus, meaningful link labels, appropriate contrast, and usable touch targets.

Ensure decorative typography and artwork never obscure navigation or content.

Optimise images and reserve their dimensions. Add useful page titles, descriptions, a favicon, social-sharing metadata, and a sitemap.

Measure the main portfolio separately from the opted-in 3D route. Report actual measurements and limitations; do not claim performance scores that were not measured.

## 8. Implementation workflow

Work through the complete build:

1. Inspect the workspace and supplied assets.
2. Check dependency compatibility and relevant official documentation.
3. Establish the content source and design tokens.
4. Build the complete responsive homepage and project pages.
5. Build the functioning 3D workshop.
6. Connect both views to the same content.
7. Create the final workshop preview artwork from the implemented scene where feasible.
8. Refine composition, motion, and responsive behaviour.
9. Run checks and inspect the finished application in a browser.
10. Fix material defects before handing it over.

Do not stop after scaffolding, writing a plan, or completing only the homepage. Both the main portfolio and the functioning workshop are required.

Keep the code reasonably organised. Avoid placing the entire application in a single large component.

## 9. Verification and acceptance criteria

Run the project’s linting, TypeScript checks, and production build.

Use meaningful browser checks for the important user journeys:

- Open the homepage and navigate to selected work.
- Open each project page directly.
- Enter and exit the workshop.
- Select projects through both the scene and HTML controls.
- Move and reset the rover.
- Use the site with a keyboard.
- Use the mobile menu.
- Copy the email address.
- Verify résumé and external links where available.
- Check reduced-motion behaviour.
- Check the WebGL fallback.

Inspect screenshots at approximately:

- 390px wide.
- 768px wide.
- 1440px wide.

Check for clipped headings, accidental horizontal overflow, overlapping controls, unreadable labels, broken images, and layout shifts.

Add a small number of automated smoke tests for critical navigation and interaction where the environment supports them. Avoid a large test suite that merely repeats the component implementation.

If browser tooling or network access is unavailable, state exactly what could not be checked. Do not describe unperformed checks as passing.

### The result is ready when:

- The opening screen has a deliberate, distinctive visual identity.
- The main page clearly communicates who I am and what I have worked on.
- Project pages are useful and truthful.
- The 3D workshop is functional and connected to those projects.
- Mobile and keyboard navigation work.
- The fallback experience is usable.
- No visible control is a placeholder.
- The production build succeeds.
- There are no known material layout or runtime errors.

## 10. Handoff

Deliver:

- Complete source code and a lockfile.
- A concise README with setup, development, build, and deployment instructions.
- A clear explanation of where to edit profile information, projects, links, colours, and assets.
- Screenshots of the finished homepage and workshop when browser tooling is available.
- A short account of what was implemented and verified.
- Any remaining content uncertainties or missing assets.
- Vercel deployment instructions.

Build something visually ambitious, coherent, and maintainable. The typography, project presentation, motion, and 3D world should feel like parts of the same personal website.