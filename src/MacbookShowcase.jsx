import React, { useState, useEffect, useRef } from 'react'

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

// Classic aesthetic wallpapers sourced directly from wallpapercave.com/macbook-backgrounds-hd
const WALLPAPERS = [
  {
    id: 'matterhorn',
    name: 'Matterhorn Starry Night',
    shortName: 'Starry Night',
    path: '/wallpapers/matterhorn-night.webp',
    icon: '🏔️'
  },
  {
    id: 'galaxy',
    name: 'OS X Lion Andromeda Galaxy',
    shortName: 'OS X Galaxy',
    path: '/wallpapers/osx-galaxy.webp',
    icon: '🌌'
  },
  {
    id: 'ocean',
    name: 'Golden Ocean Sunrise',
    shortName: 'Sun Sunrise',
    path: '/wallpapers/ocean-sunrise.webp',
    icon: '🌅'
  }
]

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
      return typeof window !== 'undefined' && window.location.search.includes('opened=true')
    } catch {
      return false
    }
  })
  const [hasAutoOpened, setHasAutoOpened] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('opened=true')
    } catch {
      return false
    }
  })
  const sectionRef = useRef(null)

  // Wallpaper index state (synced with theme: Matterhorn for dark, Sunrise for light)
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState(() => (isDark ? 0 : 2))

  // Which window has focus (higher z-index): 'about' | 'experience'
  const [activeWindow, setActiveWindow] = useState('about')
  // Window closed states (red traffic light)
  const [closed, setClosed] = useState({ about: false, experience: false })
  // Window minimize states (yellow traffic light)
  const [minimized, setMinimized] = useState({ about: false, experience: false })
  // Window maximized states (green traffic light)
  const [maximized, setMaximized] = useState({ about: false, experience: false })
  // Active mobile tab when on small screens
  const [mobileTab, setMobileTab] = useState('about')
  // Mobile dossier modal reader state: null | 'about' | 'experience'
  const [dossierModal, setDossierModal] = useState(null)

  // Responsive scale state for mobile fitting
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const DESIGN_WIDTH = 820
  const DESIGN_HEIGHT = 860

  useEffect(() => {
    if (!containerRef.current) return
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        if (width > 0 && width < DESIGN_WIDTH) {
          setScale(width / DESIGN_WIDTH)
        } else {
          setScale(1)
        }
      }
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    ro.observe(containerRef.current)
    window.addEventListener('resize', updateScale)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  // Real-time live clock state
  const [currentTime, setCurrentTime] = useState('')

  // Escape key listener to close mobile dossier modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDossierModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  // Real-time location state automatically synchronized from timezone
  const [userLocation, setUserLocation] = useState(getInitialTimezoneCity)

  // Real-time live clock ticking every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })
      )
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

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

  // Auto-switch default wallpaper if theme changes
  useEffect(() => {
    setActiveWallpaperIndex(isDark ? 0 : 2)
  }, [isDark])

  // One-time slow, cinematic opening animation on initial page load / scroll into view
  // Deliberate 900ms pause so user clearly sees the closed MacBook resting on desk, then slowly unfolds over 4.8s
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

  // Cycle through classic wallpapers from wallpapercave
  const cycleWallpaper = () => {
    setActiveWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length)
  }

  // Restore / Bring to front a markdown file window when clicked
  const restoreWindow = (windowKey, e) => {
    if (e) e.stopPropagation()
    setClosed((prev) => ({ ...prev, [windowKey]: false }))
    setMinimized((prev) => ({ ...prev, [windowKey]: false }))
    setActiveWindow(windowKey)
    setMobileTab(windowKey)
  }

  const handleClose = (windowKey, e) => {
    e.stopPropagation()
    setClosed((prev) => ({ ...prev, [windowKey]: true }))
  }

  const handleMinimize = (windowKey, e) => {
    e.stopPropagation()
    setMinimized((prev) => ({ ...prev, [windowKey]: true }))
  }

  const toggleMaximize = (windowKey, e) => {
    e.stopPropagation()
    setMaximized((prev) => ({ ...prev, [windowKey]: !prev[windowKey] }))
    setActiveWindow(windowKey)
  }

  const currentWallpaper = WALLPAPERS[activeWallpaperIndex]

  return (
    <section ref={sectionRef} className="fadeup-item fadeup-2 mb-16 overflow-visible">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></span>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Engineering Profile & Experience</span>
            <span className="hidden sm:inline-block text-[11px] font-mono font-normal text-zinc-500 dark:text-zinc-400">
              Interactive Workspace
            </span>
          </h2>
        </div>
      </div>

      {/* Spacious Bounding Box - Scales proportionally on mobile to fit screen */}
      <div
        ref={containerRef}
        className="relative w-full py-2 sm:py-6 px-0 sm:px-4 overflow-hidden sm:overflow-visible flex flex-col items-center justify-start"
        style={{
          height: scale < 1 ? `${Math.round(DESIGN_HEIGHT * scale)}px` : 'auto'
        }}
      >
        <div
          style={{
            width: scale < 1 ? `${DESIGN_WIDTH}px` : '100%',
            maxWidth: `${DESIGN_WIDTH}px`,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            flexShrink: 0
          }}
        >
          {/* --- APPLE MACBOOK 3D HERO SHOWCASE (Unified Perspective Rig) --- */}
          <div
            className="relative w-full select-none overflow-visible flex items-center justify-center"
            style={{
              perspective: '1600px',
              perspectiveOrigin: '50% 25%',
              minHeight: '840px'
            }}
          >
            {/* Left-Hand External Ambient Light Source */}
            <div
              aria-hidden="true"
              className="absolute top-10 left-4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 z-0"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(147, 197, 253, 0.16) 0%, rgba(96, 165, 250, 0.05) 50%, transparent 75%)'
                  : 'radial-gradient(circle, rgba(253, 224, 71, 0.22) 0%, rgba(251, 191, 36, 0.07) 50%, transparent 75%)'
              }}
            />

            {/* THE LAPTOP RIG (800px x 500px, 3D Tilted Desk Angle at 54deg) */}
            <div
              className="relative"
              style={{
                width: '800px',
                height: '500px',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(54deg)',
                marginTop: '370px',
                transition: 'transform 4800ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* --- 1. LOWER UNIBODY BASE CHASSIS (500px depth, exactly matches Lid 500px depth) --- */}
              <div
                className="absolute inset-0 rounded-[20px] flex flex-col justify-between"
                style={{
                  background: isDark
                    ? 'linear-gradient(180deg, #1a1d26 0%, #12141a 45%, #0b0d11 100%)'
                    : 'linear-gradient(180deg, #2b303d 0%, #1e222b 45%, #12141a 100%)',
                  border: isDark ? '2px solid #2d3345' : '2px solid #3c455c',
                  padding: '16px 24px 20px 24px',
                  boxShadow: '0 50px 90px -15px rgba(0, 0, 0, 0.95), 0 20px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Upper Deck Surface: Speaker Grilles + Recessed Keyboard Well */}
                <div className="flex items-center justify-between gap-4 mt-1.5">
                  {/* Left Speaker Grille */}
                  <div className="w-12 h-52 rounded bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:3px_3px] opacity-35 shrink-0" />

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
                  <div className="w-12 h-52 rounded bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:3px_3px] opacity-35 shrink-0" />
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
                className="absolute -top-1.5 left-6 right-6 h-2.5 bg-[#050608] rounded-full border border-zinc-800/90 shadow-md pointer-events-none"
                style={{ zIndex: 15 }}
              />

              {/* Ambient Studio Desk Surface Drop Shadows */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-10 bg-black/70 blur-2xl rounded-full pointer-events-none"
                style={{ transform: 'translateZ(-20px)' }}
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[76%] h-14 bg-black/50 blur-3xl rounded-full pointer-events-none"
                style={{ transform: 'translateZ(-30px)' }}
              />

              {/* --- 2. 3D REAR-HINGED DISPLAY LID (800px x 500px, matches base 1:1) --- */}
              <div
                className="laptop-lid absolute top-0 left-0 w-[800px] h-[500px] rounded-[20px]"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'top center',
                  transform: isLidOpen ? 'rotateX(108deg)' : 'rotateX(0deg)',
                  transition: 'transform 4800ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 4800ms ease',
                  boxShadow: isLidOpen
                    ? isDark
                      ? '0 30px 70px -15px rgba(0, 0, 0, 0.8), -6px -6px 28px -10px rgba(186, 230, 253, 0.15)'
                      : '0 30px 70px -15px rgba(0, 0, 0, 0.8), -6px -6px 28px -10px rgba(254, 240, 138, 0.22)'
                    : '0 15px 35px -5px rgba(0, 0, 0, 0.95)'
                }}
              >
                {/* 2A. EXTERIOR SHELL FACE (Space Gray Aluminum - visible when closed / fold angle < 90deg) */}
                <div
                  className="absolute inset-0 rounded-[20px] select-none flex items-center justify-center overflow-hidden"
                  onClick={() => !isLidOpen && setIsLidOpen(true)}
                  style={{
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

                {/* 2B. INTERIOR DISPLAY FACE (KasajuOS Liquid Retina Display - visible when open / fold angle > 90deg) */}
                <div
                  className="absolute inset-0 rounded-[20px] flex flex-col overflow-hidden"
                  style={{
                    transform: 'rotateY(180deg) rotateZ(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    backgroundColor: '#0a0d14',
                    border: isDark ? '2px solid #2d3345' : '2px solid #3c455c',
                    padding: '8px 8px 0 8px',
                    boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9)',
                    pointerEvents: isLidOpen ? 'auto' : 'none'
                  }}
                >
                  {/* Top Camera Bezel / Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-b-md flex items-center justify-center gap-1.5 z-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700" />
                    <div className="w-1 h-1 rounded-full bg-emerald-400/90 shadow-[0_0_4px_#34d399]" />
                  </div>

                  {/* Display Area (Liquid Retina Display with Classic Mac Wallpaper) */}
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Interactive MacBook Liquid Retina Display"
                    className="relative w-full flex-1 overflow-hidden rounded-t-lg transition-all duration-700 outline-none flex flex-col"
                    style={{
                      backgroundImage: `url(${currentWallpaper.path})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >

              {/* Subtle Cosmic Grid / Ambient Glow Layer */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

              {/* Natural Directional Glass Screen Glare (Originates from the Left: Moonlight in Dark Mode, Sunlight in Light Mode) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-35 overflow-hidden transition-all duration-700 select-none"
              >
                {/* Light Source 1: Soft Left-Edge Source Halo (Moonlight / Sunlight casting into the screen) */}
                <div
                  className="absolute -left-16 -top-16 w-80 h-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
                  style={{
                    background: isDark
                      ? 'radial-gradient(circle, rgba(186, 230, 253, 0.32) 0%, rgba(147, 197, 253, 0.12) 45%, transparent 75%)'
                      : 'radial-gradient(circle, rgba(254, 240, 138, 0.42) 0%, rgba(253, 230, 138, 0.18) 45%, transparent 75%)'
                  }}
                />

                {/* Light Source 2: Diagonal Glass Reflection Wash (Sweeps across the left-hand menu and window edges) */}
                <div
                  className="absolute top-0 left-0 w-3/5 h-full transition-all duration-700 pointer-events-none"
                  style={{
                    background: isDark
                      ? 'linear-gradient(120deg, rgba(255, 255, 255, 0.22) 0%, rgba(224, 242, 254, 0.14) 22%, rgba(186, 230, 253, 0.05) 45%, transparent 70%)'
                      : 'linear-gradient(120deg, rgba(255, 255, 255, 0.32) 0%, rgba(254, 240, 138, 0.22) 22%, rgba(253, 224, 71, 0.07) 48%, transparent 70%)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, transparent 100%)'
                  }}
                />

                {/* Light Source 3: Specular Angled Screen Glare Streak */}
                <div
                  className="absolute top-0 left-0 w-1/2 h-full opacity-65 transition-all duration-700 pointer-events-none"
                  style={{
                    background: isDark
                      ? 'linear-gradient(115deg, transparent 12%, rgba(255, 255, 255, 0.16) 24%, rgba(224, 242, 254, 0.07) 30%, transparent 42%)'
                      : 'linear-gradient(115deg, transparent 12%, rgba(255, 255, 255, 0.28) 24%, rgba(254, 240, 138, 0.12) 30%, transparent 42%)'
                  }}
                />

                {/* Light Source 4: Optical Glass Diffusion over Inactive Menu Bar Items */}
                <div
                  className="absolute top-0 left-0 w-80 h-7 backdrop-blur-[1.5px] transition-all duration-700 pointer-events-none"
                  style={{
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)'
                  }}
                />
              </div>

              {/* macOS Top Menu Bar (Clean Branding, Zero Apple Logos) */}
              <div className="relative z-30 h-7 px-3 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] text-zinc-300">
                {/* Left Side: Clean Title + Sun/Moon Glare Diffused Inactive Menu Items */}
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white tracking-tight text-xs">KasajuOS</span>

                  {/* Inactive Menu Buttons (File, Edit, View, Window) Naturally Blurred under Left-Hand Glare */}
                  <div
                    aria-hidden="true"
                    className="hidden md:flex items-center gap-3 filter blur-[2px] opacity-25 select-none pointer-events-none transition-all duration-500 font-normal text-zinc-300"
                  >
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Window</span>
                  </div>
                </div>

                {/* Right Side: Working Features (Wallpaper Switcher, Theme Toggle, Real-Time Location & Clock Sync) */}
                <div className="flex items-center gap-2">
                  {/* WORKING FEATURE 1: Classic Aesthetic Wallpaper Switcher */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      cycleWallpaper()
                    }}
                    title={`Wallpaper: ${currentWallpaper.name} (Click to cycle classic Mac aesthetics)`}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-[10px] font-mono transition-colors cursor-pointer group shadow-xs shrink-0"
                  >
                    <span>{currentWallpaper.icon}</span>
                    <span className="hidden sm:inline">{currentWallpaper.shortName}</span>
                  </button>

                  {/* WORKING FEATURE 2: Dark / Light Mode Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTheme()
                    }}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-100 text-[10px] font-mono transition-colors cursor-pointer group shadow-xs"
                  >
                    {isDark ? (
                      <i className="fa-solid fa-moon text-blue-300 text-[10px]"></i>
                    ) : (
                      <i className="fa-solid fa-sun text-amber-400 text-[10px]"></i>
                    )}
                    <span>{isDark ? 'Dark' : 'Light'}</span>
                  </button>

                  {/* AUTOMATIC REAL-TIME FEATURE: Auto-Synced Location & Live Clock */}
                  <div
                    title={`Location: ${userLocation} · Live Clock: ${currentTime}`}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 text-[10px] font-mono shadow-xs shrink-0 select-none"
                  >
                    {/* macOS Location Arrow Icon */}
                    <svg
                      className="w-2.5 h-2.5 text-blue-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                    </svg>

                    {/* Auto-Synchronized Location */}
                    <span className="font-medium text-zinc-200">
                      {userLocation}
                    </span>
                    <span className="text-zinc-500 font-normal">·</span>

                    {/* Auto-Synchronized Live Clock */}
                    <span className="font-semibold text-zinc-100 tracking-tight">
                      {currentTime || 'Syncing...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Canvas Window Container */}
              <div className="relative w-full h-[calc(100%-28px)] overflow-hidden">
                {/* --- INTERACTIVE DESKTOP APP SHORTCUTS (Click to Open / Restore Markdown Files) --- */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 select-none">
                  {/* ABOUT_ME.md Desktop Shortcut */}
                  <button
                    type="button"
                    onClick={(e) => restoreWindow('about', e)}
                    title="Click to open or bring ABOUT_ME.md to front"
                    className="flex flex-col items-center gap-1 w-20 p-1 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer group text-center outline-none"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center text-blue-400 shadow-xl transition-all group-hover:scale-105 group-hover:border-blue-400 ${
                        !closed.about && !minimized.about && activeWindow === 'about'
                          ? 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                          : ''
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-200 font-mono text-center px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs group-hover:bg-blue-600/90 leading-tight">
                      ABOUT_ME.md
                    </span>
                    {!closed.about && !minimized.about && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 -mt-0.5"></span>
                    )}
                  </button>

                  {/* EXPERIENCE.md Desktop Shortcut */}
                  <button
                    type="button"
                    onClick={(e) => restoreWindow('experience', e)}
                    title="Click to open or bring EXPERIENCE.md to front"
                    className="flex flex-col items-center gap-1 w-20 p-1 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer group text-center outline-none"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center text-emerald-400 shadow-xl transition-all group-hover:scale-105 group-hover:border-emerald-400 ${
                        !closed.experience && !minimized.experience && activeWindow === 'experience'
                          ? 'ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : ''
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-200 font-mono text-center px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs group-hover:bg-emerald-600/90 leading-tight">
                      EXPERIENCE.md
                    </span>
                    {!closed.experience && !minimized.experience && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mt-0.5"></span>
                    )}
                  </button>
                </div>

                {/* --- WINDOW 1: ABOUT_ME.md (Opened Markdown Application) --- */}
                {isLidOpen && !closed.about && !minimized.about && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveWindow('about')
                      setMobileTab('about')
                      if (scale < 1) {
                        setDossierModal('about')
                      }
                    }}
                    className={`absolute transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl flex flex-col ${
                      maximized.about
                        ? 'inset-1 z-35'
                        : 'left-6 top-4 w-[57%] h-[86%]'
                    } ${
                      activeWindow === 'about'
                        ? 'z-30 ring-1 ring-blue-500/30 border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                        : 'z-20 border-zinc-800/80 opacity-95 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: 'rgba(13, 17, 23, 0.88)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      transform: isLidOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
                    }}
                  >
                    {/* Window Title Bar */}
                    <div className="h-8 px-3 bg-zinc-900/95 border-b border-zinc-800 flex items-center justify-between shrink-0 select-none">
                      <div className="flex items-center gap-2">
                        {/* Traffic Light Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleClose('about', e)}
                            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] cursor-pointer"
                            title="Close (Click desktop shortcut to reopen)"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleMinimize('about', e)}
                            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123] cursor-pointer"
                            title="Minimize to desktop"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              if (scale < 1) {
                                e.stopPropagation()
                                setDossierModal('about')
                              } else {
                                toggleMaximize('about', e)
                              }
                            }}
                            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29] cursor-pointer"
                            title="Maximize to view full dossier"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 ml-1 flex items-center gap-1">
                          <span className="text-blue-400">#</span> ABOUT_ME.md
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-400">
                        ~/kasaju/ABOUT_ME.md · UTF-8
                      </div>
                    </div>

                    {/* Window Markdown Editor Content Area */}
                    <div className="p-3.5 sm:p-4 overflow-y-auto mac-scrollbar text-xs leading-relaxed text-zinc-200 font-sans space-y-3">
                      <div className="border-b border-zinc-800/80 pb-2.5">
                        <div className="flex items-center justify-between">
                          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            Agrim Kasaju
                          </h1>
                          <span className="text-[10px] font-mono text-blue-300 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span>Theme: {currentTheme?.name || 'Minimal Slate'}</span>
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                          B.Eng Computer Systems Engineering @ Carleton University · GPA 3.33/4.0 · Dean's Honour List
                        </p>
                      </div>

                      <p className="text-zinc-300">
                        Fourth-year engineering student with hands-on production experience in Linux systems software, automated verification harnesses, and edge AI deployment.
                      </p>

                      {/* Architectural Philosophy Callout */}
                      <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800/90 text-[11px]">
                        <span className="text-blue-400 font-mono font-semibold block mb-0.5">// Architectural Philosophy</span>
                        <p className="text-zinc-300">
                          High-throughput, low-latency execution that survives hostile edge environments, high thread contention, and deterministic timing constraints.
                        </p>
                      </div>

                      {/* Core Engineering Stack */}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider mb-1 block font-semibold">
                          Core Engineering Stack:
                        </span>
                        <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">C/C++</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">Go</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">Python</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">Linux POSIX APIs</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">ONNX / TFLite INT8</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">mTLS & X.509</span>
                        </div>
                      </div>

                      {/* MAXIMIZED VIEW EXPANSION */}
                      {maximized.about && (
                        <div className="mt-4 pt-4 border-t border-zinc-800/90 space-y-4 animate-fadeIn">
                          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/40 text-blue-200 text-[11px] font-mono flex items-center justify-between">
                            <span>✨ Full Engineering Dossier Unlocked (Maximized View)</span>
                            <span className="text-[10px] opacity-75">Click green button to minimize back</span>
                          </div>

                          <div>
                            <h2 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider mb-2">
                              ## Engineering Background & Systems Philosophy
                            </h2>
                            <div className="space-y-2.5 text-zinc-300 text-xs leading-relaxed font-sans">
                              <p>
                                I am a fourth-year Computer Systems Engineering student at Carleton University with a 3.33/4.0 GPA, specializing in hardware-software co-design, real-time operating systems, distributed networks, and embedded edge AI computing.
                              </p>
                              <p>
                                At <strong>Lumentum</strong>, I work as a Software Developer Co-op on systems verification pipelines, where I automated Linux test harnesses across 10+ optical subsystem configurations (reducing test durations by 35%), implemented mutual TLS (mTLS) with bidirectional X.509 certificate validation, and architected C#/Go filesystem event monitoring pipelines with prototext persistence that reduced snapshot storage overhead by 88%.
                              </p>
                              <p>
                                My technical approach prioritizes systems-level determinism, minimal memory footprint, lockless inter-thread communication, and rigorous verification under high load.
                              </p>
                            </div>
                          </div>

                          {/* Extended Coursework Grid */}
                          <div className="pt-2">
                            <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider mb-2">
                              ### Academic Highlights & Systems Coursework
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                              <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                                <span className="text-white font-semibold block">⚡ Real-Time Systems (SYSC 4001)</span>
                                <span className="text-[10px] text-zinc-400">Rate-Monotonic scheduling, priority inversion inheritance, POSIX threads.</span>
                              </div>
                              <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                                <span className="text-white font-semibold block">🛡️ Network Security (SYSC 4810)</span>
                                <span className="text-[10px] text-zinc-400">Cryptographic protocols, packet filtering, iptables, mTLS authentication.</span>
                              </div>
                              <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                                <span className="text-white font-semibold block">🔌 Embedded Systems (SYSC 3310)</span>
                                <span className="text-[10px] text-zinc-400">ARM Cortex-M SoC, memory-mapped I/O, UART/SPI/I2C bare-metal drivers.</span>
                              </div>
                              <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                                <span className="text-white font-semibold block">⚙️ Operating Systems (SYSC 4005)</span>
                                <span className="text-[10px] text-zinc-400">Virtual memory paging, inode filesystems, lock-free concurrency.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- WINDOW 2: EXPERIENCE.md (Opened Markdown Application) --- */}
                {isLidOpen && !closed.experience && !minimized.experience && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveWindow('experience')
                      setMobileTab('experience')
                      if (scale < 1) {
                        setDossierModal('experience')
                      }
                    }}
                    className={`absolute transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl flex flex-col ${
                      maximized.experience
                        ? 'inset-1 z-35'
                        : 'right-6 top-7 w-[50%] h-[84%]'
                    } ${
                      activeWindow === 'experience'
                        ? 'z-30 ring-1 ring-emerald-500/30 border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                        : 'z-20 border-zinc-800/80 opacity-95 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: 'rgba(15, 20, 28, 0.90)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      transform: isLidOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
                    }}
                  >
                    {/* Window Title Bar */}
                    <div className="h-8 px-3 bg-zinc-900/95 border-b border-zinc-800 flex items-center justify-between shrink-0 select-none">
                      <div className="flex items-center gap-2">
                        {/* Traffic Light Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleClose('experience', e)}
                            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] cursor-pointer"
                            title="Close (Click desktop shortcut to reopen)"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleMinimize('experience', e)}
                            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123] cursor-pointer"
                            title="Minimize to desktop"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              if (scale < 1) {
                                e.stopPropagation()
                                setDossierModal('experience')
                              } else {
                                toggleMaximize('experience', e)
                              }
                            }}
                            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29] cursor-pointer"
                            title="Maximize"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 ml-1 flex items-center gap-1">
                          <span className="text-emerald-400">#</span> EXPERIENCE.md
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-400">
                        ~/kasaju/EXPERIENCE.md · Preview
                      </div>
                    </div>

                    {/* Window Markdown Editor Content Area */}
                    <div className="p-3.5 sm:p-4 overflow-y-auto mac-scrollbar text-xs leading-relaxed text-zinc-200 font-sans space-y-3">
                      {/* Lumentum Co-op Experience */}
                      <div className="border-b border-zinc-800/80 pb-2.5">
                        <div className="flex items-baseline justify-between">
                          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>Lumentum</span>
                            <span className="text-zinc-400 font-normal">·</span>
                            <span className="text-emerald-400 font-medium text-xs">Software Developer (Co-op)</span>
                          </h2>
                          <span className="text-[10px] font-mono text-zinc-300">May 2026 – Present</span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400">Ottawa, ON · Systems Software & Verification</p>

                        <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-200 pl-3 list-disc marker:text-emerald-400">
                          <li>
                            <strong className="text-white font-semibold">Automated Linux Validation:</strong> Validated system software by automating test harness execution and diagnostic log parsing across 10+ configurations, <span className="text-emerald-300 font-semibold">reducing manual regression duration by 35%</span>.
                          </li>
                          <li>
                            <strong className="text-white font-semibold">Mutual TLS (mTLS) Security:</strong> Implemented bidirectional X.509 certificate validation between host daemons and client endpoints to enforce strict authentication.
                          </li>
                          <li>
                            <strong className="text-white font-semibold">State Isolation & Storage Reduction:</strong> Built C# filesystem event monitoring service & Go backend pipelines validating declarative prototext persistence, <span className="text-emerald-300 font-semibold">cutting snapshot storage overhead by 88%</span>.
                          </li>
                        </ul>
                      </div>

                      {/* TELUS Experience */}
                      <div className="border-b border-zinc-800/80 pb-2">
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-xs font-bold text-white">
                            TELUS Go Sales <span className="text-zinc-400 font-normal">· Sales Representative</span>
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-300">Jul 2023 – Aug 2023</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 mt-1">
                          Communicated technical network specifications, hardware requirements, and client advisory in Calgary, AB.
                        </p>
                      </div>

                      {/* Academic Experience & Coursework */}
                      <div>
                        <p className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider mb-1 font-semibold">
                          Coursework & Low-Level Foundations:
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                            ⚡ Real-Time Systems (Rate-Monotonic)
                          </div>
                          <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                            🛡️ Network & Software Security (iptables)
                          </div>
                          <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                            🔌 ARM SoC Design (UART/I2C/SPI)
                          </div>
                          <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                            ⚙️ CPU Scheduling & POSIX IPC
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

      {/* Mobile Quick Reader Actions */}
      {scale < 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3 px-2 select-none">
          <button
            type="button"
            onClick={() => setDossierModal('about')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-100 shadow-md transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Read ABOUT_ME.md</span>
            <span className="text-[10px] text-zinc-400">↗</span>
          </button>
          <button
            type="button"
            onClick={() => setDossierModal('experience')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-100 shadow-md transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Read EXPERIENCE.md</span>
            <span className="text-[10px] text-zinc-400">↗</span>
          </button>
        </div>
      )}

      {/* Mobile Dossier Modal Reader (Clean, Accessible Full-Screen View) */}
      {dossierModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setDossierModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-950/95 border border-zinc-700/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Modal Window Title Bar */}
            <div className="h-9 px-3 bg-zinc-900/95 border-b border-zinc-800 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                {/* Traffic Lights */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDossierModal(null)}
                    className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] cursor-pointer"
                    title="Close reader"
                  />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-60"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-60"></span>
                </div>
                <span className="text-xs font-mono text-zinc-300 ml-1">
                  ~/kasaju/{dossierModal === 'about' ? 'ABOUT_ME.md' : 'EXPERIENCE.md'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setDossierModal(null)}
                className="w-6 h-6 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Segmented Tab Bar */}
            <div className="flex items-center bg-zinc-900/60 border-b border-zinc-800 p-1.5 gap-1.5 select-none">
              <button
                type="button"
                onClick={() => setDossierModal('about')}
                className={`flex-1 py-1 text-xs font-mono rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  dossierModal === 'about'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <span className="text-blue-300">#</span>
                <span>ABOUT_ME.md</span>
              </button>
              <button
                type="button"
                onClick={() => setDossierModal('experience')}
                className={`flex-1 py-1 text-xs font-mono rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  dossierModal === 'experience'
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <span className="text-emerald-300">#</span>
                <span>EXPERIENCE.md</span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto mac-scrollbar space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-200 font-sans">
              {dossierModal === 'about' ? (
                <>
                  <div className="border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center justify-between">
                      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        Agrim Kasaju
                      </h1>
                      <span className="text-[11px] font-mono text-blue-300 bg-blue-950/60 border border-blue-800/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span>Theme: {currentTheme?.name || 'Minimal Slate'}</span>
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      B.Eng Computer Systems Engineering @ Carleton University · GPA 3.33/4.0 · Dean's Honour List
                    </p>
                  </div>

                  <p className="text-zinc-300">
                    Fourth-year engineering student with hands-on production experience in Linux systems software, automated verification harnesses, and edge AI deployment.
                  </p>

                  {/* Architectural Philosophy */}
                  <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/90 text-xs">
                    <span className="text-blue-400 font-mono font-semibold block mb-1">// Architectural Philosophy</span>
                    <p className="text-zinc-300">
                      High-throughput, low-latency execution that survives hostile edge environments, high thread contention, and deterministic timing constraints.
                    </p>
                  </div>

                  {/* Core Engineering Stack */}
                  <div>
                    <span className="text-xs font-mono uppercase text-zinc-300 tracking-wider mb-1.5 block font-semibold">
                      Core Engineering Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">C/C++</span>
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">Go</span>
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">Python</span>
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">Linux POSIX APIs</span>
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">ONNX / TFLite INT8</span>
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">mTLS & X.509</span>
                    </div>
                  </div>

                  {/* Systems Philosophy Details */}
                  <div className="pt-2 border-t border-zinc-800/90 space-y-3">
                    <h2 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">
                      ## Engineering Background & Systems Philosophy
                    </h2>
                    <p className="text-zinc-300">
                      I am a fourth-year Computer Systems Engineering student at Carleton University with a 3.33/4.0 GPA, specializing in hardware-software co-design, real-time operating systems, distributed networks, and embedded edge AI computing.
                    </p>
                    <p className="text-zinc-300">
                      At <strong>Lumentum</strong>, I work as a Software Developer Co-op on systems verification pipelines, where I automated Linux test harnesses across 10+ optical subsystem configurations (reducing test durations by 35%), implemented mutual TLS (mTLS) with bidirectional X.509 certificate validation, and architected C#/Go filesystem event monitoring pipelines with prototext persistence that reduced snapshot storage overhead by 88%.
                    </p>
                    <p className="text-zinc-300">
                      My technical approach prioritizes systems-level determinism, minimal memory footprint, lockless inter-thread communication, and rigorous verification under high load.
                    </p>
                  </div>

                  {/* Coursework */}
                  <div className="pt-2">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">
                      ### Academic Highlights & Systems Coursework
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                        <span className="text-white font-semibold block mb-0.5">⚡ Real-Time Systems (SYSC 4001)</span>
                        <span className="text-zinc-400">Rate-Monotonic scheduling, priority inversion inheritance, POSIX threads.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                        <span className="text-white font-semibold block mb-0.5">🛡️ Network Security (SYSC 4810)</span>
                        <span className="text-zinc-400">Cryptographic protocols, packet filtering, iptables, mTLS authentication.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                        <span className="text-white font-semibold block mb-0.5">🔌 Embedded Systems (SYSC 3310)</span>
                        <span className="text-zinc-400">ARM Cortex-M SoC, memory-mapped I/O, UART/SPI/I2C bare-metal drivers.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                        <span className="text-white font-semibold block mb-0.5">⚙️ Operating Systems (SYSC 4005)</span>
                        <span className="text-zinc-400">Virtual memory paging, inode filesystems, lock-free concurrency.</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Lumentum */}
                  <div className="border-b border-zinc-800/80 pb-3">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span>Lumentum</span>
                        <span className="text-zinc-400 font-normal">·</span>
                        <span className="text-emerald-400 font-medium text-xs">Software Developer (Co-op)</span>
                      </h2>
                      <span className="text-xs font-mono text-zinc-300">May 2026 – Present</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-0.5">Ottawa, ON · Systems Software & Verification</p>

                    <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-zinc-200 pl-4 list-disc marker:text-emerald-400">
                      <li>
                        <strong className="text-white font-semibold">Automated Linux Validation:</strong> Validated system software by automating test harness execution and diagnostic log parsing across 10+ configurations, <span className="text-emerald-300 font-semibold">reducing manual regression duration by 35%</span>.
                      </li>
                      <li>
                        <strong className="text-white font-semibold">Mutual TLS (mTLS) Security:</strong> Implemented bidirectional X.509 certificate validation between host daemons and client endpoints to enforce strict authentication.
                      </li>
                      <li>
                        <strong className="text-white font-semibold">State Isolation & Storage Reduction:</strong> Built C# filesystem event monitoring service & Go backend pipelines validating declarative prototext persistence, <span className="text-emerald-300 font-semibold">cutting snapshot storage overhead by 88%</span>.
                      </li>
                    </ul>
                  </div>

                  {/* TELUS */}
                  <div className="border-b border-zinc-800/80 pb-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-bold text-white">
                        TELUS Go Sales <span className="text-zinc-400 font-normal">· Sales Representative</span>
                      </h3>
                      <span className="text-xs font-mono text-zinc-300">Jul 2023 – Aug 2023</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                      Communicated technical network specifications, hardware requirements, and client advisory in Calgary, AB.
                    </p>
                  </div>

                  {/* Coursework & Low-Level Foundations */}
                  <div>
                    <p className="text-xs font-mono uppercase text-zinc-300 tracking-wider mb-2 font-semibold">
                      Coursework & Low-Level Foundations:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                        ⚡ Real-Time Systems (Rate-Monotonic)
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                        🛡️ Network & Software Security (iptables)
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                        🔌 ARM SoC Design (UART/I2C/SPI)
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 font-medium">
                        ⚙️ CPU Scheduling & POSIX IPC
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default MacbookShowcase
