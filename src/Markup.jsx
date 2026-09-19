import React from 'react'

const projectsData = [
  {
    id: 'anubis',
    title: 'Voice-Activated AI Desktop Assistant (Anubis)',
    shortTitle: 'Anubis AI Assistant',
    tag: 'AI & Agentic Systems',
    time: 'Jun 2026 – Present',
    github: 'https://github.com/agrimkasaju/Anubis',
    description: 'Voice-activated autonomous AI assistant built in Python utilizing agentic workflows (Planner, Executor, Task Queue) with sub-800ms tool execution.',
    metrics: [
      'Trained and integrated custom Orion ONNX wake-word model with real-time audio inference (<150ms latency) and multi-frame checks, reaching 98%+ accuracy and cutting false triggers by 85%.',
      'Engineered persistent long-term memory module and IPC bridge to orchestrate external Python pipelines, processing 100+ job applications with zero data loss.',
      'Autonomously coordinates 15+ native system tools and asynchronous I/O routines.'
    ],
    tech: ['Python', 'ONNX', 'openWakeWord', 'Agentic Workflows', 'IPC', 'Asyncio']
  },
  {
    id: 'smartInventory',
    title: 'Smart Inventory System (Embedded Edge ML)',
    shortTitle: 'Smart Inventory (Edge ML)',
    tag: 'Embedded & Edge AI',
    time: 'Jan 2025 – Apr 2025',
    github: 'https://github.com/agrimkasaju/Smart-Inventory-System',
    description: 'Real-time object-detection inference pipeline on Raspberry Pi hardware using INT8 quantized TensorFlow Lite and low-latency cloud synchronization.',
    metrics: [
      'Applied INT8 quantization cutting model size by 75% (16MB to 4MB) and quadrupling inference speed from 3 FPS to 12+ FPS on ARM SoC.',
      'Engineered reusable data-access components interfacing with Firebase for sub-100ms real-time database synchronization.',
      'Authored automated unit test suites in Pytest achieving 90%+ code coverage with continuous deployment via GitHub Actions; led 4-member Agile team.'
    ],
    tech: ['Raspberry Pi', 'TensorFlow Lite', 'Python', 'Firebase', 'Pytest', 'GitHub Actions']
  },
  {
    id: 'apiSearch',
    title: 'High-Throughput Full-Stack REST Platform',
    shortTitle: 'API Search Platform',
    tag: 'Full-Stack & APIs',
    time: 'Sept 2025 – Dec 2025',
    github: 'https://github.com/agrimkasaju/API_search',
    description: 'Scalable web application aggregating 4+ external REST APIs with sub-200ms query latency and centralized state management.',
    metrics: [
      'Built modular TypeScript UI components and centralized Redux state, cutting redundant re-renders by 40% and reducing UI render latency by ~35% (saving 60ms).',
      'Implemented asynchronous data polling, input sanitization, and structured error handling maintaining 99.5% client-side uptime.',
      'Integrated resilient fault tolerance and defensive schema validation for external endpoints.'
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
    description: 'Benchmarked FCFS, Round Robin, and preemptive priority-based CPU scheduling algorithms in C/C++ on Linux.',
    metrics: [
      'Simulated 1,000+ heavy workloads demonstrating a 30% reduction in average turnaround time.',
      'Engineered concurrent producer-consumer processes utilizing POSIX threads, semaphores, and shared memory with zero race conditions or deadlocks.'
    ],
    tech: ['C', 'C++', 'POSIX Threads', 'Semaphores', 'Shared Memory', 'Linux']
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

  return (
    <div className="page-fadeup max-w-4xl mx-auto px-4 py-8 mt-2 sm:mt-3">
      {/* Active Theme Indicator & Switch */}
      <div className="flex items-center justify-between gap-2 mb-4 p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs transition-colors duration-200"
        style={{
          boxShadow: activeThemeId !== 'default' ? `0 0 15px var(--accent-glow)` : 'none',
          borderColor: activeThemeId !== 'default' ? 'var(--accent-color)' : undefined
        }}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'var(--accent-color)' }}></span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Theme: <span style={{ color: 'var(--accent-color)' }}>{currentTheme.name}</span>
          </span>
          {activeThemeId !== 'default' && (
            <button
              onClick={resetTheme}
              className="ml-2 underline text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              Reset to Neutral
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 hidden sm:inline">Click any project to re-theme page</span>
          <div className="switch shrink-0" aria-label="Toggle dark mode">
            <input
              type="checkbox"
              id="themeToggle"
              checked={isDark}
              onChange={toggleTheme}
              aria-label="Toggle dark mode"
            />
            <label htmlFor="themeToggle"></label>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="heroCard" className="fadeup-item fadeup-1 grid grid-cols-[100px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)] md:grid-cols-[140px_minmax(0,1fr)] gap-4 sm:gap-6 mb-6 items-start">
        {/* Geometric Monogram Badge */}
        <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[140px] md:h-[140px] bg-zinc-100 dark:bg-zinc-900 border-2 flex flex-col items-center justify-center transition-all duration-300"
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
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 inline-block text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ottawa, ON / Calgary, AB · Canada
            </p>
            <p className="text-xs sm:text-sm font-medium mt-1.5 leading-relaxed text-zinc-800 dark:text-zinc-200">
              Computer Systems Engineering Student @ Carleton University
              <span className="text-zinc-400 mx-1.5">|</span>
              Software Developer (Co-op) @ Lumentum
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href="https://github.com/agrimkasaju"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold border text-white transition-all duration-200 inline-flex items-center gap-1.5 hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
            >
              <i className="fa-brands fa-github text-sm"></i> GitHub
            </a>
            <a
              href="mailto:agrimkasaju@gmail.com"
              className="px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 inline-flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Me
            </a>
            <a
              href="/recent-projects"
              className="px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 inline-flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-layer-group text-xs"></i> All Projects
            </a>
            <a
              href="/techstack"
              className="px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 inline-flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-code text-xs"></i> Tech Stack
            </a>
          </div>
        </div>
      </section>

      {/* About & Experience Grid */}
      <section className="fadeup-item fadeup-2 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-3 mb-4 md:items-stretch">
        {/* Standout About Me */}
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
              Currently working as a <strong>Software Developer (Co-op) at Lumentum</strong>, I validate Linux-based system software via automated regression suites (reducing manual test cycle duration by 35%), build automated Python and CI pipelines across 10+ target configurations, troubleshoot mTLS/network security across distributed endpoints, and develop C# prototype inventory synchronization tooling.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed mb-3 text-zinc-700 dark:text-zinc-300">
              On the engineering front, I specialize in building high-throughput and low-latency systems. My applied work spans autonomous agentic orchestration (<a href="https://github.com/agrimkasaju/Anubis" className="font-semibold underline" style={{ color: 'var(--accent-color)' }}>Anubis</a> with custom Orion ONNX wake-word detection under 150ms), embedded INT8 quantized TensorFlow Lite inference on Raspberry Pi (<a href="https://github.com/agrimkasaju/Smart-Inventory-System" className="font-semibold underline" style={{ color: 'var(--accent-color)' }}>Smart Inventory</a>, 4x FPS speedup), and POSIX concurrent CPU scheduling in C/C++.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              I prioritize clean architectures, rigorous automated test suites (Pytest 90%+ code coverage), and dependable low-level execution that survives hostile edge environments and high contention.
            </p>
          </div>
        </article>

        {/* Industry Experience & Education */}
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
                  Linux system software validation, automated CI pipelines across 10+ configurations, mTLS security troubleshooting, C# prototype sync tools.
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
              <div className="mt-2 text-[10px] text-zinc-500 flex flex-wrap gap-1">
                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">Real-Time Systems</span>
                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">Network Security</span>
                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">ARM SoC Design</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Featured Projects with Click-to-Theme */}
      <section className="fadeup-item fadeup-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Featured Projects</span>
            <span className="text-xs font-normal text-zinc-500">(Click a card to apply its theme)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projectsData.map((proj) => {
              const isSelected = activeThemeId === proj.id
              return (
                <article
                  key={proj.id}
                  onClick={() => selectProjectTheme(proj.id)}
                  className="p-4 bg-white dark:bg-zinc-900 border transition-all duration-300 cursor-pointer relative group hover:-translate-y-0.5"
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
      <section className="fadeup-item fadeup-4 bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 mb-4">
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
              {['C', 'C++', 'Python', 'TypeScript', 'Java', 'SQL', 'Verilog', 'C#.NET', 'Bash'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">AI & Machine Learning</h3>
            <div className="flex flex-wrap gap-1">
              {['ONNX', 'openWakeWord', 'TensorFlow Lite', 'Edge Inference', 'Quantization (INT8)', 'LLM APIs'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Systems & Embedded</h3>
            <div className="flex flex-wrap gap-1">
              {['Linux / Embedded', 'Raspberry Pi', 'ARM SoC', 'RTOS', 'POSIX Threads', 'Shared Memory', 'UART/SPI/I2C'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">DevOps & Security</h3>
            <div className="flex flex-wrap gap-1">
              {['mTLS', 'STRIDE Threat Model', 'CIA Triad', 'Docker', 'GitHub Actions', 'Pytest', 'Terraform'].map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Connect / Footer */}
      <footer className="fadeup-item fadeup-5 border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
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
