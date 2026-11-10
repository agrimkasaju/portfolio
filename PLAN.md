# Implementation Plan: Direct Laptop Display Camera Zoom & Neon Glow Removal

> [!IMPORTANT]
> **Long-Running Task Declaration:** This document represents the implementation plan for a long-running task. Execution mode (`/goal`) must treat this task as long-running and maintain durable task markdown artifacts—specifically `PLAN.md`, `STATE.md`, `FINDINGS.md`, and `LEDGER.md` (or equivalent task records) to track objectives, execution epochs, runtime state transitions, discovery evidence, and completion verification.

---

## 1. Executive Summary & Problem Formulation

### User Requirements
1. **Hosting Platform Migration:** Switched from Netlify to **Vercel** (`vercel.json` zero-config Vite/React deployment).
2. **Aesthetic Refinement:** Remove all artificial neon glows (`.readme-glow`, cyan/emerald pulsing borders).
3. **Display-Only Camera Zoom:**
   - Instead of a secondary modal popup sheet (`dossierModal`) on mobile or desktop, implement an **in-place camera zoom directly onto the laptop display**.
   - When zoomed, the camera frames **only the Liquid Retina display itself** (hiding the keyboard chassis, desk tilt, and surrounding elements).
   - The user reads the markdown files (`ABOUT_ME.md` and `EXPERIENCE.md`) directly on the laptop screen with crisp typography and natural scrolling.
   - Provides an intuitive zoom-out control (`← Back to Desk` / `Zoom Out ⤡` / `Esc` key) to transition seamlessly back to the 3D isometric desk perspective.

---

## 2. Architectural Analysis (Synthesized by Gemini 4 Argon)

