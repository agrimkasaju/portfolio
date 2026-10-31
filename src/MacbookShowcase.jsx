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
  const [isLidOpen, setIsLidOpen] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)
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

  // Real-time live clock state
  const [currentTime, setCurrentTime] = useState('')
  // Real-time location state
  const [userLocation, setUserLocation] = useState(getInitialTimezoneCity)
  // Location permission modal state
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false)

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

  // Request actual geolocation from browser
  const handleRequestLocation = (e) => {
    if (e) e.stopPropagation()
    setIsLocating(true)
    setLocationPermissionAsked(true)

    if (!navigator.geolocation) {
      setIsLocating(false)
      setShowLocationPrompt(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept': 'application/json' } }
          )
          if (res.ok) {
            const data = await res.json()
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.suburb
            const state =
              data.address?.['ISO3166-2-lvl4']?.split('-')[1] ||
              data.address?.state ||
              data.address?.country_code?.toUpperCase()
            if (city && state) {
              setUserLocation(`${city}, ${state}`)
            } else if (city) {
              setUserLocation(city)
            }
          }
        } catch (err) {
          console.warn('Reverse geocode fallback to timezone', err)
        } finally {
          setIsLocating(false)
          setShowLocationPrompt(false)
        }
      },
      (err) => {
        console.warn('Geolocation permission denied or timeout', err)
        setIsLocating(false)
        setShowLocationPrompt(false)
      },
      { timeout: 7000 }
    )
  }

  const handleDenyLocation = (e) => {
    if (e) e.stopPropagation()
    setLocationPermissionAsked(true)
    setShowLocationPrompt(false)
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

      {/* Spacious Bounding Box - Prevents 3D Lid Clipping & Enables Smooth Camera Zoom */}
      <div className="relative w-full py-8 sm:py-12 px-2 sm:px-6 overflow-visible flex items-center justify-center">
        {/* --- APPLE MACBOOK 3D HERO SHOWCASE (Positioned with Authentic Asymmetrical Base Depth) --- */}
        <div
          className="relative w-full max-w-5xl mx-auto select-none overflow-visible transition-transform duration-[4800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            perspective: '1600px',
            perspectiveOrigin: '50% 55%',
            transform: isLidOpen ? 'scale(1.0) translateY(0)' : 'scale(0.80) translateY(24px)',
            transformOrigin: 'center center'
          }}
        >
          {/* Left-Hand External Ambient Light Source (Simulates off-screen Moon/Sun illuminating the workspace) */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -left-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 z-0"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(147, 197, 253, 0.16) 0%, rgba(96, 165, 250, 0.05) 50%, transparent 75%)'
                : 'radial-gradient(circle, rgba(253, 224, 71, 0.22) 0%, rgba(251, 191, 36, 0.07) 50%, transparent 75%)'
            }}
          />

          {/* Laptop Screen Lid / Shell with Slow 3D Folding Transform (Takes 4.8s to open) */}
          <div
            className="relative rounded-t-2xl sm:rounded-t-3xl p-2 sm:p-2.5 pb-0 border shadow-2xl z-20"
            style={{
              backgroundColor: '#161922',
              borderColor: isDark ? '#2d3345' : '#3c455c',
              transformOrigin: 'bottom center',
              transform: isLidOpen
                ? 'rotateX(0deg) translateZ(0px)'
                : 'rotateX(-82deg) translateZ(0px)',
              transition: 'transform 4800ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 4800ms ease',
              transformStyle: 'preserve-3d',
              boxShadow: isLidOpen
                ? isDark
                  ? '0 30px 70px -15px rgba(0, 0, 0, 0.8), -6px -6px 28px -10px rgba(186, 230, 253, 0.15)'
                  : '0 30px 70px -15px rgba(0, 0, 0, 0.8), -6px -6px 28px -10px rgba(254, 240, 138, 0.22)'
                : '0 15px 35px -5px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* Top Camera Bezel / Notch */}
            <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-2.5 sm:h-3.5 bg-black rounded-b-md flex items-center justify-center gap-1.5 z-40">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
              <div className="w-1 h-1 rounded-full bg-emerald-400/90 shadow-[0_0_4px_#34d399]"></div>
            </div>

            {/* Display Area (Liquid Retina Display with Classic Mac Wallpaper) */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Interactive MacBook Liquid Retina Display"
              className="relative w-full overflow-hidden rounded-t-lg transition-all duration-700 outline-none"
              style={{
                minHeight: '490px',
                height: '510px',
                backgroundImage: `url(${currentWallpaper.path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* --- CLOSED LID EXTERIOR SHELL FACE (Clean Minimalist Aluminum, Zero Logos & Zero Text) --- */}
              <div
                className={`absolute inset-0 z-45 rounded-t-lg transition-opacity duration-1000 flex flex-col items-center justify-center select-none ${
                  isLidOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                style={{
                  background: isDark
                    ? 'linear-gradient(145deg, #2a303d 0%, #1c202a 50%, #12141a 100%)'
                    : 'linear-gradient(145deg, #384050 0%, #262c38 50%, #1a1e27 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.6)'
                }}
              >
                {/* Aluminum Specular Sheen Diagonal Streak */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: 'linear-gradient(125deg, transparent 20%, rgba(255,255,255,0.4) 45%, transparent 60%)'
                  }}
                />
              </div>

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

                  {/* WORKING FEATURE 3: Real-Time Location & Live Clock Sync */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowLocationPrompt(true)
                    }}
                    title="Click to view or synchronize live location"
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer group shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2.5"></span>
                    <span className="font-semibold text-emerald-200 group-hover:text-white transition-colors">
                      {userLocation}
                    </span>
                    <span className="text-emerald-500 font-normal">·</span>
                    <span className="text-emerald-300 font-bold tracking-tight">
                      {currentTime || 'Syncing...'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mobile Window Switcher Tabs (Visible under 640px) */}
              {isLidOpen && (
                <div className="sm:hidden relative z-25 flex items-center bg-zinc-900/90 border-b border-zinc-800 p-1 gap-1">
                  <button
                    type="button"
                    onClick={(e) => restoreWindow('about', e)}
                    className={`flex-1 py-1 text-[11px] font-mono rounded flex items-center justify-center gap-1.5 cursor-pointer ${
                      mobileTab === 'about' && !closed.about && !minimized.about
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <span>ABOUT_ME.md</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => restoreWindow('experience', e)}
                    className={`flex-1 py-1 text-[11px] font-mono rounded flex items-center justify-center gap-1.5 cursor-pointer ${
                      mobileTab === 'experience' && !closed.experience && !minimized.experience
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <span>EXPERIENCE.md</span>
                  </button>
                </div>
              )}

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

                {/* --- macOS LOCATION PERMISSION MODAL --- */}
                {showLocationPrompt && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
                  >
                    <div className="relative w-full max-w-[290px] sm:max-w-[320px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/90 rounded-2xl p-4 sm:p-5 shadow-2xl text-center space-y-3">
                      {/* Compass / Location Icon Badge */}
                      <div className="w-11 h-11 mx-auto rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shadow-inner">
                        <svg className="w-5 h-5 text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>

                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                          "KasajuOS" Would Like to Access Your Location
                        </h3>
                        <p className="text-[11px] text-zinc-300 mt-1 leading-normal font-sans">
                          Enables real-time local city, timezone, and live clock synchronization in the macOS menu bar.
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1 font-medium text-xs">
                        <button
                          type="button"
                          onClick={handleDenyLocation}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                        >
                          Don't Allow
                        </button>
                        <button
                          type="button"
                          onClick={handleRequestLocation}
                          disabled={isLocating}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {isLocating ? (
                            <>
                              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                              <span>Syncing...</span>
                            </>
                          ) : (
                            <span>Allow</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- WINDOW 1: ABOUT_ME.md (Opened Markdown Application) --- */}
                {isLidOpen && !closed.about && !minimized.about && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveWindow('about')
                      setMobileTab('about')
                    }}
                    className={`absolute transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl flex flex-col ${
                      maximized.about
                        ? 'inset-1 z-35'
                        : 'left-3 sm:left-6 top-3 sm:top-4 w-[94%] sm:w-[57%] h-[84%] sm:h-[86%]'
                    } ${
                      activeWindow === 'about'
                        ? 'z-30 ring-1 ring-blue-500/30 border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                        : 'z-20 border-zinc-800/80 opacity-95 hover:opacity-100'
                    } ${
                      /* Mobile responsiveness tab visibility */
                      mobileTab !== 'about' ? 'hidden sm:flex' : 'flex'
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
                            onClick={(e) => toggleMaximize('about', e)}
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
                    }}
                    className={`absolute transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl flex flex-col ${
                      maximized.experience
                        ? 'inset-1 z-35'
                        : 'right-3 sm:right-6 top-6 sm:top-7 w-[94%] sm:w-[50%] h-[80%] sm:h-[84%]'
                    } ${
                      activeWindow === 'experience'
                        ? 'z-30 ring-1 ring-emerald-500/30 border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                        : 'z-20 border-zinc-800/80 opacity-95 hover:opacity-100'
                    } ${
                      /* Mobile responsiveness tab visibility */
                      mobileTab !== 'experience' ? 'hidden sm:flex' : 'flex'
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
                            onClick={(e) => toggleMaximize('experience', e)}
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

          {/* --- MACBOOK PRO LOWER UNIBODY BASE DECK (Authentic Apple Proportions & 3D Perspective) --- */}
          <div
            className="relative w-full z-10 -mt-1"
            style={{
              perspective: '1400px',
              perspectiveOrigin: '50% 10%'
            }}
          >
            {/* Rear Cylindrical Hinge Barrel */}
            <div className="mx-auto w-[96%] h-2 sm:h-2.5 bg-black border-x border-zinc-800 rounded-t-sm shadow-md"></div>

            {/* Base Chassis (Extends Forward in 3D Perspective) */}
            <div
              className="relative w-full rounded-b-2xl border-t transition-all duration-700 shadow-2xl overflow-hidden"
              style={{
                transformOrigin: 'top center',
                transform: 'rotateX(58deg)',
                transformStyle: 'preserve-3d',
                background: isDark
                  ? 'linear-gradient(180deg, #1c1f28 0%, #13161e 40%, #0b0d12 100%)'
                  : 'linear-gradient(180deg, #2b303d 0%, #1e222b 40%, #12141a 100%)',
                borderColor: isDark ? '#373e4f' : '#454e63',
                padding: '10px 16px 14px 16px',
                boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.95), 0 15px 30px -5px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Upper Deck Surface: Speaker Grilles + Keyboard Well */}
              <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-4xl mx-auto">
                {/* Left Speaker Grille */}
                <div className="w-8 sm:w-14 h-20 sm:h-24 rounded bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:3px_3px] opacity-40 shrink-0"></div>

                {/* Recessed Anodized Aluminum Keyboard Well */}
                <div className="flex-1 h-20 sm:h-24 bg-[#0a0b0e] border border-zinc-800/90 rounded-lg p-1.5 sm:p-2 shadow-inner flex flex-col justify-between select-none">
                  {/* Function Keys Row */}
                  <div className="flex gap-1 h-2.5 sm:h-3">
                    <div className="w-4 sm:w-6 bg-zinc-900 border border-zinc-800 rounded-[2px] text-[6px] text-zinc-500 flex items-center justify-center">esc</div>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    ))}
                    <div className="w-4 sm:w-6 bg-zinc-950 border border-zinc-700/80 rounded-[2px] shadow-inner"></div>
                  </div>

                  {/* Number Row */}
                  <div className="flex gap-1 h-3 sm:h-3.5">
                    <div className="w-4 sm:w-5 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    ))}
                    <div className="w-5 sm:w-7 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                  </div>

                  {/* QWERTY Row */}
                  <div className="flex gap-1 h-3 sm:h-3.5">
                    <div className="w-5 sm:w-7 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    ))}
                    <div className="w-4 sm:w-5 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                  </div>

                  {/* Home Row (ASDF) */}
                  <div className="flex gap-1 h-3 sm:h-3.5">
                    <div className="w-6 sm:w-8 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    ))}
                    <div className="w-6 sm:w-9 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                  </div>

                  {/* Bottom Row (Spacebar + Modifiers) */}
                  <div className="flex gap-1 h-3.5 sm:h-4">
                    <div className="w-4 sm:w-6 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    <div className="w-4 sm:w-6 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    <div className="w-5 sm:w-7 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2px] shadow-inner"></div>
                    <div className="w-5 sm:w-7 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    <div className="w-4 sm:w-6 bg-zinc-900 border border-zinc-800 rounded-[2px]"></div>
                    <div className="w-6 sm:w-8 bg-zinc-900 border border-zinc-800 rounded-[2px] flex gap-0.5">
                      <div className="flex-1 bg-zinc-800/80 rounded-[1px]"></div>
                      <div className="flex-1 bg-zinc-800/80 rounded-[1px]"></div>
                    </div>
                  </div>
                </div>

                {/* Right Speaker Grille */}
                <div className="w-8 sm:w-14 h-20 sm:h-24 rounded bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:3px_3px] opacity-40 shrink-0"></div>
              </div>

              {/* Center Glass Force Touch Trackpad */}
              <div className="relative mx-auto mt-2 w-44 sm:w-60 h-11 sm:h-14 rounded-xl bg-zinc-900/80 border border-zinc-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 rounded-xl bg-white/[0.03] pointer-events-none"></div>
              </div>

              {/* Precision CNC Thumb Opening Scoop Notch on Front Lip */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-2 bg-zinc-950 rounded-t-md border-b border-zinc-700/80 shadow-inner"></div>
            </div>

            {/* Ambient Studio Desk Surface Drop Shadow */}
            <div className="mx-auto w-[92%] h-8 bg-black/70 blur-2xl rounded-full -mt-4"></div>
            <div className="mx-auto w-[76%] h-12 bg-black/50 blur-3xl rounded-full -mt-6"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MacbookShowcase
