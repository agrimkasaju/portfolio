import { useEffect, useState } from 'react'
import './App.css'
import { applyDocumentTheme } from './theme.js'

const TechStack = () => {
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

  const skillGroups = [
    {
      title: 'Programming Languages',
      skills: ['C', 'C++', 'Go', 'Python', 'Bash', 'C#', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'Verilog']
    },
    {
      title: 'Systems, Embedded & Hardware',
      skills: [
        'Linux (POSIX APIs)',
        'POSIX Threads',
        'Semaphores',
        'Shared Memory',
        'IPC',
        'ARM SoC Architecture',
        'Raspberry Pi',
        'Real-Time Operating Systems (RTOS)',
        'UART / I2C / SPI',
        'Vivado & Xilinx FPGA'
      ]
    },
    {
      title: 'Edge AI & Machine Learning',
      skills: [
        'ONNX Runtime',
        'TensorFlow Lite',
        'INT8 Model Quantization',
        'openWakeWord',
        'Custom Wake-Word Training',
        'Edge Streaming Inference',
        'LLM APIs (Gemini, Groq)'
      ]
    },
    {
      title: 'Cybersecurity & Network Protocols',
      skills: [
        'Mutual TLS (mTLS)',
        'X.509 Certificates',
        'Role-Based Access Control (RBAC)',
        'Bcrypt Password Hashing (12 Rounds)',
        'STRIDE Threat Modeling',
        'TCP/IP',
        'iptables Packet Filtering',
        'Immutable Audit Logging'
      ]
    },
    {
      title: 'Data Serialization, Storage & Web',
      skills: [
        'Protocol Buffers',
        'Declarative Prototext',
        'JSON Lines (JSONL)',
        'RESTful APIs',
        'SQL',
        'React',
        'Node.js',
        'Redux Centralized State',
        'Firebase'
      ]
    },
    {
      title: 'DevOps, CI/CD & Testing',
      skills: [
        'Git',
        'GitHub Actions CI/CD',
        'Pytest (Unit & Integration)',
        'Docker',
        'GDB',
        'Playwright'
      ]
    }
  ]

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
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
          <h1 className="hidden sm:block text-lg font-bold text-center">Technical Core Competencies</h1>
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
          Core technical competencies across low-level computer systems, applied machine learning, cyber security, and automated deployment pipelines.
        </p>
      </section>

      <section className="p-1 sm:p-3 space-y-4">
        {skillGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2.5 flex items-center justify-between">
              <span>{group.title}</span>
              <span className="text-[10px] font-mono text-zinc-500">{group.skills.length} skills</span>
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {group.skills.map((s, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 mb-2">
        © 2026 Agrim Kasaju · Computer Systems Engineering
      </footer>
    </div>
  )
}

export default TechStack
