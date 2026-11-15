import React, { useState, useEffect, memo } from 'react'
import { WORKSPACE_DOCS } from './portfolioData'

// Isolated Live Clock component to avoid triggering re-renders on the main canvas
const LiveClock = memo(({ userLocation }) => {
  const [currentTime, setCurrentTime] = useState('')

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

  return (
    <div
      title={`Location: ${userLocation} · Live Clock: ${currentTime}`}
      className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#252526] border border-[#3c3c3c] text-zinc-300 text-[10px] font-mono select-none"
    >
      <svg className="w-2.5 h-2.5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
      </svg>
      <span className="font-medium text-zinc-300 truncate max-w-[100px]">{userLocation}</span>
      <span className="text-zinc-600">·</span>
      <span className="font-semibold text-zinc-100 tracking-tight">{currentTime || 'Syncing...'}</span>
    </div>
  )
})

LiveClock.displayName = 'LiveClock'

/**
 * Markdown Canvas Component with Line Numbers and High-Contrast Semantic Prose
 */
const MarkdownCanvas = memo(({ docId }) => {
  const doc = WORKSPACE_DOCS[docId] || WORKSPACE_DOCS.about

  if (docId === 'about') {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mac-scrollbar select-text font-mono text-xs sm:text-[13px] leading-relaxed bg-[#1e1e1e] text-zinc-200">
        <div className="p-3 sm:p-4 space-y-3">
          {/* Header Block with Line Numbers */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-0.5">1</span>
            <div className="flex-1">
              <span className="text-[#569cd6] font-bold text-sm sm:text-base mr-1.5">#</span>
              <span className="text-[#f4f4f5] font-bold text-sm sm:text-base tracking-tight font-sans">
                {doc.title}
              </span>
              <span className="ml-2 text-[10px] font-mono text-[#38bdf8] bg-[#0c2d48] border border-[#1e4976] px-1.5 py-0.5 rounded">
                Systems Engineer
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0">2</span>
            <p className="text-[11px] text-[#9cdcfe] font-mono">
              {doc.subtitle}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-0.5">3</span>
            <p className="text-zinc-300 font-sans text-xs sm:text-[13px] leading-relaxed">
              {doc.summary}
            </p>
          </div>

          {/* Architectural Philosophy Callout */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-1">4</span>
            <div className="flex-1 p-2.5 rounded bg-[#252526] border-l-2 border-[#569cd6] border-y border-r border-[#333333]">
              <span className="text-[#6a9955] font-mono font-semibold text-[11px] block mb-1">
                {doc.philosophy.tag}
              </span>
              <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                {doc.philosophy.text}
              </p>
            </div>
          </div>

          {/* Core Engineering Stack */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-1">5</span>
            <div className="flex-1 space-y-1.5">
              <span className="text-[#4ec9b0] text-[11px] font-mono font-semibold block uppercase tracking-wider">
                // Core Engineering Stack
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {doc.coreStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-[#2d3139] border border-[#3e4451] text-[#9cdcfe] font-mono font-medium shadow-2xs hover:border-[#569cd6] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Engineering Background Section */}
          <div className="flex items-start gap-2.5 pt-2">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-0.5">6</span>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[#569cd6] font-bold">##</span>
                <span className="text-zinc-100 font-bold font-sans text-xs sm:text-sm">
                  Engineering Background & Systems Philosophy
                </span>
              </div>
              {doc.sections[0].paragraphs.map((p, idx) => (
                <p key={idx} className="text-zinc-300 font-sans text-xs sm:text-[13px] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Coursework Grid */}
          <div className="flex items-start gap-2.5 pt-1">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-0.5">7</span>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[#569cd6] font-bold">###</span>
                <span className="text-zinc-100 font-bold font-sans text-xs">
                  Academic Highlights & Systems Coursework
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {doc.sections[1].coursework.map((course) => (
                  <div
                    key={course.title}
                    className="p-2 rounded bg-[#252526] border border-[#333333] hover:border-[#4ec9b0]/60 transition-colors"
                  >
                    <span className="text-[#4ec9b0] font-semibold font-mono block mb-0.5">
                      {course.title}
                    </span>
                    <span className="text-zinc-400 font-sans text-[11px] leading-snug block">
                      {course.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // EXPERIENCE.md View
  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mac-scrollbar select-text font-mono text-xs sm:text-[13px] leading-relaxed bg-[#1e1e1e] text-zinc-200">
      <div className="p-3 sm:p-4 space-y-4">
        {/* Title Block */}
        <div className="flex items-start gap-2.5">
          <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-0.5">1</span>
          <div className="flex-1">
            <span className="text-[#569cd6] font-bold text-sm sm:text-base mr-1.5">#</span>
            <span className="text-[#f4f4f5] font-bold text-sm sm:text-base tracking-tight font-sans">
              {doc.title}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0">2</span>
          <p className="text-[11px] text-[#9cdcfe] font-mono">
            // {doc.subtitle}
          </p>
        </div>

        {/* Roles List */}
        {doc.roles.map((item, idx) => (
          <div key={item.company} className="flex items-start gap-2.5 pt-1">
            <span className="text-[#6e7681] text-[11px] select-none text-right w-5 shrink-0 pt-1">
              {idx + 3}
            </span>
            <div className="flex-1 pb-3 border-b border-[#2b2b2b] last:border-b-0 space-y-2">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.logo ? (
                    <span className="px-1.5 py-0.5 rounded bg-white border border-white/80 shrink-0 shadow-2xs">
                      <img src={item.logo} alt={item.company} className="h-3 w-auto block" />
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-[#252526] border border-[#3e4451] text-[#4ec9b0] font-mono text-[10px] font-bold">
                      {item.company}
                    </span>
                  )}
                  <span className="text-[#4ec9b0] font-medium font-sans text-xs sm:text-sm">
                    {item.role}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                  {item.period}
                </span>
              </div>

              <p className="text-[10px] sm:text-[11px] font-mono text-[#6e7681]">
                location: &quot;{item.location}&quot;
              </p>

              {/* Bullets with Git Diff Added Gutter Line */}
              <ul className="space-y-1.5 pl-1">
                {item.bullets.map((b, bIdx) => (
                  <li
                    key={bIdx}
                    className="flex items-start gap-2 border-l-2 border-[#2ea043] pl-2 py-0.5 rounded-r hover:bg-[#252526]/50 transition-colors"
                  >
                    <span className="font-sans text-xs leading-relaxed text-zinc-300">
                      <strong className="text-zinc-100 font-semibold">{b.prefix}</strong>
                      {b.text}
                      {b.highlight && (
                        <span className="text-[#34d399] font-semibold bg-[#0d2d1e] px-1 py-0.5 rounded border border-[#1b5e3f]/60 ml-0.5">
                          {b.highlight}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

MarkdownCanvas.displayName = 'MarkdownCanvas'

/**
 * Editor Group Component (Tab Bar + Breadcrumbs + Editor Canvas)
 */
const EditorGroup = memo(({
  activeTab,
  onSelectTab,
  isSplitView,
  onToggleSplit,
  availableTabs = ['about', 'experience']
}) => {
  const currentDoc = WORKSPACE_DOCS[activeTab] || WORKSPACE_DOCS.about

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#1e1e1e] overflow-hidden">
      {/* Editor Tab Bar */}
      <div className="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between select-none shrink-0 overflow-x-auto mac-scrollbar">
        <div className="flex items-center h-full">
          {availableTabs.map((tabKey) => {
            const doc = WORKSPACE_DOCS[tabKey]
            const isActive = activeTab === tabKey
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => onSelectTab(tabKey)}
                className={`h-full min-h-[36px] px-3 flex items-center gap-1.5 text-xs font-mono border-r border-[#2b2b2b] cursor-pointer transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[#1e1e1e] text-zinc-100 border-t-2 border-t-[#007acc] font-medium'
                    : 'bg-[#181818] text-zinc-400 hover:text-zinc-200 hover:bg-[#202020]'
                }`}
              >
                {/* Markdown Icon M-down */}
                <span style={{ color: doc.iconColor }} className="text-[11px] font-bold">
                  M↓
                </span>
                <span>{doc.filename}</span>
              </button>
            )
          })}
        </div>

        {/* Split View Action Tool */}
        <div className="flex items-center gap-1 px-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSplit}
            title={isSplitView ? "Close Split View" : "Split Editor Right"}
            className="p-1 rounded hover:bg-[#2d2d2d] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 3h5.5v10H2V3zm12 10H8.5V3H14v10z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Breadcrumbs Bar */}
      <div className="h-6 px-3 bg-[#1e1e1e] border-b border-[#252526] flex items-center gap-1 text-[11px] font-mono text-zinc-400 select-none shrink-0 overflow-hidden">
        {currentDoc.breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            {idx > 0 && <span className="text-zinc-600">›</span>}
            <span className={idx === currentDoc.breadcrumbs.length - 1 ? 'text-zinc-200 font-medium' : ''}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Editor Content Area */}
      <MarkdownCanvas docId={activeTab} />
    </div>
  )
})

EditorGroup.displayName = 'EditorGroup'

/**
 * Main Visual Studio Code Interface Workspace
 */
export const VSCodeWorkspace = ({
  isDark = true,
  toggleTheme,
  isDisplayZoomed = false,
  enterDisplayZoom,
  exitDisplayZoom,
  userLocation = 'Ottawa, ON',
  isMobile = false
}) => {
  // Mobile defaults to single tab view; desktop defaults to side-by-side split view
  const [isSplitView, setIsSplitView] = useState(!isMobile)
  const [activeFileId, setActiveFileId] = useState('about')
  const [isExplorerOpen, setIsExplorerOpen] = useState(false)

  // Keep split view synchronized if device switches
  useEffect(() => {
    if (isMobile) {
      setIsSplitView(false)
      setIsExplorerOpen(false)
    }
  }, [isMobile])

  return (
    <div
      className="relative w-full h-full flex flex-col bg-[#181818] text-zinc-200 overflow-hidden select-none border border-[#2b2b2b] rounded-lg shadow-2xl"
      style={{
        contain: 'paint',
        overflow: 'hidden'
      }}
    >
      {/* 1. VS Code Title Bar */}
      <div className="h-9 px-2 sm:px-3 bg-[#1f1f1f] border-b border-[#2b2b2b] flex items-center justify-between text-xs select-none shrink-0 z-30">
        {/* Left: macOS Window Controls + App Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 border border-[#e0443e] cursor-pointer"
              title="Close window"
            />
            <button
              type="button"
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-[#dea123] cursor-pointer"
              title="Minimize window"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (isDisplayZoomed) exitDisplayZoom(e)
                else enterDisplayZoom(activeFileId, e)
              }}
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 border border-[#1aab29] cursor-pointer"
              title={isDisplayZoomed ? "Exit zoom to desk view" : "Zoom onto screen"}
            />
          </div>

          <span className="hidden md:inline font-mono text-[11px] text-zinc-400 tracking-tight">
            agrim-kasaju — Visual Studio Code
          </span>
        </div>

        {/* Center: Command Palette Pill */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (!isDisplayZoomed) enterDisplayZoom(activeFileId, e)
          }}
          className="flex items-center gap-2 px-3 py-1 rounded bg-[#252526] border border-[#383838] text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:border-[#007acc] transition-all cursor-pointer shadow-2xs max-w-[240px] sm:max-w-[320px] truncate"
        >
          <svg className="w-3 h-3 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="truncate">kasaju-portfolio [main]</span>
          <span className="hidden sm:inline text-[9px] px-1 py-0.2 rounded bg-[#333333] text-zinc-400">Ctrl+P</span>
        </div>

        {/* Right: Integrated Workspace Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Screen / Desk View Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (isDisplayZoomed) exitDisplayZoom(e)
              else enterDisplayZoom(activeFileId, e)
            }}
            title={isDisplayZoomed ? "Return to 3D Desk View (Esc)" : "Zoom onto Screen"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer shadow-xs ${
              isDisplayZoomed
                ? 'bg-[#007acc] hover:bg-[#0062a3] text-white font-semibold ring-1 ring-blue-400/50'
                : 'bg-[#252526] hover:bg-[#2d2d2d] text-zinc-200 border border-[#3c3c3c] hover:text-white'
            }`}
          >
            <span>{isDisplayZoomed ? '←' : '⤢'}</span>
            <span>{isDisplayZoomed ? 'Desk View' : 'Zoom Screen'}</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleTheme()
            }}
            title={isDark ? "Switch to Light Modern" : "Switch to Dark Modern"}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#252526] hover:bg-[#2d2d2d] border border-[#3c3c3c] text-zinc-200 text-[10px] font-mono transition-colors cursor-pointer"
          >
            {isDark ? (
              <svg className="w-3 h-3 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
            <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Real-Time Live Clock */}
          <LiveClock userLocation={userLocation} />
        </div>
      </div>

      {/* 2. Workspace Center Area (Activity Bar + Explorer + Editor Group(s)) */}
      <div className="relative flex-1 flex min-h-0 overflow-hidden">
        {/* Left Activity Bar Rail */}
        <div className="w-11 bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 shrink-0 select-none z-20">
          {/* Top Icons */}
          <div className="flex flex-col items-center gap-1 w-full">
            {/* Explorer Toggle Icon */}
            <button
              type="button"
              onClick={() => setIsExplorerOpen((prev) => !prev)}
              title="Toggle File Explorer (Ctrl+Shift+E)"
              className={`w-full min-h-[40px] flex items-center justify-center relative cursor-pointer transition-colors ${
                isExplorerOpen ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isExplorerOpen && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#007acc]" />
              )}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </button>

            {/* Source Control with Badge */}
            <button
              type="button"
              title="Source Control: 1 verified production commit"
              className="w-full min-h-[40px] flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors relative cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                <line x1="6" y1="9" x2="6" y2="21" />
              </svg>
              <span className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full bg-[#007acc] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                1
              </span>
            </button>

            {/* Extensions / Tech Stack Icon */}
            <button
              type="button"
              title="Core Engineering Extensions"
              className="w-full min-h-[40px] flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </button>
          </div>

          {/* Bottom Settings Gear Icon */}
          <div className="w-full flex justify-center">
            <button
              type="button"
              title="Settings"
              className="w-full min-h-[40px] flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible File Explorer Sidebar */}
        {isExplorerOpen && (
          <div
            className={`${
              isMobile
                ? 'absolute left-11 top-0 bottom-0 w-56 z-40 bg-[#181818] shadow-2xl border-r border-[#2b2b2b]'
                : 'w-44 bg-[#181818] border-r border-[#2b2b2b] shrink-0'
            } flex flex-col select-none animate-fadeIn`}
          >
            {/* Header */}
            <div className="h-9 px-3 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-semibold border-b border-[#2b2b2b]">
              <span>Explorer</span>
              <button
                type="button"
                onClick={() => setIsExplorerOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer p-0.5"
                title="Close Explorer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>

            {/* Tree Navigation */}
            <div className="p-2 space-y-1 text-xs font-mono">
              <div className="flex items-center gap-1 text-zinc-400 font-semibold text-[11px]">
                <span>▾</span>
                <span>PORTFOLIO</span>
                <span className="text-[10px] text-zinc-600 font-normal">[main]</span>
              </div>

              <div className="pl-3 space-y-0.5">
                <div className="flex items-center gap-1 text-zinc-400 text-[11px]">
                  <span>▾</span>
                  <span>docs/</span>
                </div>

                <div className="pl-3 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFileId('about')
                      if (isMobile) setIsExplorerOpen(false)
                    }}
                    className={`w-full min-h-[32px] px-2 py-1 rounded flex items-center gap-2 cursor-pointer transition-colors text-left ${
                      activeFileId === 'about'
                        ? 'bg-[#2a2d2e] text-zinc-100 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202020]'
                    }`}
                  >
                    <span className="text-[#38bdf8] font-bold text-[11px]">M↓</span>
                    <span className="truncate">ABOUT_ME.md</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveFileId('experience')
                      if (isMobile) setIsExplorerOpen(false)
                    }}
                    className={`w-full min-h-[32px] px-2 py-1 rounded flex items-center gap-2 cursor-pointer transition-colors text-left ${
                      activeFileId === 'experience'
                        ? 'bg-[#2a2d2e] text-zinc-100 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202020]'
                    }`}
                  >
                    <span className="text-[#34d399] font-bold text-[11px]">M↓</span>
                    <span className="truncate">EXPERIENCE.md</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor Panes: Side-by-Side Split View vs Single Tab View */}
        <div className="flex-1 flex min-w-0 h-full overflow-hidden">
          {isSplitView ? (
            <>
              {/* Left Group: ABOUT_ME.md */}
              <EditorGroup
                activeTab="about"
                onSelectTab={(tabKey) => {
                  if (tabKey === 'experience') setIsSplitView(false)
                  setActiveFileId(tabKey)
                }}
                isSplitView={isSplitView}
                onToggleSplit={() => setIsSplitView(false)}
                availableTabs={['about']}
              />

              {/* Right Divider Line */}
              <div className="w-[1px] bg-[#2b2b2b] shrink-0" />

              {/* Right Group: EXPERIENCE.md */}
              <EditorGroup
                activeTab="experience"
                onSelectTab={(tabKey) => {
                  if (tabKey === 'about') setIsSplitView(false)
                  setActiveFileId(tabKey)
                }}
                isSplitView={isSplitView}
                onToggleSplit={() => setIsSplitView(false)}
                availableTabs={['experience']}
              />
            </>
          ) : (
            <EditorGroup
              activeTab={activeFileId}
              onSelectTab={(tabKey) => setActiveFileId(tabKey)}
              isSplitView={isSplitView}
              onToggleSplit={() => setIsSplitView(true)}
              availableTabs={['about', 'experience']}
            />
          )}
        </div>
      </div>

      {/* 3. VS Code Status Bar */}
      <div className="h-6.5 sm:h-6 px-2.5 sm:px-3 bg-[#007acc] text-white flex items-center justify-between text-[11px] font-mono select-none shrink-0 z-30 rounded-b-[7px]">
        {/* Left Side: Remote Status + Git Branch + Diagnostics */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Remote Badge */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#005fb8] text-[10px] font-bold">
            <span>&gt;&lt;</span>
            <span>KasajuOS</span>
          </div>

          {/* Git Branch */}
          <div className="flex items-center gap-1 text-[11px] hover:text-blue-100 cursor-pointer">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
            <span>main*</span>
          </div>

          {/* Zero Error / Zero Warning Diagnostics */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] opacity-90">
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
              0
            </span>
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.938 2.016a.13.13 0 0 1 .125 0l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.14.084H1.218a.163.163 0 0 1-.14-.084.187.187 0 0 1 .002-.183L7.938 2.016zM8 1a1 1 0 0 0-.86.495L.283 13.162A1 1 0 0 0 1.144 15h13.712a1 1 0 0 0 .861-1.838L8.86 1.495A1 1 0 0 0 8 1z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
              </svg>
              0
            </span>
          </div>
        </div>

        {/* Right Side: Document Stats & Language Mode */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px]">
          <span className="hidden sm:inline">Ln 14, Col 28</span>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span>UTF-8</span>
          <span className="hidden sm:inline">LF</span>
          <span className="font-semibold bg-[#005fb8] px-1.5 py-0.5 rounded">Markdown</span>
        </div>
      </div>
    </div>
  )
}
