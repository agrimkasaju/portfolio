export const applyDocumentTheme = (isDark) => {
  const root = document.documentElement

  root.classList.toggle('dark', isDark)
  root.classList.toggle('dark-theme', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'

  document.body.classList.toggle('dark', isDark)
  document.body.classList.toggle('dark-theme', isDark)

  // Re-apply project theme variables
  const savedProject = localStorage.getItem('active-project-theme') || 'default'
  applyProjectTheme(savedProject)
}

export const getSavedTheme = () => localStorage.getItem('portfolio-theme') === 'dark'

export const PROJECT_THEMES = {
  default: {
    id: 'default',
    name: 'Minimal Slate',
    accent: '#2563eb',
    accentDark: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.16)',
    bgDark: '#080b11',
    bgLight: '#ffffff',
    panelDark: '#121212',
    panelLight: '#ffffff',
    borderDark: '#262626',
    borderLight: '#e5e7eb',
    statusGreen: '#22c55e',
    tag: 'Default Neutral'
  },
  anubis: {
    id: 'anubis',
    name: 'Anubis (O.R.I.O.N Sci-Fi HUD)',
    // Exact colors from /home/grim/Downloads/Anubis/ui.py (class C)
    accent: '#007a99',
    accentDark: '#00d4ff',        // C.PRI
    glow: 'rgba(0, 212, 255, 0.35)',
    bgDark: '#00060a',            // C.BG
    bgLight: '#f0f9ff',
    panelDark: '#010d14',         // C.PANEL
    panelLight: '#ffffff',
    borderDark: '#0d3347',        // C.BORDER
    borderLight: '#b8e6f5',
    statusGreen: '#00ff88',       // C.GREEN
    hudText: '#8ffcff',           // C.TEXT
    tag: 'O.R.I.O.N HUD'
  },
  smartInventory: {
    id: 'smartInventory',
    name: 'Smart Inventory — Edge ML',
    accent: '#059669',
    accentDark: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    bgDark: '#04130d',
    bgLight: '#f0fdf4',
    panelDark: '#081c13',
    panelLight: '#ffffff',
    borderDark: '#0f3826',
    borderLight: '#bbf7d0',
    statusGreen: '#10b981',
    tag: 'Matrix Emerald'
  },
  apiSearch: {
    id: 'apiSearch',
    name: 'API Search — Full-Stack',
    accent: '#7c3aed',
    accentDark: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.25)',
    bgDark: '#100a1b',
    bgLight: '#faf5ff',
    panelDark: '#170f26',
    panelLight: '#ffffff',
    borderDark: '#2e1c4e',
    borderLight: '#e9d5ff',
    statusGreen: '#a855f7',
    tag: 'Electric Violet'
  },
  cpuScheduler: {
    id: 'cpuScheduler',
    name: 'CPU Scheduler — C/C++ Real-Time',
    accent: '#d97706',
    accentDark: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.25)',
    bgDark: '#171003',
    bgLight: '#fffbeb',
    panelDark: '#1f1604',
    panelLight: '#ffffff',
    borderDark: '#3d2b07',
    borderLight: '#fde68a',
    statusGreen: '#f59e0b',
    tag: 'Terminal Amber'
  }
}

export const applyProjectTheme = (projectId) => {
  const theme = PROJECT_THEMES[projectId] || PROJECT_THEMES.default
  const root = document.documentElement
  const isDark = root.classList.contains('dark-theme') || root.classList.contains('dark')

  const activeAccent = isDark ? theme.accentDark : theme.accent
  const activeBg = isDark ? theme.bgDark : theme.bgLight
  const activePanel = isDark ? theme.panelDark : theme.panelLight
  const activeBorder = isDark ? theme.borderDark : theme.borderLight
  const activeGreen = theme.statusGreen || '#22c55e'

  root.style.setProperty('--accent-color', activeAccent)
  root.style.setProperty('--accent-glow', theme.glow)
  root.style.setProperty('--active-bg', activeBg)
  root.style.setProperty('--panel-bg', activePanel)
  root.style.setProperty('--panel-border', activeBorder)
  root.style.setProperty('--status-green', activeGreen)

  root.style.backgroundColor = activeBg
  document.body.style.backgroundColor = activeBg

  localStorage.setItem('active-project-theme', theme.id)
  return theme
}
