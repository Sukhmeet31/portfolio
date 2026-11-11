# Follow the car and prepare the Git handoff

The user requested that the screen move with the car, asked for next-upgrade ideas, and authorized a Git push.

The existing follow camera already translates the camera and orbit target with the rover each frame. Enable it by default so visitors enter driving view immediately. Keep Island overview as an explicit wide view and Follow rover as the way back. Quick travel continues to follow automatically. Capture scripts explicitly select overview when creating island artwork.

This is a small behavior change within the existing stack. Updated mobile camera coverage must fail against the old default, then pass with follow enabled, including switching to overview and back. Build and run the existing checks before pushing.

The connected GitHub account owns Sukhmeet31/portfolio, which contains an older static portfolio. Preserve that history and push the complete current project on codex/personal-workshop. No default-branch merge or hosting deployment was requested.

## Next-upgrade ideas (proposals, not implemented)

1. **Ghost laps and personal bests:** save the best clean lap in this browser, show a translucent replay car, and award bronze/silver/gold lap medals. Strongest next addition because the race is already playable and needs a reason to return.
2. **Treasure hunt and rover garage:** hide clues around the island; project stamps and discoveries unlock paint, wheels and headlights. Tie rewards to exploring the portfolio.
3. **Ferry and secret cove:** drive onto a ferry to reach a smaller island with a bottle-message puzzle and a hidden project story. Gives the ocean a purpose beyond scenery.
4. **One-minute project tour:** a guide visits all three stations with short project highlights, then offers the resume/contact links. Helps visitors who want a quick professional overview.

## Verification

The updated mobile assertion failed against the old overview default, then passed with follow enabled. The test also verifies that a fixed landmark moves on screen during rover movement. Lint, types, production build, 14 unit tests and 38 browser tests pass. Refreshed the in-app preview and verified driving with follow active. Added Git attributes to preserve the original PDF and binary assets in clones; staged PDF bytes match the working file. No new dependencies or gameplay features were added in this camera change.
