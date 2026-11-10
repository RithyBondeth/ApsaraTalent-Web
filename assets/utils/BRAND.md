# Apsara Talent logo

The approved identity is Option 1, the freestanding custom AT monogram with
the horizontal Apsara Talent wordmark. Keep the mark free of extra search,
briefcase, or crown details.

The SVG masters in this folder are the source artwork:

- `logo-at-light.svg`: blue symbol and navy wordmark for light backgrounds.
- `logo-at-dark.svg`: dark-theme primary blue and white wordmark.
- `logo-at-symbol.svg`: light-theme primary blue for compact placements.
- `logo-at-symbol-dark.svg`: dark-theme primary blue for compact placements.

The generator reads `--primary` from the light and dark themes in
`app/globals.css`. It applies those colours to the monogram without changing its
geometry. Flutter's `AppTokens` use the same HSL values. Regenerate after palette
changes so the exported images, launcher icons, splash artwork and web manifest
stay aligned. Launcher icons use the light primary blue on opaque white.

In-app PNGs have transparent backgrounds. Launcher and touch icons have opaque
white backgrounds. Android adaptive icons and web maskable icons include safe
padding; Android also has a monochrome themed icon.

From the web project, regenerate the web and Flutter assets together:

```sh
node scripts/generate-brand-assets.mjs --mobile-root ../ApsaraTalent-Mobile
```

This updates both apps' shared PNGs, Flutter aspect ratios, browser and launcher
icons, native splash artwork, and social share images. Rebuild each app to ship
asset changes. The shared `LogoComponent` and Flutter `AppLogo` select the right
wordmark for the active theme.
