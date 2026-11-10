import React, { useEffect } from 'react'
import MacbookShowcase from './MacbookShowcase.jsx'

const projectsData = [
  {
    id: 'anubis',
    title: 'Voice-Activated AI Desktop Assistant (Anubis)',
    shortTitle: 'Anubis AI Assistant',
    tag: 'AI & Agentic Systems',
    time: 'Jun 2026 – Present',
    github: 'https://github.com/agrimkasaju/Anubis',
    description: 'Asynchronous voice-activated assistant orchestrating native system tools and managing automated pipelines with custom wake-word inference.',
    metrics: [
      'Architected an asynchronous assistant in Python utilizing modular planning, execution, and task queue stages to autonomously orchestrate over 15 local system tools and background processes.',
      'Trained and integrated a custom Orion ONNX wake-word model with streaming audio inference and multi-frame activation checks to maintain low edge latency and suppress false activations.',
      'Built an asynchronous IPC bridge and thread-safe persistence module to exchange structured JSON payloads between the voice assistant and external automation pipelines across 100+ workflows.'
    ],
    tech: ['Python', 'ONNX Runtime', 'openWakeWord', 'Agentic Workflows', 'IPC', 'Asyncio']
  },
  {
    id: 'smartInventory',
    title: 'Smart Inventory System (Embedded Edge ML)',
    shortTitle: 'Smart Inventory (Edge ML)',
    tag: 'Embedded & Edge AI',
    time: 'Jan 2025 – Apr 2025',
    github: 'https://github.com/agrimkasaju/Smart-Inventory-System',
    description: 'Edge object-detection pipeline on Raspberry Pi hardware using INT8 quantized TensorFlow Lite and cloud database synchronization.',
    metrics: [
      'Applied post-training INT8 quantization to TensorFlow Lite, reducing precision from 32-bit floats to 8-bit integers to shrink memory footprint by 75% and boost throughput from 5–10 FPS to 15–20 FPS on edge hardware.',
      'Constructed modular data-access components interfacing with Firebase for real-time edge-to-cloud inventory database synchronization.',
      'Authored automated unit test suites in Pytest and managed continuous integration workflows via GitHub Actions across a 4-member Agile team.'
    ],
    tech: ['Raspberry Pi', 'TensorFlow Lite', 'Python', 'Firebase', 'Pytest', 'GitHub Actions']
  },
  {
    id: 'apiSearch',
    title: 'Full-Stack REST Platform (React/Node.js)',
    shortTitle: 'API Search Platform',
    tag: 'Full-Stack & APIs',
    time: 'Sept 2025 – Dec 2025',
    github: 'https://github.com/agrimkasaju/API_search',
    description: 'Full-stack web application aggregating live multi-source data through concurrent asynchronous REST requests and centralized state management.',
    metrics: [
      'Aggregated live data across 4+ external REST APIs through concurrent asynchronous requests in React, Node.js, and TypeScript.',
      'Engineered modular TypeScript UI components and centralized Redux state management, decoupling data fetching from view rendering to prevent redundant component updates during active searches.',
      'Implemented asynchronous data polling, input sanitization, and structured client-side error handling to gracefully handle upstream rate limits and network timeouts without disrupting UI state.'
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Redux', 'REST APIs']
  },
  {
    id: 'cpuScheduler',
    title: 'CPU Scheduling Simulator (C/C++ & Linux)',
    shortTitle: 'CPU Scheduler Simulator',
    tag: 'Systems & Concurrency',
    time: 'Sep 2024 – Dec 2024',
    github: 'https://github.com/agrimkasaju/Scheduler-Algorithm',
    description: 'Kernel-level task dispatch simulation in C/C++ on Linux benchmarking scheduling policies and multi-threaded IPC buffer synchronization.',
    metrics: [
      'Implemented FCFS, Round Robin, and preemptive priority CPU scheduling algorithms in C/C++ on Linux, modeling kernel-level task dispatch dynamics and reducing wait times for high-priority tasks.',
      'Developed concurrent producer-consumer processes in C using POSIX threads, semaphores, and shared memory, synchronizing buffer access and eliminating race conditions under thread contention.',
      'Benchmarked scheduling turnaround, context-switching overhead, and thread latency across varied process arrival and burst workloads to profile system performance.'
    ],
    tech: ['C', 'C++', 'POSIX Threads', 'Semaphores', 'Shared Memory', 'Linux']
  },
  {
    id: 'authSecurity',
    title: 'Secure User Account & RBAC System (Python)',
    shortTitle: 'RBAC Auth & Audit System',
    tag: 'Cybersecurity & Auth',
    time: 'Jan 2025 – Apr 2025',
    github: 'https://github.com/agrimkasaju/bcrypt_password_hashing',
    description: 'Python authentication service enforcing role-based access control, cryptographic password hashing, and immutable audit logging.',
    metrics: [
      'Designed a Python authentication service enforcing role-based access control (RBAC) and bcrypt password hashing configured with 12 salt rounds to protect credentials against offline brute-force attacks.',
      'Implemented append-only JSON Lines audit logging to record timestamps, user identities, and authorization decisions, maintaining an immutable history of authentication events.',
      'Performed STRIDE threat modeling and enforced defense-in-depth controls including least privilege policies and session expiration limits, validating mitigations with automated Pytest suites.'
    ],
    tech: ['Python', 'Bcrypt', 'RBAC', 'JSON Lines', 'STRIDE Threat Modeling', 'Pytest']
  }
]

const Markup = ({
  isDark,
  toggleTheme,
  activeThemeId,
  selectProjectTheme,
  resetTheme,
  projectThemes
}) => {
  const currentTheme = projectThemes[activeThemeId] || projectThemes.default

  useEffect(() => {
    // 1. Omid Hemmati-style IntersectionObserver Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(revealElements).indexOf(entry.target)
            const delay = (idx >= 0 ? idx % 5 : 0) * 45
            setTimeout(() => {
              entry.target.classList.add('visible')
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )

    revealElements.forEach((el) => observer.observe(el))

    // 2. 3D Perspective Tilt on Cards (Desktop Pointer Devices)
    const isTouch = window.matchMedia('(hover: none)').matches
    const tiltCards = document.querySelectorAll('.tilt-card')
    const MAX_TILT = 2 // degrees

    const handleMouseMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateY = ((x - centerX) / centerX) * MAX_TILT
      const rotateX = ((centerY - y) / centerY) * MAX_TILT
      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px) scale(1.005)`
    }

    const handleMouseLeave = (e) => {
      const card = e.currentTarget
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)'
    }

    if (!isTouch) {
      tiltCards.forEach((card) => {
        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    return () => {
      observer.disconnect()
      if (!isTouch) {
        tiltCards.forEach((card) => {
          card.removeEventListener('mousemove', handleMouseMove)
          card.removeEventListener('mouseleave', handleMouseLeave)
        })
      }
    }
  }, [])

  return (
    <div className="page-fadeup max-w-4xl mx-auto px-4 py-8 mt-2 sm:mt-3">
      {/* Hero Section */}
      <section id="heroCard" className="reveal grid grid-cols-[100px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)] md:grid-cols-[140px_minmax(0,1fr)] gap-4 sm:gap-6 mb-8 sm:mb-10 items-center">
        {/* Geometric Monogram Badge */}
        <div className="tilt-card relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[140px] md:h-[140px] bg-zinc-100 dark:bg-zinc-900 border-2 flex flex-col items-center justify-center transition-all duration-300"
          style={{ borderColor: 'var(--accent-color)' }}>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter" style={{ color: 'var(--accent-color)' }}>
            AK
          </span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
            ENGINEERING
          </span>
        </div>

        <div className="min-w-0 flex flex-col justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">
              Agrim Kasaju
            </h1>
            <p className="text-xs sm:text-sm font-medium mt-1.5 leading-relaxed text-zinc-800 dark:text-zinc-200">
              Computer Systems Engineering Student @ Carleton University
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href="https://github.com/agrimkasaju"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer px-3 py-1.5 text-xs font-semibold border text-white transition-all duration-200 inline-flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
            >
              <i className="fa-brands fa-github text-sm"></i> GitHub
            </a>
            <a
              href="mailto:agrimkasaju@gmail.com"
              className="btn-shimmer px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Me
            </a>
            <a
              href="/recent-projects"
              className="btn-shimmer px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-layer-group text-xs"></i> All Projects
            </a>
            <a
              href="/techstack"
              className="btn-shimmer px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-code text-xs"></i> Tech Stack
            </a>
          </div>
        </div>
      </section>

      {/* About & Experience Showcase (Apple-style MacBook Interactive Display) */}
      <MacbookShowcase
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeThemeId={activeThemeId}
        resetTheme={resetTheme}
        currentTheme={currentTheme}
      />

      {/* Featured Projects with Click-to-Theme */}
      <section className="reveal mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Featured Projects</span>
            <span className="text-xs font-normal text-zinc-500">(Click a card to apply its theme)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projectsData.map((proj, idx) => {
              const isSelected = activeThemeId === proj.id
              return (
                <article
                  key={proj.id}
                  onClick={() => selectProjectTheme(proj.id)}
                  className={`tilt-card p-4 bg-white dark:bg-zinc-900 border transition-all duration-300 cursor-pointer relative group ${idx === 4 ? 'md:col-span-2' : ''}`}
                  style={{
                    borderColor: isSelected ? 'var(--accent-color)' : undefined,
                    boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : undefined
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 border"
                        style={{
                          borderColor: isSelected ? 'var(--accent-color)' : '#d4d4d8',
                          color: isSelected ? 'var(--accent-color)' : undefined
                        }}>
                          {proj.tag}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1.5 group-hover:underline">
                        {proj.title}
                      </h3>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-white"
                        style={{ backgroundColor: 'var(--accent-color)' }}>
                        ACTIVE THEME
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <ul className="text-[11px] space-y-1 text-zinc-600 dark:text-zinc-400 mb-3 pl-3 list-disc">
                    {proj.metrics.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-wrap gap-1">
                      {proj.tech.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold hover:underline inline-flex items-center gap-1"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      <span>Code</span> &rarr;
                    </a>
                  </div>
                </article>
              )
            })}
        </div>
      </section>

      {/* Skills & Capabilities Overview */}
      <section className="reveal bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 mb-4">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold">Technical Core Competencies</h2>
          <a href="/techstack" className="text-xs hover:underline font-medium" style={{ color: 'var(--accent-color)' }}>
            Expanded Tech Stack &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Languages</h3>
            <div className="flex flex-wrap gap-1">
              {['C', 'C++', 'Go', 'Python', 'Bash', 'C#', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'Verilog'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">AI & Machine Learning</h3>
            <div className="flex flex-wrap gap-1">
              {['ONNX Runtime', 'TensorFlow Lite', 'INT8 Quantization', 'openWakeWord', 'Edge Inference', 'LLM APIs (Gemini, Groq)'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Systems & Embedded</h3>
            <div className="flex flex-wrap gap-1">
              {['Linux (POSIX APIs)', 'POSIX Threads', 'Semaphores', 'Shared Memory', 'IPC', 'ARM SoC', 'Raspberry Pi', 'RTOS', 'UART / SPI / I2C'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Security & DevOps</h3>
            <div className="flex flex-wrap gap-1">
              {['Mutual TLS (mTLS)', 'X.509 Certificates', 'RBAC', 'Bcrypt', 'STRIDE Threat Modeling', 'TCP/IP', 'Docker', 'GitHub Actions CI/CD', 'Pytest'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Connect / Footer */}
      <footer className="reveal border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
        <p>&copy; 2026 Agrim Kasaju · Computer Systems Engineering</p>
        <div className="flex gap-4">
          <a href="https://github.com/agrimkasaju" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          <a href="mailto:agrimkasaju@gmail.com" className="hover:underline">Email</a>
          <a href="https://cuportfolio.carleton.ca/view/view.php?t=324dcd03b60a3b3376f0" target="_blank" rel="noopener noreferrer" className="hover:underline">cuPortfolio</a>
        </div>
      </footer>
    </div>
  )
}

export default Markup
