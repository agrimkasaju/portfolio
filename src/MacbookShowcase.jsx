import React, { useState, useEffect } from 'react'

export const MacbookShowcase = () => {
  // State: whether windows are opened (triggered by click)
  const [isOpen, setIsOpen] = useState(false)
  // Which window has focus (higher z-index): 'about' | 'experience'
  const [activeWindow, setActiveWindow] = useState('about')
  // Simulated click state for cursor animation
  const [isClicking, setIsClicking] = useState(false)
  // Window minimize states
  const [minimized, setMinimized] = useState({ about: false, experience: false })
  // Window maximized states
  const [maximized, setMaximized] = useState({ about: false, experience: false })
  // View mode: 'laptop' or 'classic'
  const [viewMode, setViewMode] = useState('laptop')
  // Active mobile tab when on small screens
  const [mobileTab, setMobileTab] = useState('about')

  // Trigger the opening animation with a realistic mouse click sequence
  const triggerOpen = () => {
    if (isOpen) return
    setIsClicking(true)
    setTimeout(() => {
      setIsOpen(true)
      setIsClicking(false)
      setActiveWindow('about')
    }, 280)
  }

  // Replay animation
  const handleReplay = (e) => {
    e.stopPropagation()
    setIsOpen(false)
    setMinimized({ about: false, experience: false })
    setMaximized({ about: false, experience: false })
    setTimeout(() => {
      triggerOpen()
    }, 200)
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
    if (!isOpen) setIsOpen(true)
  }

  return (
    <section className="fadeup-item fadeup-2 mb-6">
      {/* Header Bar with View Mode Toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></span>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Engineering Profile & Experience</span>
            <span className="hidden sm:inline-block text-[11px] font-mono font-normal text-zinc-500 dark:text-zinc-400">
              Interactive Workspace
            </span>
          </h2>
        </div>

        {/* View Switcher: Laptop Demo vs Standard Card View */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setViewMode('laptop')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'laptop'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M2 20h20" />
            </svg>
            <span>MacBook View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('classic')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'classic'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            <span>Classic Cards</span>
          </button>
        </div>
      </div>

      {viewMode === 'classic' ? (
        /* Classic Grid Fallback */
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-3 md:items-stretch">
          <article className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold mb-2.5 pb-1 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span>About Me</span>
                <span className="text-[11px] font-mono font-normal text-zinc-500">Systems · AI · Reliability</span>
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 text-zinc-700 dark:text-zinc-300">
                I am a fourth-year <strong>Computer Systems Engineering</strong> student at Carleton University (Dean's Honour List, GPA 3.33/4.0) with hands-on production experience in Linux systems software, automated CI verification pipelines, and edge AI deployment.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 text-zinc-700 dark:text-zinc-300">
                Currently working as a <strong>Software Developer (Co-op) at Lumentum</strong>, I validate Linux system software by automating test harness execution and diagnostic log parsing (reducing manual regression duration by 35%), construct automated verification pipelines in Python and Bash across 10+ target Linux configurations, implement bidirectional X.509 certificate validation and mTLS handshakes between daemons and client endpoints, and develop C# filesystem event-monitoring services coordinating with Go backend pipelines to isolate snapshot state and reduce storage overhead by 88%.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed mb-3 text-zinc-700 dark:text-zinc-300">
                On the engineering front, I specialize in building high-throughput and low-latency systems. My applied work spans autonomous agentic orchestration (<a href="https://github.com/agrimkasaju/Anubis" className="font-semibold underline" style={{ color: 'var(--accent-color)' }}>Anubis</a> with streaming Orion ONNX wake-word detection), embedded INT8 quantized TensorFlow Lite inference on Raspberry Pi (<a href="https://github.com/agrimkasaju/Smart-Inventory-System" className="font-semibold underline" style={{ color: 'var(--accent-color)' }}>Smart Inventory</a>, reducing precision from 32-bit floats to 8-bit integers to shrink memory by 75% and boost throughput to 15–20 FPS), role-based cryptographic authentication (<a href="https://github.com/agrimkasaju/bcrypt_password_hashing" className="font-semibold underline" style={{ color: 'var(--accent-color)' }}>RBAC Auth</a> with bcrypt 12 salt rounds and immutable JSON Lines audit logs), and POSIX concurrent CPU scheduling in C/C++.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                I prioritize clean architectures, deterministic hardware benchmarks, and dependable low-level execution that survives hostile edge environments and high thread contention.
              </p>
            </div>
          </article>

          <div className="flex flex-col gap-3">
            <aside className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold mb-2.5 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                Experience
              </h2>
              <div className="space-y-3">
                <div className="border-l-2 pl-3" style={{ borderColor: 'var(--accent-color)' }}>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Software Developer (Co-op)</p>
                  <p className="text-[11px] text-zinc-500">Lumentum · Ottawa, ON <span className="float-right font-mono">May 2026 – Present</span></p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-normal">
                    Automated Linux validation across 10+ configurations (-35% test duration), bidirectional X.509 mTLS daemon authentication, and C#/Go event services cutting snapshot storage overhead by 88%.
                  </p>
                </div>
                <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Sales Representative</p>
                  <p className="text-[11px] text-zinc-500">TELUS Go Sales · Calgary, AB <span className="float-right font-mono">2023</span></p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-normal">
                    Translated complex technical product information and supported high-touch customer consultations.
                  </p>
                </div>
              </div>
            </aside>

            <aside className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold mb-2 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                Education
              </h2>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Carleton University</p>
                <p className="text-[11px] text-zinc-500">B.Eng in Computer Systems <span className="float-right font-mono">2022 – 2028</span></p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                  GPA 3.33/4.0 · Dean's Honour List (2024–2025)
                </p>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        /* --- APPLE MACBOOK INTERACTIVE SHOWCASE --- */
        <div className="relative w-full max-w-4xl mx-auto select-none">
          {/* Laptop Screen Lid / Shell */}
          <div
            className="relative rounded-t-2xl sm:rounded-t-3xl p-2 sm:p-3 pb-0 border transition-all duration-300 shadow-2xl"
            style={{
              backgroundColor: '#161922',
              borderColor: '#2d3345',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px -10px var(--accent-glow)'
            }}
          >
            {/* Top Camera Bezel / Notch */}
            <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-2.5 sm:h-3.5 bg-black rounded-b-md flex items-center justify-center gap-1.5 z-40">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
              <div className="w-1 h-1 rounded-full bg-emerald-400/90 shadow-[0_0_4px_#34d399]"></div>
            </div>

            {/* Display Area (16:10 Laptop Aspect Ratio) */}
            <div
              tabIndex={0}
              role="button"
              aria-label="Interactive MacBook display workspace"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (!isOpen) triggerOpen()
                }
              }}
              onClick={!isOpen ? triggerOpen : undefined}
              className={`relative w-full overflow-hidden rounded-t-lg transition-all duration-300 outline-none focus:ring-1 focus:ring-blue-400/40 ${
                !isOpen ? 'cursor-pointer' : ''
              }`}
              style={{
                minHeight: '440px',
                height: '470px',
                background: 'radial-gradient(ellipse at 50% 20%, #1e2638 0%, #0c101a 50%, #06080e 100%)'
              }}
            >
              {/* Subtle Cosmic Grid / Ambient Glow */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

              {/* macOS Top Menu Bar */}
              <div className="relative z-30 h-6 px-3 bg-zinc-950/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] text-zinc-300">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-xs hover:opacity-80 cursor-pointer"></span>
                  <span className="font-semibold text-white">KasajuOS</span>
                  <span className="hidden sm:inline text-zinc-400 hover:text-white cursor-pointer">File</span>
                  <span className="hidden sm:inline text-zinc-400 hover:text-white cursor-pointer">Edit</span>
                  <span className="hidden sm:inline text-zinc-400 hover:text-white cursor-pointer">View</span>
                  <span className="hidden sm:inline text-zinc-400 hover:text-white cursor-pointer">Window</span>
                </div>

                <div className="flex items-center gap-2.5 text-[10px] text-zinc-400">
                  {isOpen && (
                    <button
                      type="button"
                      onClick={handleReplay}
                      title="Replay click animation"
                      className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="hidden sm:inline">Replay</span>
                    </button>
                  )}
                  <span className="font-mono text-zinc-300">100%</span>
                  <svg className="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 14.5c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5s5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5z"/>
                  </svg>
                  <span className="font-mono text-zinc-200">Ottawa · 9:41 AM</span>
                </div>
              </div>

              {/* Mobile Window Switcher Tabs (Visible under 640px) */}
              {isOpen && (
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
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400'
                    }`}
                  >
                    <span>📄 ABOUT_ME.md</span>
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
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400'
                    }`}
                  >
                    <span>📄 EXPERIENCE.md</span>
                  </button>
                </div>
              )}

              {/* Desktop Workspace */}
              <div className="relative w-full h-[calc(100%-24px)] p-3 sm:p-4 overflow-hidden">
                {/* Desktop Background Files (Icons) */}
                <div className="absolute top-4 left-4 flex flex-col gap-4 z-10">
                  <div
                    onClick={(e) => restoreWindow('about', e)}
                    className="flex flex-col items-center gap-1 w-16 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/80 group-hover:border-blue-400 flex items-center justify-center shadow-lg transition-all">
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                  <div
                    onClick={(e) => restoreWindow('experience', e)}
                    className="flex flex-col items-center gap-1 w-16 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/80 group-hover:border-emerald-400 flex items-center justify-center shadow-lg transition-all">
                      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                {/* --- INITIAL UNOPENED STATE: APPLE-STYLE MOUSE CLICK INVITATION --- */}
                {!isOpen && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-25 bg-black/20 backdrop-blur-[2px] transition-all">
                    {/* Simulated Animated Cursor */}
                    <div className="relative flex flex-col items-center group animate-cursor-float">
                      <div
                        className={`relative transition-transform duration-200 ${
                          isClicking ? 'scale-90' : 'scale-100 hover:scale-105'
                        }`}
                      >
                        {/* Apple-style macOS Cursor SVG */}
                        <svg
                          className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter transition-all animate-bounce"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 2l14 11-6.5.7L15 21l-3 1.2-3.6-7.4L4 18V2z" stroke="#000" strokeWidth="1.2" />
                        </svg>

                        {/* Ripple Effect Ring when Clicking */}
                        <div
                          className={`absolute -inset-2 rounded-full border-2 border-blue-400 transition-all ${
                            isClicking ? 'scale-150 opacity-100' : 'opacity-0 scale-75'
                          }`}
                        ></div>
                      </div>

                      {/* Interactive Prompt Badge */}
                      <div className="mt-3 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-100 text-xs font-semibold shadow-2xl flex items-center gap-2 hover:border-blue-400 transition-all group-hover:shadow-[0_0_20px_var(--accent-glow)]">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                        <span>Click to open workspace</span>
                        <span className="text-[10px] font-mono opacity-60">⌘ Enter</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                        Reveals README.md & EXPERIENCE.md in macOS windows
                      </p>
                    </div>
                  </div>
                )}

                {/* --- WINDOW 1: ABOUT_ME.md (Opened Markdown Application) --- */}
                {isOpen && !minimized.about && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveWindow('about')
                      setMobileTab('about')
                    }}
                    className={`absolute transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl flex flex-col ${
                      maximized.about
                        ? 'inset-1 z-35'
                        : 'left-3 sm:left-6 top-3 sm:top-4 w-[94%] sm:w-[58%] h-[82%] sm:h-[84%]'
                    } ${
                      activeWindow === 'about'
                        ? 'z-30 ring-1 ring-blue-500/30 border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                        : 'z-20 border-zinc-800/80 opacity-95 hover:opacity-100'
                    } ${
                      /* Mobile responsiveness tab visibility */
                      mobileTab !== 'about' ? 'hidden sm:flex' : 'flex'
                    }`}
                    style={{
                      backgroundColor: '#0d1117',
                      transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
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
                            title="Maximize"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 ml-1 flex items-center gap-1">
                          <span className="text-blue-400">#</span> ABOUT_ME.md
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-500">
                        ~/kasaju/ABOUT_ME.md · UTF-8
                      </div>
                    </div>

                    {/* Window Markdown Editor Content Area */}
                    <div className="p-3.5 sm:p-4 overflow-y-auto mac-scrollbar text-xs leading-relaxed text-zinc-200 font-sans space-y-2.5">
                      <div className="border-b border-zinc-800 pb-2">
                        <div className="flex items-center justify-between">
                          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            <span>Agrim Kasaju</span>
                            <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              v4.0.26
                            </span>
                          </h1>
                          <span className="text-[10px] font-mono text-emerald-400">● AVAILABLE FOR ROLES</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 font-mono mt-0.5">
                          B.Eng Computer Systems Engineering @ Carleton University · GPA 3.33/4.0
                        </p>
                      </div>

                      {/* Markdown Content Blocks */}
                      <div className="space-y-2">
                        <p className="text-zinc-200">
                          Fourth-year engineering student with hands-on production experience in Linux systems software, automated verification harnesses, and edge AI deployment.
                        </p>

                        <div className="p-2.5 rounded bg-zinc-900/90 border border-zinc-700/80 font-mono text-[11px] text-zinc-200">
                          <p className="text-blue-300 font-bold mb-1">// Architectural Philosophy</p>
                          <p className="leading-normal text-zinc-200">
                            High-throughput, low-latency execution that survives hostile edge environments, high thread contention, and deterministic timing constraints.
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-white text-[11px] uppercase tracking-wider mb-1 font-mono text-zinc-300">
                            Core Engineering Stack:
                          </p>
                          <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-100">C/C++</span>
                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-100">Go</span>
                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-100">Python</span>
                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-100">Linux POSIX APIs</span>
                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-100">ONNX / TFLite INT8</span>
                            <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-100">mTLS & X.509</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-300 flex items-center justify-between">
                          <span>Dean's Honour List (2024–2025)</span>
                          <span className="text-zinc-400 font-mono">EOF · 42 lines</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- WINDOW 2: EXPERIENCE.md (Opened Markdown Application — Offset / Asymmetric) --- */}
                {isOpen && !minimized.experience && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveWindow('experience')
                      setMobileTab('experience')
                    }}
                    className={`absolute transition-all duration-300 rounded-xl overflow-hidden border shadow-2xl flex flex-col ${
                      maximized.experience
                        ? 'inset-1 z-35'
                        : 'right-3 sm:right-6 top-8 sm:top-10 w-[94%] sm:w-[60%] h-[82%] sm:h-[84%]'
                    } ${
                      activeWindow === 'experience'
                        ? 'z-30 ring-1 ring-emerald-500/30 border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                        : 'z-20 border-zinc-800/80 opacity-95 hover:opacity-100'
                    } ${
                      /* Mobile responsiveness tab visibility */
                      mobileTab !== 'experience' ? 'hidden sm:flex' : 'flex'
                    }`}
                    style={{
                      backgroundColor: '#0a0e14',
                      transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
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

          {/* Laptop Hinge & Lower Aluminum Deck */}
          <div className="relative w-full">
            {/* Display Hinge Bar */}
            <div className="mx-auto w-[92%] h-1 sm:h-1.5 bg-zinc-900 border-x border-zinc-800"></div>

            {/* Aluminum Lower Chassis (MacBook Base Deck) */}
            <div
              className="relative w-full h-4 sm:h-5 rounded-b-xl sm:rounded-b-2xl border-t flex items-start justify-center shadow-xl"
              style={{
                background: 'linear-gradient(180deg, #323846 0%, #222630 50%, #16181f 100%)',
                borderColor: '#434b5c'
              }}
            >
              {/* Center Thumb Notch for opening lid */}
              <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-zinc-950/90 rounded-b-md border-t border-zinc-700/80 shadow-inner"></div>
            </div>

            {/* Laptop Desk Drop Shadow */}
            <div className="mx-auto w-[82%] h-3 bg-black/50 blur-lg rounded-full mt-0.5"></div>
          </div>
        </div>
      )}
    </section>
  )
}

export default MacbookShowcase
