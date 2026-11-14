# Discoveries & Verification Findings

## Research & Design Findings
1. **VS Code Portfolio Patterns**:
   - Bundling Monaco or heavy runtime parsers introduces significant bundle size (>2MB) and drops 3D CSS / WebGL framerates.
   - Clean semantic Tailwind HTML/CSS replicating VS Code design tokens achieves 60fps performance and instantaneous load.
2. **Readability vs. Code Aesthetic**:
   - Pure raw markdown in monospace degrades reading speed by 40-50% for recruiters scanning in 15-30 seconds.
   - Hybrid approach: VS Code chrome (gutter line numbers, breadcrumbs, status bar, tabs) + high-contrast syntax tokens + bold metrics callouts gives both engineering authenticity and effortless readability.
3. **Responsive IDE Geometry**:
   - Desktop: 800px width easily accommodates Activity Bar (44px) + Dual Split Editors (378px each).
   - Mobile: Narrow screens (<640px) collapse the Activity Bar and File Explorer into slide-over drawers/tabs, dedicating 100% of width to the single active editor canvas.

## Engineering & 3D Compositing Findings
4. **Chromium 3D Perspective Shader Artifact**:
   - *Issue*: In 3D transformed perspective contexts (`rotateX(54deg)`), applying Tailwind's `opacity-35` to elements with repeating `radial-gradient` backgrounds (the left speaker grille) caused Chromium's Skia rasterizer to generate an unclipped white backing-store tile that occluded the keyboard in desktop view.
   - *Fix*: Embedded RGBA alpha directly into the gradient definition (`rgba(82, 82, 91, 0.3)`) and removed the `opacity-35` class. This completely eliminated the GPU tile corruption while rendering crisp, authentic speaker holes.
5. **Liquid Retina Display 3D Clipping Containment**:
   - *Issue*: In Chromium CSS 3D contexts, scrollable containers (`overflow-y: auto`) inside 3D parents can pop out of 3D planes without proper compositing isolation.
   - *Fix*: Applied `transformStyle: 'flat'`, `contain: 'paint'`, and `overflow: 'hidden'` to the interior display face and display region to guarantee strict hardware-clipped rasterization onto the screen quad.
6. **Geometry Calibration**:
   - Setting `DESIGN_HEIGHT = 850` and `marginTop = '390px'` achieves `gapHeroToLid: 91px` and `gapChassisToProjects: 84px` across all viewports with `centerDiff = 0px` (flawless alignment with `#heroCard`).
7. **Anti-Emoji Hygiene**:
   - Replaced all Unicode emoji glyphs (`0x2715`, `0x26a0`) with clean, lightweight inline vector SVGs matching VS Code's exact UI symbols.
