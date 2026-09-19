import { useEffect, useState } from 'react'
import './App.css'
import Markup from './Markup'
import { applyDocumentTheme, applyProjectTheme, getSavedTheme, PROJECT_THEMES } from './theme.js'

function App() {
  const [isDark, setIsDark] = useState(getSavedTheme())
  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('active-project-theme') || 'default'
  })

  useEffect(() => {
    applyDocumentTheme(isDark)
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    applyProjectTheme(activeThemeId)
  }, [activeThemeId, isDark])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  const selectProjectTheme = (themeId) => {
    setActiveThemeId(themeId)
    applyProjectTheme(themeId)
  }

  const resetTheme = () => {
    selectProjectTheme('default')
  }

  return (
    <Markup
      isDark={isDark}
      toggleTheme={toggleTheme}
      activeThemeId={activeThemeId}
      selectProjectTheme={selectProjectTheme}
      resetTheme={resetTheme}
      projectThemes={PROJECT_THEMES}
    />
  )
}

export default App
