# Findings & Discovery Evidence

## Display Architecture Findings
1. **WebKit 3D Rasterization:** Applying high-magnitude `translateZ` within a `perspective: 1600px` scene causes bitmap scaling blur on iOS Safari. Transitioning the 3D rig from `rotateX(54deg)` to `rotateX(0deg)` at native 1:1 pixel ratio eliminates blur and preserves crisp vector fonts.
2. **Mobile Screen Aspect Ratio:** Mobile viewports (~390×844) require portrait optimization. When `isDisplayZoomed` is active on mobile (`< 640px`), morphing the display container to `width: 100%`, `transform: none`, and `minHeight: 78vh` gives an immersive, native reading experience without popup blocks.
3. **Chassis Isolation:** Fading out the lower unibody chassis (`opacity: 0; translateY(120px)`) when zoomed on desktop, and setting `display: none` on mobile, ensures the user's attention is focused exclusively on the Liquid Retina display.
4. **Neon Glow Elimination:** Cleaned up all `.readme-glow`, `.readme-glow:hover`, and `@keyframes readme-glow-pulse` styles. Verified in Puppeteer DOM search: 0 glow elements found.
5. **Popup Modal Elimination:** Removed 225+ lines of `dossierModal` modal overlay. Verified in Puppeteer DOM search: 0 `[role="dialog"]` elements found on both desktop and mobile.
6. **Vercel SPA Compatibility:** Verified `vercel.json` SPA rewrite rule (`/(.*) -> /index.html`).

## Automated Puppeteer Verification Evidence
- **Desktop (1280x950):**
  - Neon glow elements: 0
  - Initial chassis opacity: 1.0 (Desk view)
  - Zoom click -> chassis opacity: 0.0 (Display-only view)
  - Top menu button: updates to "← Desk View"
  - Segmented tab navigation: switching between `ABOUT_ME.md` and `EXPERIENCE.md` confirmed
  - "Desk View" button click -> chassis opacity returns to 1.0
- **Mobile (390x844 iPhone):**
  - Initial desk view horizontal overflow: `scrollWidth: 390, clientWidth: 390` (0 overflow)
  - Zoom screen tap -> chassis display: `none`, modal count: 0 (0 popup blocks)
  - Zoomed display view horizontal overflow: `scrollWidth: 390, clientWidth: 390` (0 overflow)
  - Segmented tab switching: verified
  - Return to desk view: verified
