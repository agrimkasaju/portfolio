import React, { useState, useEffect, useRef } from 'react'
import { VSCodeWorkspace } from './VSCodeWorkspace'

const getInitialTimezoneCity = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (tz.includes('Toronto') || tz.includes('Montreal')) return 'Ottawa, ON'
    if (tz.includes('Edmonton') || tz.includes('Calgary')) return 'Calgary, AB'
    if (tz.includes('Vancouver')) return 'Vancouver, BC'
    if (tz.includes('New_York')) return 'New York, NY'
    if (tz.includes('Los_Angeles')) return 'Los Angeles, CA'
    if (tz.includes('Chicago')) return 'Chicago, IL'
    if (tz.includes('London')) return 'London, UK'
    const parts = tz.split('/')
    if (parts.length > 1) {
      return parts[1].replace(/_/g, ' ')
    }
  } catch (e) {
    // fallback
  }
  return 'Ottawa, ON'
}

export const MacbookShowcase = ({
  isDark = false,
  toggleTheme = () => {},
  activeThemeId = 'default',
  resetTheme = () => {},
  currentTheme = { name: 'Minimal Slate', id: 'default' }
}) => {
  // Apple-style one-time slow opening animation state
  const [isLidOpen, setIsLidOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.innerWidth < 640) return true
      return typeof window !== 'undefined' && window.location.search.includes('opened=true')
    } catch {
      return false
    }
  })
  const [hasAutoOpened, setHasAutoOpened] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.innerWidth < 640) return true
      return typeof window !== 'undefined' && window.location.search.includes('opened=true')
    } catch {
      return false
    }
  })
  const sectionRef = useRef(null)

  // In-place display camera zoom state: starts zoomed in automatically on mobile
  const [isDisplayZoomed, setIsDisplayZoomed] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth < 640
    } catch {
      return false
    }
  })
  const [isMobile, setIsMobile] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth < 640
    } catch {
      return false
    }
  })

  // Responsive scale state for mobile fitting
  const containerRef = useRef(null)
  const hasInitializedZoomRef = useRef(false)
  const [scale, setScale] = useState(1)
  const DESIGN_WIDTH = 800
  const DESIGN_HEIGHT = 850

  useEffect(() => {
    if (!containerRef.current) return
    let rafId = null
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        const mobile = width < 640
        setIsMobile(mobile)
        if (!hasInitializedZoomRef.current) {
          hasInitializedZoomRef.current = true
          if (mobile) {
            setIsDisplayZoomed(true)
            setIsLidOpen(true)
            setHasAutoOpened(true)
          }
        }
        const nextScale = width > 0 && width < DESIGN_WIDTH ? Math.min(1, (width - (mobile ? 12 : 0)) / DESIGN_WIDTH) : 1
        setScale((prev) => (Math.abs(prev - nextScale) > 0.005 ? nextScale : prev))
      }
    }
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateScale)
    }
    updateScale()
    const ro = new ResizeObserver(onResize)
    ro.observe(containerRef.current)
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Escape key listener to exit display zoom back to 3D desk view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDisplayZoomed(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Enter display-only camera zoom
  const enterDisplayZoom = (targetWindow = 'about', e) => {
    if (e) e.stopPropagation()
    setIsDisplayZoomed(true)
  }

  // Exit display-only camera zoom back to 3D desk view
  const exitDisplayZoom = (e) => {
    if (e) e.stopPropagation()
    setIsDisplayZoomed(false)
  }

  // Real-time location state automatically synchronized from timezone
  const [userLocation, setUserLocation] = useState(getInitialTimezoneCity)

  // Automatically sync location seamlessly in the background without prompting the user
  useEffect(() => {
    let isMounted = true
    const autoSyncLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) })
        if (res.ok) {
          const data = await res.json()
          if (data && data.city && isMounted) {
            const region = data.region_code || data.region || data.country_code
            setUserLocation(region ? `${data.city}, ${region}` : data.city)
          }
        }
      } catch (e) {
        // Silently retains the timezone city initialized above
      }
    }
    autoSyncLocation()
    return () => {
      isMounted = false
    }
  }, [])

  // One-time slow, cinematic opening animation on initial page load / scroll into view
  useEffect(() => {
    if (hasAutoOpened) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasAutoOpened) {
          setHasAutoOpened(true)
          const openTimer = setTimeout(() => {
            setIsLidOpen(true)
          }, 900)

          return () => clearTimeout(openTimer)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasAutoOpened])

  return (
    <section ref={sectionRef} className="reveal mb-16 sm:mb-20 overflow-visible pt-1 sm:pt-3">
      {/* Spacious Bounding Box - Scales proportionally on mobile or expands to 100% in display-zoom mode */}
      <div
        ref={containerRef}
        className="relative w-full py-1 sm:py-4 px-0 sm:px-4 overflow-visible flex flex-col items-center justify-start transition-[transform,margin-top] duration-500"
        style={{
          height: isDisplayZoomed
            ? isMobile
              ? '580px'
              : '540px'
            : scale < 1
            ? `${Math.round(DESIGN_HEIGHT * scale)}px`
            : `${DESIGN_HEIGHT}px`,
          minHeight: isDisplayZoomed
            ? isMobile
              ? '580px'
              : '540px'
            : scale < 1
            ? `${Math.round(DESIGN_HEIGHT * scale)}px`
            : `${DESIGN_HEIGHT}px`
        }}
      >
        <div
          style={{
            width: isDisplayZoomed
              ? isMobile
                ? '100%'
                : '800px'
              : scale < 1
              ? `${DESIGN_WIDTH}px`
              : '100%',
            maxWidth: isDisplayZoomed
              ? isMobile
                ? '100%'
                : '800px'
              : `${DESIGN_WIDTH}px`,
            transform: isDisplayZoomed ? 'none' : scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            flexShrink: 0,
            transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* --- APPLE MACBOOK 3D HERO SHOWCASE (Unified Perspective Rig) --- */}
          <div
            className={`relative w-full select-none overflow-visible flex justify-center ${
              isDisplayZoomed ? 'items-start' : 'items-center'
            }`}
            style={{
              perspective: isDisplayZoomed ? 'none' : '1600px',
              perspectiveOrigin: '50% 25%',
              minHeight: isDisplayZoomed
                ? isMobile
                  ? '560px'
                  : '520px'
                : `${DESIGN_HEIGHT}px`
            }}
          >
            {/* Soft Ambient Workspace Glow behind Laptop */}
            <div
              aria-hidden="true"
              className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[88%] max-w-2xl h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 z-0 ${
                isDisplayZoomed ? 'opacity-20' : 'opacity-100'
              }`}
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.12) 0%, rgba(96, 165, 250, 0.04) 45%, transparent 70%)'
                  : 'radial-gradient(ellipse at center, rgba(148, 163, 184, 0.15) 0%, rgba(203, 213, 225, 0.05) 45%, transparent 70%)'
              }}
            />

            {/* THE LAPTOP RIG (800px x 500px, 3D Tilted Desk Angle at 54deg or Orthogonal Flat Zoom) */}
            <div
              className="relative display-zoom-rig"
              style={{
                width: isDisplayZoomed && isMobile ? '100%' : '800px',
                maxWidth: '100%',
                height: isDisplayZoomed
                  ? isMobile
                    ? '560px'
                    : '500px'
                  : '500px',
                transformStyle: isDisplayZoomed ? 'flat' : 'preserve-3d',
                transform: isDisplayZoomed
                  ? 'none'
                  : 'rotateX(54deg)',
                marginTop: isDisplayZoomed
                  ? isMobile
                    ? '0px'
                    : '10px'
                  : '390px',
                flexShrink: 0,
                transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), margin-top 800ms cubic-bezier(0.16, 1, 0.3, 1), width 500ms ease'
              }}
            >
              {/* --- 1. LOWER UNIBODY BASE CHASSIS (Fades away in display-only zoom mode) --- */}
              <div
                className="absolute inset-0 rounded-[20px] flex flex-col justify-between display-zoom-chassis"
                style={{
                  background: isDark
                    ? 'linear-gradient(180deg, #1a1d26 0%, #12141a 45%, #0b0d11 100%)'
                    : 'linear-gradient(180deg, #2b303d 0%, #1e222b 45%, #12141a 100%)',
                  border: isDark ? '2px solid #2d3345' : '2px solid #3c455c',
                  padding: '16px 24px 20px 24px',
                  boxShadow: isDark
                    ? '0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 12px 24px -6px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.18)'
                    : '0 20px 45px -12px rgba(15, 23, 42, 0.22), 0 8px 18px -6px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                  opacity: isDisplayZoomed ? 0 : 1,
                  transform: isDisplayZoomed ? 'translateY(120px)' : 'translateY(0)',
                  pointerEvents: isDisplayZoomed ? 'none' : 'auto',
                  display: isDisplayZoomed ? 'none' : 'flex'
                }}
              >
                {/* Upper Deck Surface: Speaker Grilles + Recessed Keyboard Well */}
                <div className="flex items-center justify-between gap-4 mt-1.5">
                  {/* Left Speaker Grille */}
                  <div
                    className="w-12 h-52 rounded shrink-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(82, 82, 91, 0.3) 1px, transparent 1px)',
                      backgroundSize: '3px 3px'
                    }}
                  />

                  {/* Recessed Anodized Aluminum Keyboard Well */}
                  <div className="flex-1 h-52 bg-[#08090c] border border-zinc-800/90 rounded-xl p-2 shadow-inner flex flex-col justify-between select-none">
                    {/* Function Keys Row */}
                    <div className="flex gap-1 h-5">
                      <div className="w-8 bg-zinc-900 border border-zinc-800 rounded-[3px] text-[7px] text-zinc-500 flex items-center justify-center font-mono">esc</div>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      ))}
                      <div className="w-8 bg-zinc-950 border border-zinc-700/80 rounded-[3px] shadow-inner" />
                    </div>

                    {/* Number Row */}
                    <div className="flex gap-1 h-6">
                      <div className="w-6 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      ))}
                      <div className="w-9 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                    </div>

                    {/* QWERTY Row */}
                    <div className="flex gap-1 h-6">
                      <div className="w-9 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      ))}
                      <div className="w-6 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                    </div>

                    {/* Home Row (ASDF) */}
                    <div className="flex gap-1 h-6">
                      <div className="w-11 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      ))}
                      <div className="w-12 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                    </div>

                    {/* Bottom Row (Spacebar + Modifiers) */}
                    <div className="flex gap-1 h-7">
                      <div className="w-8 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      <div className="w-8 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      <div className="w-10 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[3px] shadow-inner" />
                      <div className="w-10 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      <div className="w-8 bg-zinc-900 border border-zinc-800 rounded-[3px]" />
                      <div className="w-11 bg-zinc-900 border border-zinc-800 rounded-[3px] flex gap-0.5">
                        <div className="flex-1 bg-zinc-800/80 rounded-[2px]" />
                        <div className="flex-1 bg-zinc-800/80 rounded-[2px]" />
                      </div>
                    </div>
                  </div>

                  {/* Right Speaker Grille */}
                  <div
                    className="w-12 h-52 rounded shrink-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(82, 82, 91, 0.3) 1px, transparent 1px)',
                      backgroundSize: '3px 3px'
                    }}
                  />
                </div>

                {/* Center Glass Force Touch Trackpad */}
                <div className="relative mx-auto mt-4 mb-1 w-72 h-44 rounded-2xl bg-[#14171f] border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 rounded-2xl bg-white/[0.02] pointer-events-none" />
                </div>

                {/* Precision CNC Thumb Opening Scoop Notch on Front Lip */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-[#08090c] rounded-t-sm border-t border-zinc-700/80" />
              </div>

              {/* Rear Cylindrical Hinge Bar */}
              <div
                className="absolute -top-1.5 left-6 right-6 h-2.5 bg-[#050608] rounded-full border border-zinc-800/90 shadow-md pointer-events-none transition-opacity duration-500"
                style={{
                  zIndex: 15,
                  opacity: isDisplayZoomed ? 0 : 1,
                  display: isDisplayZoomed ? 'none' : 'block'
                }}
              />

              {/* Soft Ambient Desk Contact Shadow */}
              <div
                aria-hidden="true"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[92%] h-8 rounded-full pointer-events-none transition-all duration-700"
                style={{
                  background: isDark
                    ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.20) 50%, transparent 75%)'
                    : 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.20) 0%, rgba(15, 23, 42, 0.05) 50%, transparent 75%)',
                  filter: isDark ? 'blur(10px)' : 'blur(12px)',
                  transform: 'translateZ(-10px)',
                  opacity: isDisplayZoomed ? 0 : 1,
                  display: isDisplayZoomed ? 'none' : 'block'
                }}
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[78%] h-12 rounded-full pointer-events-none transition-all duration-700"
                style={{
                  background: isDark
                    ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.10) 50%, transparent 75%)'
                    : 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.10) 0%, rgba(15, 23, 42, 0.02) 50%, transparent 75%)',
                  filter: isDark ? 'blur(16px)' : 'blur(18px)',
                  transform: 'translateZ(-20px)',
                  opacity: isDisplayZoomed ? 0 : 1,
                  display: isDisplayZoomed ? 'none' : 'block'
                }}
              />

              {/* --- 2. 3D REAR-HINGED DISPLAY LID (800px x 500px or Full Screen Zoom) --- */}
              <div
                className={`laptop-lid ${
                  isDisplayZoomed
                    ? isMobile
                      ? 'relative w-full h-[560px] rounded-2xl'
                      : 'relative w-[800px] h-[500px] rounded-[20px] mx-auto'
                    : 'absolute top-0 left-0 w-[800px] h-[500px] rounded-[20px]'
                }`}
                style={{
                  transformStyle: isDisplayZoomed ? 'flat' : 'preserve-3d',
                  transformOrigin: 'top center',
                  transform: isDisplayZoomed
                    ? 'none'
                    : isLidOpen
                    ? 'rotateX(108deg)'
                    : 'rotateX(0deg)',
                  transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 800ms ease',
                  boxShadow: isDisplayZoomed
                    ? isDark
                      ? '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                      : '0 25px 60px -15px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.08)'
                    : isLidOpen
                    ? isDark
                      ? '0 30px 70px -15px rgba(0, 0, 0, 0.8), -6px -6px 28px -10px rgba(186, 230, 253, 0.15)'
                      : '0 25px 50px -15px rgba(15, 23, 42, 0.35), -6px -6px 28px -10px rgba(148, 163, 184, 0.18)'
                    : isDark
                      ? '0 15px 35px -5px rgba(0, 0, 0, 0.95)'
                      : '0 12px 28px -5px rgba(15, 23, 42, 0.25)'
                }}
              >
                {/* 2A. EXTERIOR SHELL FACE (Space Gray Aluminum - visible when closed / fold angle < 90deg) */}
                <div
                  className="absolute inset-0 rounded-[20px] select-none flex items-center justify-center overflow-hidden"
                  onClick={() => !isLidOpen && setIsLidOpen(true)}
                  style={{
                    display: isDisplayZoomed ? 'none' : 'flex',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: isDark
                      ? 'linear-gradient(145deg, #2a303d 0%, #1c202a 50%, #12141a 100%)'
                      : 'linear-gradient(145deg, #384050 0%, #262c38 50%, #1a1e27 100%)',
                    border: isDark ? '2px solid #3c455c' : '2px solid #4a5568',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.6)',
                    cursor: isLidOpen ? 'default' : 'pointer'
                  }}
                  title={!isLidOpen ? "Click to open MacBook" : undefined}
                >
                  {/* Aluminum Specular Sheen Diagonal Streak */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background: 'linear-gradient(125deg, transparent 20%, rgba(255,255,255,0.4) 45%, transparent 60%)'
                    }}
                  />
                  {/* Minimalist chassis label */}
                  <div className="text-zinc-500/30 font-mono text-[10px] tracking-widest uppercase pointer-events-none select-none">
                    MacBook Pro 16″
                  </div>
                </div>

                {/* 2B. INTERIOR DISPLAY FACE (KasajuOS Liquid Retina Display) */}
                <div
                  className={`${
                    isDisplayZoomed && isMobile
                      ? 'relative w-full h-full rounded-2xl flex flex-col overflow-hidden'
                      : 'absolute inset-0 rounded-[20px] flex flex-col overflow-hidden'
                  }`}
                  style={{
                    transform: isDisplayZoomed ? 'none' : 'rotateY(180deg) rotateZ(180deg) translateZ(0)',
                    transformStyle: 'flat',
                    contain: 'paint',
                    overflow: 'hidden',
                    backfaceVisibility: isDisplayZoomed ? 'visible' : 'hidden',
                    WebkitBackfaceVisibility: isDisplayZoomed ? 'visible' : 'hidden',
                    backgroundColor: '#0a0d14',
                    border: isDark ? '2px solid #2d3345' : '2px solid #3c455c',
                    padding: isDisplayZoomed
                      ? isMobile
                        ? '4px 4px 8px 4px'
                        : '8px'
                      : '8px 8px 18px 8px',
                    boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9)',
                    pointerEvents: (isLidOpen || isDisplayZoomed) ? 'auto' : 'none',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {/* Top Camera Bezel / Notch */}
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-b-md flex items-center justify-center gap-1.5 z-40 select-none pointer-events-none"
                    style={{
                      display: isDisplayZoomed && isMobile ? 'none' : 'flex'
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700" />
                    <div className="w-1 h-1 rounded-full bg-emerald-400/90 shadow-[0_0_4px_#34d399]" />
                  </div>

                  {/* Display Area hosting Visual Studio Code Workspace */}
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Interactive MacBook Liquid Retina Display - Visual Studio Code Workspace"
                    className="relative w-full flex-1 h-full overflow-hidden rounded-lg outline-none flex flex-col"
                    style={{
                      contain: 'paint',
                      overflow: 'hidden'
                    }}
                  >
                    <VSCodeWorkspace
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                      isDisplayZoomed={isDisplayZoomed}
                      enterDisplayZoom={enterDisplayZoom}
                      exitDisplayZoom={exitDisplayZoom}
                      userLocation={userLocation}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MacbookShowcase
