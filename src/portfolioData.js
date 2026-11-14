/**
 * Structured Portfolio Documents & VS Code Workspace Metadata
 * Zero emojis - pure technical and design integrity.
 */

export const WORKSPACE_DOCS = {
  about: {
    id: 'about',
    filename: 'ABOUT_ME.md',
    relativePath: '~/kasaju/ABOUT_ME.md',
    breadcrumbs: ['portfolio', 'docs', 'ABOUT_ME.md'],
    iconType: 'markdown',
    iconColor: '#38bdf8', // Blue
    language: 'Markdown',
    encoding: 'UTF-8',
    title: 'Agrim Kasaju',
    subtitle: "B.Eng Computer Systems Engineering @ Carleton University · GPA 3.33/4.0 · Dean's Honour List",
    summary: 'Fourth-year engineering student with hands-on production experience in Linux systems software, automated verification harnesses, and edge AI deployment.',
    philosophy: {
      tag: '// Architectural Philosophy',
      text: 'High-throughput, low-latency execution that survives hostile edge environments, high thread contention, and deterministic timing constraints.'
    },
    coreStack: [
      'C/C++',
      'Go',
      'Python',
      'Linux POSIX APIs',
      'ONNX / TFLite INT8',
      'mTLS & X.509'
    ],
    sections: [
      {
        heading: '## Engineering Background & Systems Philosophy',
        paragraphs: [
          'At Lumentum, I work as a Software Developer Co-op on systems verification pipelines, where I automated Linux test harnesses across 10+ optical subsystem configurations (reducing test durations by 35%), implemented mutual TLS (mTLS) with bidirectional X.509 certificate validation, and architected C#/Go filesystem event monitoring pipelines with prototext persistence that reduced snapshot storage overhead by 88%.',
          'My technical approach prioritizes systems-level determinism, minimal memory footprint, lockless inter-thread communication, and rigorous verification under high load.'
        ]
      },
      {
        heading: '### Academic Highlights & Systems Coursework',
        coursework: [
          {
            title: 'Real-Time Systems',
            desc: 'Rate-Monotonic scheduling, priority inversion inheritance, POSIX threads.'
          },
          {
            title: 'Network Security',
            desc: 'Cryptographic protocols, packet filtering, iptables, mTLS authentication.'
          },
          {
            title: 'Embedded Systems',
            desc: 'ARM Cortex-M SoC, memory-mapped I/O, UART/SPI/I2C bare-metal drivers.'
          },
          {
            title: 'Operating Systems',
            desc: 'Virtual memory paging, inode filesystems, lock-free concurrency.'
          }
        ]
      }
    ]
  },
  experience: {
    id: 'experience',
    filename: 'EXPERIENCE.md',
    relativePath: '~/kasaju/EXPERIENCE.md',
    breadcrumbs: ['portfolio', 'docs', 'EXPERIENCE.md'],
    iconType: 'markdown',
    iconColor: '#34d399', // Emerald
    language: 'Markdown',
    encoding: 'UTF-8',
    title: 'Professional Experience',
    subtitle: 'Production software engineering, verification infrastructure & systems deployment',
    roles: [
      {
        company: 'Lumentum',
        logo: '/logos/lumentum.svg',
        role: 'Software Developer (Co-op)',
        period: 'May 2026 – Present',
        location: 'Ottawa, ON · Systems Software & Verification',
        bullets: [
          {
            prefix: 'Automated Linux Validation: ',
            text: 'Validated system software by automating test harness execution and diagnostic log parsing across 10+ configurations, ',
            highlight: 'reducing manual regression duration by 35%.'
          },
          {
            prefix: 'Mutual TLS (mTLS) Security: ',
            text: 'Implemented bidirectional X.509 certificate validation between host daemons and client endpoints to enforce strict authentication.',
            highlight: ''
          },
          {
            prefix: 'State Isolation & Storage Reduction: ',
            text: 'Built C# filesystem event monitoring service & Go backend pipelines validating declarative prototext persistence, ',
            highlight: 'cutting snapshot storage overhead by 88%.'
          }
        ]
      },
      {
        company: 'TELUS',
        logo: '/logos/telus.svg',
        role: 'Technical Analyst',
        period: 'Jul 2023 – Aug 2023',
        location: 'Ottawa, ON · Customer Solutions',
        bullets: [
          {
            prefix: 'Performance: ',
            text: 'Exceeded monthly sales targets by 20% through structured needs discovery and tailored telecom service packages.',
            highlight: ''
          },
          {
            prefix: 'Escalation Handling: ',
            text: 'Resolved customer escalations by translating technical billing and network issues into actionable service adjustments.',
            highlight: ''
          }
        ]
      },
      {
        company: 'Carleton University',
        logo: '',
        role: 'Academic Peer Tutor (Systems & Math)',
        period: 'Sep 2023 – Apr 2024',
        location: 'Carleton University',
        bullets: [
          {
            prefix: 'Mentorship: ',
            text: 'Mentored 25+ first- and second-year engineering students in C programming, linear algebra, and circuit analysis.',
            highlight: ''
          },
          {
            prefix: 'Lab Instruction: ',
            text: 'Facilitated weekly diagnostic review sessions improving student lab completion rates and exam performance.',
            highlight: ''
          }
        ]
      }
    ]
  }
}
