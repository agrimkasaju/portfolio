import { useEffect, useState } from 'react'
import './App.css'
import { applyDocumentTheme, applyProjectTheme } from './theme.js'

const projects = [
  {
    themeId: 'anubis',
    title: 'Voice-Activated AI Assistant (Anubis)',
    tag: 'AI & Agentic Systems',
    description: 'Asynchronous Python assistant orchestrating 15+ local system tools via agentic stages (Planner, Executor, Task Queue), streaming Orion ONNX wake-word detection, and thread-safe IPC payload exchange across 100+ pipelines.',
    github: 'https://github.com/agrimkasaju/Anubis',
    tech: ['Python', 'ONNX Runtime', 'openWakeWord', 'Agentic Workflows', 'IPC Bridge', 'Asyncio']
  },
  {
    themeId: 'smartInventory',
    title: 'Smart Inventory System (Embedded Edge ML)',
    tag: 'Embedded & Edge AI',
    description: 'Real-time object-detection on Raspberry Pi. Applied INT8 quantization reducing float32 to int8 to shrink memory footprint by 75% and increase inference throughput from 5–10 FPS to 15–20 FPS with real-time Firebase edge-to-cloud sync.',
    github: 'https://github.com/agrimkasaju/Smart-Inventory-System',
    tech: ['Raspberry Pi', 'TensorFlow Lite', 'Python', 'Firebase', 'Pytest', 'GitHub Actions']
  },
  {
    themeId: 'apiSearch',
    title: 'Full-Stack REST Platform (React/Node.js)',
    tag: 'Full-Stack & APIs',
    description: 'Web application aggregating live data across 4+ external REST APIs via concurrent asynchronous requests. Decoupled data fetching from view rendering using centralized Redux state to prevent redundant component re-renders.',
    github: 'https://github.com/agrimkasaju/API_search',
    tech: ['React', 'TypeScript', 'Node.js', 'Redux', 'REST APIs']
  },
  {
    themeId: 'cpuScheduler',
    title: 'CPU Scheduling Simulator (C/C++ & Linux)',
    tag: 'Systems & Concurrency',
    description: 'FCFS, Round Robin, and preemptive priority algorithms modeling kernel-level task dispatch dynamics in C/C++ on Linux. Synchronized multi-threaded buffer access using POSIX threads, semaphores, and shared memory without race conditions.',
    github: 'https://github.com/agrimkasaju/Scheduler-Algorithm',
    tech: ['C', 'C++', 'POSIX Threads', 'Semaphores', 'Shared Memory', 'Linux']
  },
  {
    themeId: 'authSecurity',
    title: 'Secure User Account & RBAC System (Python)',
    tag: 'Cybersecurity & Auth',
    description: 'Authentication service enforcing role-based access control (RBAC) and bcrypt password hashing configured with 12 salt rounds against offline attacks, append-only JSON Lines audit logging, and STRIDE threat mitigation validated via Pytest.',
    github: 'https://github.com/agrimkasaju/bcrypt_password_hashing',
    tech: ['Python', 'Bcrypt', 'RBAC', 'JSON Lines', 'STRIDE Threat Modeling', 'Pytest']
  }
]

const RecentProj = () => {
  const [isDark, setIsDark] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsDark(localStorage.getItem('portfolio-theme') === 'dark')
  }, [])

  useEffect(() => {
    applyDocumentTheme(isDark)
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const onThemeButtonClick = () => {
    setIsDark((prev) => !prev)
  }

  const handleProjectClick = (themeId) => {
    if (themeId) {
      applyProjectTheme(themeId)
    }
  }

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-8 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <section className="p-3 page-divider-b mb-3">
        <div className="grid grid-cols-[auto_1fr_auto] items-center mb-2 min-h-[32px]">
          <a
            href="/"
            className="justify-self-start inline-flex items-center gap-1 text-[12px] sm:text-[13px] text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M14 10H4M4 10L8 6M4 10L8 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span>Back to Home</span>
          </a>
          <h1 className="hidden sm:block text-lg font-bold text-center">Projects Portfolio</h1>
          <button
            type="button"
            onClick={onThemeButtonClick}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`group relative justify-self-end w-[28px] h-[28px] border-0 bg-transparent text-[12px] inline-flex items-center justify-center p-0 rounded-full overflow-hidden transition-all duration-200 ${
              isDark ? 'text-zinc-100' : 'text-zinc-700'
            }`}
          >
            {isDark ? (
              <i className="fa-solid fa-moon text-sm"></i>
            ) : (
              <i className="fa-solid fa-sun text-sm"></i>
            )}
          </button>
        </div>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Applied engineering projects across AI workflows, edge machine learning, operating systems, and full-stack web platforms.
        </p>
      </section>

      <section className="p-1 sm:p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((project, index) => (
            <article
              key={index}
              onClick={() => handleProjectClick(project.themeId)}
              className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${index === 4 ? 'md:col-span-2' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 border border-zinc-300 dark:border-zinc-700">
                  {project.tag}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Click to Theme</span>
              </div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {project.title}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-semibold hover:underline inline-flex items-center gap-1 text-blue-600 dark:text-blue-400"
                >
                  <i className="fa-brands fa-github"></i>
                  <span>GitHub</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default RecentProj
