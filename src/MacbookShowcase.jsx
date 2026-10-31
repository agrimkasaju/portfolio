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
  // Apple-style Closed-Lid to Open-Display state
  const [isLidOpen, setIsLidOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)
  const sectionRef = useRef(null)

  // Wallpaper index state (synced with theme: Matterhorn for dark, Sunrise for light)
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState(() => (isDark ? 0 : 2))

  // Which window has focus (higher z-index): 'about' | 'experience'
  const [activeWindow, setActiveWindow] = useState('about')
  // Window minimize states
  const [minimized, setMinimized] = useState({ about: false, experience: false })
  // Window maximized states
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

  // Automatic Apple-Style Scroll Reveal:
  // Starts closed, and as the user scrolls to the section, smoothly hinges open into the bigger picture view
  useEffect(() => {
    if (hasAutoOpened) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasAutoOpened) {
          setHasAutoOpened(true)
          // Brief beat to appreciate closed MacBook lid, then open smoothly
          const openTimer = setTimeout(() => {
            setIsLidOpen(true)
          }, 350)

          return () => clearTimeout(openTimer)
        }
      },
      { threshold: 0.25 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasAutoOpened])

  // Expand container into "bigger picture view" as lid unfolds
  useEffect(() => {
    if (isLidOpen) {
      const expandTimer = setTimeout(() => {
        setIsExpanded(true)
      }, 300)
      return () => clearTimeout(expandTimer)
    } else {
      setIsExpanded(false)
    }
  }, [isLidOpen])

  // Toggle lid manually (Close Lid / Open Display)
  const toggleLid = () => {
    setIsLidOpen((prev) => !prev)
  }

  // Cycle through classic wallpapers from wallpapercave
  const cycleWallpaper = () => {
    setActiveWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length)
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

  const toggleMinimize = (windowKey, e) => {
    e.stopPropagation()
    setMinimized((prev) => ({ ...prev, [windowKey]: !prev[windowKey] }))
  }

  const toggleMaximize = (windowKey, e) => {
    e.stopPropagation()
    setMaximized((prev) => ({ ...prev, [windowKey]: !prev[windowKey] }))
    setActiveWindow(windowKey)
  }

  const restoreWindow = (windowKey, e) => {
    e.stopPropagation()
    setMinimized((prev) => ({ ...prev, [windowKey]: false }))
    setActiveWindow(windowKey)
    if (!isLidOpen) setIsLidOpen(true)
  }

  const currentWallpaper = WALLPAPERS[activeWallpaperIndex]

  return (
    <section ref={sectionRef} className="fadeup-item fadeup-2 mb-8">
      {/* Section Header with Apple-Style Interactive Controls */}
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

        {/* Apple Keynote Style Lid Toggle Button */}
        <button
          type="button"
          onClick={toggleLid}
          className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-zinc-700/80 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          title={isLidOpen ? 'Click to close MacBook lid' : 'Click to open MacBook display'}
        >
          <i className={`fa-solid ${isLidOpen ? 'fa-laptop' : 'fa-laptop-code'} text-blue-400 text-xs`}></i>
          <span>{isLidOpen ? 'Close Lid' : 'Open Display'}</span>
        </button>
      </div>

      {/* --- APPLE MACBOOK 3D HERO SHOWCASE (Positioned like apple.com/ca) --- */}
      <div
        className={`relative mx-auto select-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded ? 'w-full max-w-5xl' : 'w-full max-w-4xl'
        }`}
        style={{
          perspective: '1600px',
          perspectiveOrigin: '50% 85%'
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

        {/* Laptop Screen Lid / Shell with 3D Folding Transform */}
        <div
          className="relative rounded-t-2xl sm:rounded-t-3xl p-2 sm:p-2.5 pb-0 border shadow-2xl z-20"
          style={{
            backgroundColor: '#161922',
            borderColor: isDark ? '#2d3345' : '#3c455c',
            transformOrigin: 'bottom center',
            transform: isLidOpen
              ? 'rotateX(0deg) translateZ(0px)'
              : 'rotateX(-78deg) translateZ(0px)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.2s ease, max-width 1s ease',
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

          {/* Display Area (Liquid Retina Display with Classic Mac Wallpaper & Bigger Picture View) */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Interactive MacBook Liquid Retina Display"
            className="relative w-full overflow-hidden rounded-t-lg transition-all duration-700 outline-none"
            style={{
              minHeight: isExpanded ? '520px' : '440px',
              height: isExpanded ? '530px' : '470px',
              backgroundImage: `url(${currentWallpaper.path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* --- CLOSED LID EXTERIOR SHELL FACE (Visible when Lid is Closed) --- */}
            <div
              className={`absolute inset-0 z-45 rounded-t-lg transition-opacity duration-700 flex flex-col items-center justify-center select-none ${
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

              {/* Centered Mirrored Apple Logo */}
              <div className="relative flex flex-col items-center text-center">
                <span
                  className="text-5xl sm:text-6xl text-zinc-200 transition-transform duration-500"
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.28)) drop-shadow(0 0 25px rgba(56, 189, 248, 0.2))'
                  }}
                >
                  
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-300 mt-3 font-semibold">
                  MacBook Pro
                </span>
                <span className="text-[10px] font-mono text-zinc-400 opacity-70 mt-0.5">
                  Liquid Retina XDR Display
                </span>
              </div>
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

            {/* macOS Top Menu Bar */}
            <div className="relative z-30 h-7 px-3 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] text-zinc-300">
              {/* Left Side: Apple Branding + Sun/Moon Glare Diffused Inactive Menu Items */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-xs hover:opacity-80 cursor-pointer"></span>
                <span className="font-semibold text-white tracking-tight">KasajuOS</span>

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
                  onClick={(e) => {
                    e.stopPropagation()
                    setMobileTab('about')
                    setActiveWindow('about')
                    setMinimized((prev) => ({ ...prev, about: false }))
                  }}
                  className={`flex-1 py-1 text-[11px] font-mono rounded flex items-center justify-center gap-1.5 ${
                    mobileTab === 'about'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>ABOUT_ME.md</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMobileTab('experience')
                    setActiveWindow('experience')
                    setMinimized((prev) => ({ ...prev, experience: false }))
                  }}
                  className={`flex-1 py-1 text-[11px] font-mono rounded flex items-center justify-center gap-1.5 ${
                    mobileTab === 'experience'
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
              {/* Background Desktop App Icons */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-3 select-none pointer-events-none opacity-40 hidden sm:flex">
                <div className="flex flex-col items-center gap-1 w-16 group">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-blue-400 shadow-md">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-zinc-300 font-mono text-center px-1 rounded bg-black/40 group-hover:bg-blue-600/60 leading-tight">
                    ABOUT_ME.md
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 w-16 group">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-emerald-400 shadow-md">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-zinc-300 font-mono text-center px-1 rounded bg-black/40 group-hover:bg-emerald-600/60 leading-tight">
                    EXPERIENCE.md
                  </span>
                </div>
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
              {isLidOpen && !minimized.about && (
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
                          onClick={(e) => toggleMinimize('about', e)}
                          className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] cursor-pointer"
                          title="Close"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleMinimize('about', e)}
                          className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123] cursor-pointer"
                          title="Minimize"
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
              {isLidOpen && !minimized.experience && (
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
                          onClick={(e) => toggleMinimize('experience', e)}
                          className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] cursor-pointer"
                          title="Close"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleMinimize('experience', e)}
                          className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123] cursor-pointer"
                          title="Minimize"
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

        {/* Laptop Hinge & Lower Aluminum Deck (Precision Apple Proportions) */}
        <div className="relative w-full z-15">
          {/* Display Hinge Bar with Dark Recessed Glass Joint */}
          <div
            onClick={toggleLid}
            title={isLidOpen ? 'Click hinge to close lid' : 'Click hinge to open display'}
            className="mx-auto w-[94%] h-1.5 sm:h-2 bg-zinc-950 border-x border-zinc-800 rounded-t-xs cursor-pointer hover:bg-zinc-900 transition-colors"
          ></div>

          {/* Aluminum Lower Chassis (MacBook Base Deck) */}
          <div
            className="relative w-full h-5 sm:h-6 rounded-b-xl sm:rounded-b-2xl border-t flex items-start justify-center shadow-2xl transition-all duration-300"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, #323846 0%, #20242e 45%, #14171e 100%)'
                : 'linear-gradient(180deg, #3d4556 0%, #282e3c 45%, #1b1f28 100%)',
              borderColor: isDark ? '#434b5c' : '#4d576e',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Precision CNC Center Thumb Notch for opening lid */}
            <div
              onClick={toggleLid}
              className="w-28 sm:w-36 h-2 sm:h-2.5 bg-zinc-950 rounded-b-md border-t border-zinc-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer hover:border-blue-400 transition-colors"
              title={isLidOpen ? 'Close Lid' : 'Open Display'}
            ></div>
          </div>

          {/* Apple Dual-Stage Desk Surface Drop Shadow */}
          <div className="mx-auto w-[88%] h-4 bg-black/60 blur-xl rounded-full -mt-1"></div>
          <div className="mx-auto w-[70%] h-6 bg-black/40 blur-2xl rounded-full -mt-3"></div>
        </div>
      </div>
    </section>
  )
}

export default MacbookShowcase