### The Mobile 3D Scaling Dilemma vs. Solution
In [`src/MacbookShowcase.jsx`](file:///home/grim/Downloads/portfolio/src/MacbookShowcase.jsx), the MacBook is rendered at `800px × 500px` within a CSS 3D perspective rig (`rotateX(54deg)` on base, `rotateX(-108deg)` on lid). On mobile phones (~390px viewport width), the rig was scaled down via `scale(0.42)`, reducing 11px font sizes to an unreadable ~4.6px.

#### Evaluated Architectural Options:
- **Option A: Pure 3D `translateZ()` Fly-In:**
  - *Pitfall:* WebKit (iOS Safari) rasterizes 3D transformed elements onto a fixed texture bitmap before perspective scaling. Zooming via 3D `translateZ` causes blurry, pixelated text and breaks momentum touch scrolling inside overflow containers.
- **Option B: Responsive Display-Lock Camera Zoom (Selected 🏆):**
  - When `isDisplayZoomed === true`:
    1. **Fade Lower Unibody:** The keyboard base chassis smoothly drops away (`opacity: 0`, `translateY(60px)`, `pointer-events: none`).
    2. **3D Tilt Normalization:** The 3D rig smoothly un-tilts from `rotateX(54deg)` to `rotateX(0deg)` and lid normalizes to `rotateX(0deg)` using `cubic-bezier(0.16, 1, 0.3, 1)`.
    3. **Viewport Dimension Morphing:**
       - **On Mobile (`< 640px`):** The display frame morphs from the fixed 800×500 canvas to a portrait-responsive Liquid Retina display (`width: 100%`, `minHeight: 78vh`). Because it rests flat at `rotateX(0deg)` with native device pixel ratio, text renders with 100% vector clarity and full native touch scrolling.
       - **On Desktop (`>= 640px`):** The 800×500 display centers smoothly in the viewport with a gentle push-in (`scale(1.15)`), maximizing the active window for comfortable reading.
    4. **Unified In-Display Reading:** All markdown dossier content is rendered directly inside the display window. The duplicate ~210-line modal popup code (`dossierModal`) is completely deleted.

---

## 3. Detailed Implementation Steps

### Phase 1: Clean Up Neon Glow & Outdated Modal CSS
- **Target File:** [`src/App.css`](file:///home/grim/Downloads/portfolio/src/App.css)
- **Actions:**
  1. Delete `.readme-glow`, `.readme-glow:hover`, and `@keyframes readme-glow-pulse`.
  2. Delete `@keyframes modal-spring-in` and `.animate-modal-spring` (modal is replaced by camera zoom).
  3. Add display camera zoom transition utility:
     ```css
     .display-zoom-transition {
       transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                   opacity 0.5s ease-out,
                   width 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                   height 0.65s cubic-bezier(0.16, 1, 0.3, 1);
       will-change: transform, opacity;
     }
     ```

---

### Phase 2: Refactor State Machine & Camera Controls
- **Target File:** [`src/MacbookShowcase.jsx`](file:///home/grim/Downloads/portfolio/src/MacbookShowcase.jsx)
- **Actions:**
  1. Remove `dossierModal` and `setDossierModal` state.
  2. Introduce zoom state:
     ```javascript
     const [isDisplayZoomed, setIsDisplayZoomed] = useState(false)
     ```
  3. Create Zoom Handlers:
     - `enterDisplayZoom(windowKey)`: Sets `isDisplayZoomed(true)`, focuses `activeWindow(windowKey)`, and maximizes the window for in-display reading.
     - `exitDisplayZoom()`: Restores `isDisplayZoomed(false)` and returns the windows to their cascading desk layout.
  4. Attach keyboard listener: Pressing `Escape` triggers `exitDisplayZoom()`.

---

### Phase 3: Display-Only Camera Rig & Window Layout
- **Target File:** [`src/MacbookShowcase.jsx`](file:///home/grim/Downloads/portfolio/src/MacbookShowcase.jsx)
- **Actions:**
  1. **Keyboard Base:** Add conditional styles when `isDisplayZoomed`:
     ```javascript
     opacity: isDisplayZoomed ? 0 : 1,
     transform: isDisplayZoomed ? 'translateY(60px)' : 'translateY(0)',
     pointerEvents: isDisplayZoomed ? 'none' : 'auto',
     transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
     ```
  2. **Laptop Rig & Lid:**
     - Rig tilt: `transform: isDisplayZoomed ? 'rotateX(0deg)' : 'rotateX(54deg)'`
     - Rig margin: `marginTop: isDisplayZoomed ? '20px' : '360px'`
     - Lid angle: `transform: isDisplayZoomed ? 'rotateX(0deg)' : rotateX(${isOpen ? -108 : 0}deg)`
  3. **Display Frame on Mobile:**
     - When `isDisplayZoomed && isMobile`: Frame expands to `width: 100%`, `minHeight: 75vh` for zero-scroll-block reading.
  4. **Window Styling:**
     - Remove `readme-glow` and neon borders. Use clean Apple dark-mode borders (`border-white/10 dark:border-zinc-700/80`).
     - Remove the pulsing cyan `"Click to read ↗"` chip.
     - In the macOS top menu bar / window header, add a clean pill:
       ```jsx
       {isDisplayZoomed ? (
         <button onClick={exitDisplayZoom} className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors">
           <span>← Desk View</span>
         </button>
       ) : (
         <button onClick={() => enterDisplayZoom('about')} className="px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-800/60 transition-colors">
           <span>Zoom Screen ⤢</span>
         </button>
       )}
       ```
  5. **Delete Modal Code:** Delete lines 1170–1240 containing the `{dossierModal && ...}` popup block.

---

### Phase 4: Vercel Configuration & Build Verification
- **Target Files:** [`vercel.json`](file:///home/grim/Downloads/portfolio/vercel.json), [`package.json`](file:///home/grim/Downloads/portfolio/package.json)
- **Actions:**
  1. Add/Verify `vercel.json` to ensure clean client-side SPA rewrites:
     ```json
     {
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
  2. Verify production build: `npm run build`.
  3. Verify with Puppeteer across desktop and mobile (iPhone 12 / 390px):
     - Initial view: 3D laptop sitting on desk with zero neon glow.
     - Click/tap display: Smooth camera zoom into display; base drops away; markdown text fills view with zero popup.
     - Click `← Desk View`: Smooth camera zoom-out back to 3D laptop.

---

## 4. Acceptance & Verification Criteria

| Feature | Acceptance Criteria |
| :--- | :--- |
| **Neon Glow** | 0 neon glow classes or pulsing box-shadow keyframes in CSS or JSX. |
| **Modal Popup** | 0 modal overlays; clicking windows never mounts `dossierModal`. |
| **Camera Zoom** | Tapping/clicking the display smoothly zooms into the Liquid Retina screen, hiding the keyboard chassis. |
| **Mobile Readability** | On mobile (390px), text inside the zoomed display is 100% vector-sharp, filling the mobile viewport naturally with native vertical scrolling. |
| **Zoom-Out Control** | Accessible `← Desk View` button and `Escape` key reliably restore the 3D desk view. |
| **Build & Deploy** | `npm run build` succeeds with 0 errors; Vercel routing configuration verified. |
