import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TechStack from './techstack.jsx'
import RecentProj from './recent-proj.jsx'
import { applyDocumentTheme, getSavedTheme } from './theme.js'

applyDocumentTheme(getSavedTheme())

const path = window.location.pathname
const page =
  path === '/techstack' ? <TechStack /> :
  path === '/recent-projects' ? <RecentProj /> :
  <App />

createRoot(document.getElementById('root')).render(page)
