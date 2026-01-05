import React, { useEffect, useRef, useState } from 'react'

function rand(min, max) {
  return Math.random() * (max - min) + min
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}

export default function App() {
  const canvasRef = useRef(null)
  const [starsCount, setStarsCount] = useState(0)
  const [commitCount, setCommitCount] = useState(0)
  const [daybreak, setDaybreak] = useState(false)

  // simple sim entities kept in ref to avoid rerenders
  const simRef = useRef({ stars: [], comets: [] })
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi, I’m Moon Bot. Ask about Brian, IT careers, skills, tools, or type “faq”.',
    },
  ])
  useEffect(() => {
    document.body.dataset.mode = daybreak ? 'marine' : 'night'
  }, [daybreak])

  const inputRef = useRef(null)
  const chatListRef = useRef(null)
  const scrollToBottom = () => {
    const el = chatListRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0)
    }
  }, [chatOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // IT Specialist FAQs (searchable and quick-insert)
  const faqs = [
    {
      q: 'What does an IT specialist do?',
      a: 'Designs, implements, and supports systems: networks, servers, endpoints, apps, and security controls.',
    },
    {
      q: 'Key IT specialist skills?',
      a: 'Networking (TCP/IP, DNS), OS (Linux/Windows), scripting (Bash/Python), cloud basics, troubleshooting, documentation.',
    },
    {
      q: 'Cybersecurity basics to learn?',
      a: 'Threat modeling, least privilege, patching, secure configs, SIEM basics, OWASP Top 10, incident response basics.',
    },
    {
      q: 'Common certifications?',
      a: 'CompTIA A+, Network+, Security+, CCNA, AWS Cloud Practitioner, Linux+, CYSA+, CEH (verify relevance).',
    },
    {
      q: 'Scripting vs programming?',
      a: 'Scripting automates admin tasks (Bash/Python/PowerShell). Programming builds apps/services with deeper engineering.',
    },
    {
      q: 'Monitoring tools?',
      a: 'Prometheus, Grafana, ELK/Opensearch, Zabbix, Nagios, Datadog, CloudWatch, Sentinel/Splunk for security.',
    },
    {
      q: 'Ticketing/ITSM tools?',
      a: 'Jira Service Management, ServiceNow, Freshservice, Zendesk. Emphasize SLAs, runbooks, postmortems.',
    },
    {
      q: 'Backup best practices?',
      a: '3-2-1 rule, test restores, encrypt backups, offsite/immutable storage, document RPO/RTO.',
    },
    {
      q: 'Disaster recovery vs high availability?',
      a: 'HA reduces downtime via redundancy. DR recovers after failure via backups, replicas, runbooks, and drills.',
    },
    {
      q: 'Networking essentials?',
      a: 'IP addressing, subnets/VLANs, routing, NAT, DNS/DHCP, VPNs, firewalls, Wi‑Fi, TLS/PKI.',
    },
    {
      q: 'Security hardening tips?',
      a: 'MFA, patching, CIS Benchmarks, firewall least access, logging, EDR/AV, secrets management, zero trust principles.',
    },
    {
      q: 'Cloud fundamentals?',
      a: 'IaaS/PaaS/SaaS, regions/AZs, IAM, VPCs, security groups, managed databases, cost controls, backups.',
    },
    {
      q: 'DevOps basics?',
      a: 'Version control (Git), CI/CD, Infrastructure as Code (Terraform), containers (Docker), observability, shift-left security.',
    },
    {
      q: 'Help desk to sysadmin path?',
      a: 'Start with support and scripting, earn Net+/Sec+, shadow infra work, take small ownerships, build homelab, document.',
    },
    {
      q: 'Homelab ideas?',
      a: 'Proxmox/VMware, Docker, Pi-hole, WireGuard, ELK, Kubernetes basics, Ansible playbooks, monitoring stack, break-and-fix drills.',
    },
    {
      q: 'Interview prep?',
      a: 'Practice troubleshooting stories (STAR), review fundamentals, lab projects, be clear on tradeoffs and incident lessons.',
    },
    {
      q: 'Soft skills?',
      a: 'Clear communication, prioritization, incident calm, collaboration, writing docs/runbooks, customer empathy.',
    },
  ]

  // resize canvas
  useEffect(() => {
    const cnv = canvasRef.current
    if (!cnv) return
    const ctx = cnv.getContext('2d')

    function resize() {
      const dpr = window.devicePixelRatio || 1
      cnv.width = Math.floor(cnv.clientWidth * dpr)
      cnv.height = Math.floor(cnv.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cnv)
    return () => ro.disconnect()
  }, [])

  // interactions
  useEffect(() => {
    const cnv = canvasRef.current
    if (!cnv) return

    function pushNear(x, y) {
      const { stars } = simRef.current
      for (let s of stars) {
        const dx = s.x - x
        const dy = s.y - y
        const d2 = dx * dx + dy * dy
        if (d2 < 140 * 140) {
          const d = Math.sqrt(d2) || 1
          const f = (140 - d) / 140
          s.vx += (dx / d) * f * 2
          s.vy += (dy / d) * f * 2
        }
      }
    }
    function pointer(e) {
      const rect = cnv.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      pushNear(x, y)
    }
    cnv.addEventListener('pointerdown', pointer)
    cnv.addEventListener('pointermove', (e) => {
      if (e.buttons) pointer(e)
    })
    return () => {
      cnv.removeEventListener('pointerdown', pointer)
    }
  }, [])

  // spawn helpers
  function addStars(n = 60) {
    const cnv = canvasRef.current
    if (!cnv) return
    const { stars } = simRef.current
    for (let i = 0; i < n; i++) {
      const depth = rand(0.3, 1)
      stars.push({
        x: rand(0, cnv.clientWidth),
        y: rand(0, cnv.clientHeight),
        vx: rand(-0.18, 0.18) * (0.4 + depth),
        vy: rand(-0.18, 0.18) * (0.4 + depth),
        baseR: rand(1.4, 2.6),
        hue: rand(200, 260),
        depth,
        twinkleSpeed: rand(0.8, 1.8),
        twinklePhase: rand(0, Math.PI * 2),
      })
    }
    setStarsCount(stars.length)
  }
  function clearAll() {
    simRef.current.stars = []
    simRef.current.comets = []
    setStarsCount(0)
    setCommitCount(0)
  }
  function commitNow(direction = 'ltr') {
    const cnv = canvasRef.current
    if (!cnv) return
    const y = rand(0, cnv.clientHeight * 0.6)
    if (direction === 'rtl') {
      simRef.current.comets.push({ x: cnv.clientWidth + 80, y, vx: -rand(6, 8), life: 1 })
    } else {
      simRef.current.comets.push({ x: -80, y, vx: rand(6, 8), life: 1 })
    }
    setCommitCount((c) => c + 1)
  }

  // auto shooting-star commits
  useEffect(() => {
    if (daybreak) return undefined
    const id = setInterval(() => {
      const dir1 = Math.random() < 0.5 ? 'ltr' : 'rtl'
      commitNow(dir1)
      if (Math.random() < 0.7) commitNow(dir1 === 'ltr' ? 'rtl' : 'ltr')
      if (Math.random() < 0.35) commitNow(Math.random() < 0.5 ? 'ltr' : 'rtl')
    }, 2200)
    return () => clearInterval(id)
  }, [daybreak])

  // initial stars
  useEffect(() => {
    addStars(120)
  }, [])

  // animation loop
  useEffect(() => {
    const cnv = canvasRef.current
    if (!cnv) return
    const ctx = cnv.getContext('2d')

    function step(ts) {
      const dt = clamp((ts - (lastTsRef.current || ts)) / 16.67, 0, 2)
      lastTsRef.current = ts
      const w = cnv.clientWidth
      const h = cnv.clientHeight

      if (daybreak) {
        ctx.fillStyle = '#f8fafe'
        ctx.fillRect(0, 0, w, h)
      } else {
        // Night sky gradient subtle
        const grd = ctx.createLinearGradient(0, 0, 0, h)
        grd.addColorStop(0, '#030414')
        grd.addColorStop(0.6, '#05071f')
        grd.addColorStop(1, '#090b2b')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      }
      ctx.fillRect(0, 0, w, h)

      const centerX = w / 2
      const centerY = h / 2

      if (!daybreak) {
        const stars = simRef.current.stars
        for (let s of stars) {
          s.x += s.vx * dt
          s.y += s.vy * dt
          s.vx *= 0.994
          s.vy *= 0.994
          if (s.x < 0 || s.x > w) {
            s.vx *= -1
            s.x = clamp(s.x, 0, w)
          }
          if (s.y < 0 || s.y > h) {
            s.vy *= -1
            s.y = clamp(s.y, 0, h)
          }
        }

        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        for (let s of stars) {
          const twinkle = 0.6 + 0.4 * Math.sin(ts * 0.0012 * s.twinkleSpeed + s.twinklePhase)
          const radius = s.baseR * (0.9 + s.depth * 2.2) * twinkle
          const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius)
          gradient.addColorStop(0, `hsla(${s.hue}, 100%, ${72 + s.depth * 18}%, 1)`)
          gradient.addColorStop(0.35, `hsla(${s.hue}, 90%, ${62 + s.depth * 15}%, 0.85)`)
          gradient.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(s.x, s.y, radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.save()
          ctx.globalAlpha = 0.18 + 0.18 * twinkle
          ctx.strokeStyle = `hsla(${s.hue}, 100%, 85%, 0.8)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(s.x - radius * 2.4, s.y)
          ctx.lineTo(s.x + radius * 2.4, s.y)
          ctx.moveTo(s.x, s.y - radius * 2.4)
          ctx.lineTo(s.x, s.y + radius * 2.4)
          ctx.stroke()
          ctx.restore()
        }

        const comets = simRef.current.comets
        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i]
          c.x += c.vx * dt
          c.life -= 0.008 * dt
          const tail = 80
          const tailX = c.vx >= 0 ? c.x - tail : c.x + tail
          const tailY = c.vx >= 0 ? c.y + 10 : c.y - 10
          const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY)
          grad.addColorStop(0, `rgba(255,255,255,${clamp(c.life, 0, 1)})`)
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(c.x, c.y)
          ctx.stroke()
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2)
          ctx.fill()
          if (c.x > w + 100 || c.x < -100 || c.life <= 0) comets.splice(i, 1)
        }
        ctx.restore()
      } else {
        simRef.current.comets.length = 0
      }

      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [daybreak])

  // auto-scroll logic
  const [autoScroll, setAutoScroll] = useState(true)
  useEffect(() => {
    let raf = 0
    let last = 0
    const speedPxPerSec = daybreak ? 25 : 40
    function step(ts) {
      if (!autoScroll) return
      const dt = Math.min(32, ts - (last || ts))
      last = ts
      const bottom = Math.ceil(window.scrollY + window.innerHeight) >= document.body.scrollHeight
      if (bottom) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        window.scrollBy({ top: (speedPxPerSec * dt) / 1000, left: 0, behavior: 'instant' })
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const stop = () => setAutoScroll(false)
    window.addEventListener('pointerdown', stop, { once: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerdown', stop)
    }
  }, [autoScroll, daybreak])

  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen text-slate-100 relative">
      <a
        href="#intro"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
      <canvas ref={canvasRef} className="sky" aria-hidden="true" />

      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#intro"
              className="text-xl font-semibold text-sky-200 hover:text-sky-100 transition-colors"
            >
              Brian P. Bahati
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#about"
                className="text-slate-300 hover:text-sky-200 transition-colors"
                aria-label="Navigate to About section"
              >
                About
              </a>
              <a
                href="#projects"
                className="text-slate-300 hover:text-sky-200 transition-colors"
                aria-label="Navigate to Projects section"
              >
                Projects
              </a>
              <a
                href="#experience"
                className="text-slate-300 hover:text-sky-200 transition-colors"
                aria-label="Navigate to Experience section"
              >
                Experience
              </a>
              <a
                href="#services"
                className="text-slate-300 hover:text-sky-200 transition-colors"
                aria-label="Navigate to Services section"
              >
                Services
              </a>
              <a
                href="#appointment"
                className="text-slate-300 hover:text-sky-200 transition-colors"
                aria-label="Navigate to Book Appointment section"
              >
                Book Appointment
              </a>
              <a
                href="#contact"
                className="btn btn--stroke"
                aria-label="Navigate to Contact section"
              >
                Contact
              </a>
            </div>
            <button
              className="md:hidden text-slate-300 hover:text-sky-200"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={navOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {navOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#about"
                className="block text-slate-300 hover:text-sky-200 transition-colors"
                onClick={() => setNavOpen(false)}
              >
                About
              </a>
              <a
                href="#projects"
                className="block text-slate-300 hover:text-sky-200 transition-colors"
                onClick={() => setNavOpen(false)}
              >
                Projects
              </a>
              <a
                href="#experience"
                className="block text-slate-300 hover:text-sky-200 transition-colors"
                onClick={() => setNavOpen(false)}
              >
                Experience
              </a>
              <a
                href="#services"
                className="block text-slate-300 hover:text-sky-200 transition-colors"
                onClick={() => setNavOpen(false)}
              >
                Services
              </a>
              <a
                href="#appointment"
                className="block text-slate-300 hover:text-sky-200 transition-colors"
                onClick={() => setNavOpen(false)}
              >
                Book Appointment
              </a>
              <a
                href="#contact"
                className="block btn btn--stroke w-full text-center"
                onClick={() => setNavOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      <button
        className={`bulb-toggle btn-bulb ${daybreak ? 'is-on' : ''}`}
        onClick={() => setDaybreak((prev) => !prev)}
        aria-label="Toggle night and daylight mode"
        aria-pressed={daybreak}
        type="button"
      >
        <span className="sr-only">Toggle night and daylight mode</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`h-6 w-6 ${daybreak ? 'text-gray-900' : 'text-sky-200'}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9 21h6v-1H9v1Zm1-2h4v-1h-4v1Zm8-9a6 6 0 0 0-3-5.196V2h-2v2h-2V2H9v2.804A6 6 0 0 0 12 15a6 6 0 0 0 6-6Zm-6 5a5 5 0 0 1-2.5-9.35v.91h5v-.91A5 5 0 0 1 12 15Z" />
        </svg>
      </button>

      {!daybreak && (
        <div className="floating-star-controls floating-star-controls--top">
          <button className="btn" type="button" onClick={() => addStars(60)}>
            Add Stars
          </button>
          <button className="btn btn--stroke" type="button" onClick={clearAll}>
            Clear Stars
          </button>
        </div>
      )}

      <div className={`content ${daybreak ? 'marine' : ''}`}>
        <section className="panel space-panel" id="intro" aria-labelledby="intro-heading">
          <h1 id="intro-heading" className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3">
            Brian Patrick Bahati
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Software Engineer specializing in secure, scalable applications and open-source
            development. I design and build robust systems with a focus on security, performance,
            and maintainability.
            {daybreak
              ? ' In daylight mode, I focus on strategic planning, clear communication, and delivering high-quality solutions.'
              : ' Under the stars, I emphasize deep technical exploration, security-first architecture, and innovative problem-solving.'}
          </p>
          <div className="panel__actions">
            <a
              className="btn"
              href="https://github.com/Bahati308"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit my GitHub profile"
            >
              View GitHub
            </a>
            <a
              className="btn btn--stroke"
              href="mailto:bahatibrianp@gmail.com"
              aria-label="Send me an email"
            >
              Get In Touch
            </a>
            <a className="btn btn--stroke" href="#projects" aria-label="View my projects">
              View Projects
            </a>
          </div>
        </section>

        <section className="panel space-panel" id="about" aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-2xl sm:text-3xl font-serif mb-3">
            About
          </h2>
          <p className="text-slate-300 max-w-3xl mb-4">
            I am a Software Engineer with expertise in building secure, scalable applications and
            contributing to open-source projects. My approach combines clean architecture
            principles, security-first development practices, and pragmatic problem-solving. With
            professional certifications in Ethical Hacking, CyberOps, and CCNA, I bring a
            comprehensive understanding of both software engineering and cybersecurity to deliver
            robust, production-ready solutions.
          </p>
          <p className="text-slate-300 max-w-3xl mb-6">
            I specialize in full-stack development with a focus on creating maintainable codebases,
            implementing security best practices, and collaborating effectively within distributed
            teams. My experience includes contributing to large-scale open-source healthcare systems
            that serve millions of users worldwide.
          </p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Technical Expertise</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
              <li className="flex items-center gap-2">
                <span className="text-sky-300">•</span> Full-Stack Software Development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-300">•</span> Secure Software Architecture
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-300">•</span> System Design & Scalability
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-300">•</span> Cybersecurity & Application Security
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-300">•</span> Open Source Development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-300">•</span> Network Infrastructure & Security
              </li>
            </ul>
          </div>
          <div className="panel__actions">
            <a
              className="btn btn--stroke"
              href="mailto:bahatibrianp@gmail.com?subject=Resume Request"
              aria-label="Request my resume"
            >
              Request Resume
            </a>
          </div>
        </section>

        <section className="panel space-panel" id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="text-2xl sm:text-3xl font-serif mb-3">
            Featured Projects
          </h2>
          <p className="text-slate-300 max-w-3xl mb-6">
            Here are some of my key projects showcasing problem-solving, security-first development,
            and open-source contributions.
          </p>
          <div className="space-y-6">
            {/* OpenELIS Project */}
            <article className="rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-sky-300 mb-1">
                    OpenELIS — Laboratory Information System
                  </h3>
                  <p className="text-slate-400 text-sm">
                    June 2024 – Present | Open Source Contributor
                  </p>
                </div>
                <a
                  href="https://github.com/openelisglobal/openelisglobal-core"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:text-sky-200 transition-colors"
                  aria-label="View OpenELIS on GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Problem</h4>
                  <p className="text-slate-300 text-sm">
                    Medical laboratories needed a robust, open-source information system to manage
                    patient data, test results, and workflows efficiently while maintaining security
                    and compliance standards.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Process</h4>
                  <p className="text-slate-300 text-sm">
                    Contributing to OpenELIS as part of Google Summer of Code 2025, I work with
                    global teams to develop features, improve system architecture, and enhance
                    security measures. Focus areas include secure data handling, API development,
                    and workflow optimization.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Solution & Impact</h4>
                  <p className="text-slate-300 text-sm">
                    Developed and maintained features that streamline medical workflows, improve
                    data accuracy, and enhance system security. The platform now serves laboratories
                    worldwide, improving healthcare delivery through better information management.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Java
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Spring Framework
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Security
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Open Source
                  </span>
                </div>
              </div>
            </article>

            {/* OpenMRS Project */}
            <article className="rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-sky-300 mb-1">
                    OpenMRS — Medical Records System
                  </h3>
                  <p className="text-slate-400 text-sm">2021 – Present | Community Contributor</p>
                </div>
                <a
                  href="https://github.com/openmrs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:text-sky-200 transition-colors"
                  aria-label="View OpenMRS on GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Problem</h4>
                  <p className="text-slate-300 text-sm">
                    Healthcare facilities in resource-limited settings needed a free, open-source
                    medical records system that could be customized for local needs while
                    maintaining patient data security.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Process</h4>
                  <p className="text-slate-300 text-sm">
                    Collaborated with a global community of developers, healthcare professionals,
                    and implementers to develop features, fix bugs, improve documentation, and
                    enhance system security. Participated in code reviews, issue triage, and
                    community discussions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Solution & Impact</h4>
                  <p className="text-slate-300 text-sm">
                    Contributed to features and improvements that help OpenMRS serve millions of
                    patients worldwide. Enhanced system reliability, security, and usability through
                    code contributions and community engagement.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Java
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Healthcare IT
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Open Source
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Community
                  </span>
                </div>
              </div>
            </article>

            {/* Portfolio Website Project */}
            <article className="rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-sky-300 mb-1">
                    Interactive Portfolio Website
                  </h3>
                  <p className="text-slate-400 text-sm">2024 | Personal Project</p>
                </div>
                <a
                  href="https://github.com/Bahati308/Bahati308.github.io"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:text-sky-200 transition-colors"
                  aria-label="View portfolio source code on GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Problem</h4>
                  <p className="text-slate-300 text-sm">
                    Needed a professional portfolio that showcases technical skills while providing
                    an engaging, accessible user experience that stands out from typical portfolio
                    sites.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Process</h4>
                  <p className="text-slate-300 text-sm">
                    Built a responsive, interactive portfolio using React, Vite, and Tailwind CSS.
                    Implemented a unique night sky theme with canvas-based animations, dark/light
                    mode toggle, and an accessible chatbot interface. Focused on performance
                    optimization and SEO best practices.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Solution & Impact</h4>
                  <p className="text-slate-300 text-sm">
                    Created a visually striking portfolio that demonstrates both technical and
                    creative skills. The site features smooth animations, responsive design, and
                    accessibility features, effectively communicating professional capabilities to
                    potential clients and employers.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    React
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Vite
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Tailwind CSS
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Canvas API
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="panel space-panel" id="blog">
          <h2 className="text-2xl sm:text-3xl font-serif mb-3">Blog & Articles</h2>
          <div className="space-y-4">
            <article className="rounded-md border border-white/10 p-4 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-semibold mb-2">GSoC 2025 — OpenELIS</h3>
              <p className="text-slate-300 mb-2">
                Community bonding and ramp-up notes from Google Summer of Code 2025.
              </p>
              <a href="#blog" className="text-sky-300 hover:text-sky-200 text-sm">
                Read more →
              </a>
            </article>
            <article className="rounded-md border border-white/10 p-4 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Secure Web Development Practices</h3>
              <p className="text-slate-300 mb-2">
                Essential practices to avoid common vulnerabilities and build secure applications.
              </p>
              <a href="#blog" className="text-sky-300 hover:text-sky-200 text-sm">
                Read more →
              </a>
            </article>
          </div>
        </section>

        <section className="panel space-panel" id="education">
          <h2 className="text-2xl sm:text-3xl font-serif mb-3">Education</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-white/20 pl-4">
              <h3 className="font-semibold">Makerere University — Ethical Hacking Certification</h3>
              <p className="text-slate-300 text-sm">September 2023</p>
            </div>
            <div className="border-l-2 border-white/20 pl-4">
              <h3 className="font-semibold">Makerere University — CyberOps Certification</h3>
              <p className="text-slate-300 text-sm">August 2023</p>
            </div>
            <div className="border-l-2 border-white/20 pl-4">
              <h3 className="font-semibold">Bugema University — CCNA Certification</h3>
              <p className="text-slate-300 text-sm">November 2022</p>
            </div>
          </div>
        </section>

        <section className="panel space-panel" id="experience" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="text-2xl sm:text-3xl font-serif mb-3">
            Experience
          </h2>
          <div className="space-y-6">
            <div className="border-l-2 border-sky-500/50 pl-4">
              <h3 className="font-semibold text-lg">OpenELIS — Developer</h3>
              <p className="text-slate-300 text-sm mb-2">June 2024 – Present</p>
              <p className="text-slate-300 mb-3">
                Contributing to an open-source laboratory information system to streamline medical
                workflows and improve healthcare delivery in resource-limited settings.
              </p>
              <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                <li>
                  Developed and maintained features improving system reliability and user experience
                </li>
                <li>Enhanced security measures for sensitive medical data handling</li>
                <li>Participated in Google Summer of Code 2025 program</li>
                <li>
                  Collaborated with international team of developers and healthcare professionals
                </li>
              </ul>
            </div>
            <div className="border-l-2 border-sky-500/50 pl-4">
              <h3 className="font-semibold text-lg">OpenMRS — Community Contributor</h3>
              <p className="text-slate-300 text-sm mb-2">2021 – Present</p>
              <p className="text-slate-300 mb-3">
                Active contributor to OpenMRS, a global open-source medical records platform serving
                millions of patients worldwide.
              </p>
              <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                <li>Contributed code improvements, bug fixes, and feature enhancements</li>
                <li>Improved documentation and developer onboarding materials</li>
                <li>Participated in code reviews and community discussions</li>
                <li>Mentored new contributors and helped grow the community</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="panel space-panel" id="services" aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-2xl sm:text-3xl font-serif mb-3">
            Services Offered
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-lg border border-white/10 bg-white/10 backdrop-blur px-5 py-5">
              <h3 className="text-xl font-semibold text-sky-300">Web Designing</h3>
              <p className="text-slate-200 mt-2">
                Immersive experiences, responsive layouts, and secure full-stack builds tailored to
                your product or personal brand.
              </p>
            </article>
            <article className="rounded-lg border border-white/10 bg-white/10 backdrop-blur px-5 py-5">
              <h3 className="text-xl font-semibold text-sky-300">Cybersecurity Awareness</h3>
              <p className="text-slate-200 mt-2">
                Workshops, threat briefings, and practical checklists that strengthen teams against
                social engineering and modern exploits.
              </p>
            </article>
            <article className="rounded-lg border border-white/10 bg-white/10 backdrop-blur px-5 py-5">
              <h3 className="text-xl font-semibold text-sky-300">Open Source Publicity</h3>
              <p className="text-slate-200 mt-2">
                Community advocacy, contributor onboarding, and storytelling that amplifies
                open-source initiatives.
              </p>
            </article>
          </div>
        </section>

        <section
          className="panel space-panel"
          id="appointment"
          aria-labelledby="appointment-heading"
        >
          <h2 id="appointment-heading" className="text-2xl sm:text-3xl font-serif mb-3">
            Book an Appointment
          </h2>
          <p className="text-slate-300 max-w-3xl mb-6">
            Schedule a consultation to discuss your project, explore collaboration opportunities, or
            get expert advice on software engineering, security, or open-source development. Choose
            a time that works best for you.
          </p>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-sky-300 mb-3">Consultation Options</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-sky-300 mt-1">•</span>
                  <div>
                    <span className="font-semibold">Project Consultation</span>
                    <p className="text-sm text-slate-400">
                      Discuss your software project requirements and get expert guidance
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-300 mt-1">•</span>
                  <div>
                    <span className="font-semibold">Technical Review</span>
                    <p className="text-sm text-slate-400">
                      Code review, architecture consultation, or security assessment
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-300 mt-1">•</span>
                  <div>
                    <span className="font-semibold">Career Guidance</span>
                    <p className="text-sm text-slate-400">
                      Advice on software engineering careers, certifications, and skill development
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-300 mt-1">•</span>
                  <div>
                    <span className="font-semibold">Open Source Collaboration</span>
                    <p className="text-sm text-slate-400">
                      Discuss contributing to open-source projects or starting your own
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-sky-300 mb-3">Schedule Your Meeting</h3>
              <p className="text-slate-300 mb-4 text-sm">
                Use the booking link below to select your preferred date and time. Meetings are
                typically 30-60 minutes and can be conducted via video call or in-person (when
                available).
              </p>
              <div className="space-y-3">
                <a
                  href="https://calendly.com/brian-bahati"
                  target="_blank"
                  rel="noreferrer"
                  className="btn block text-center"
                  aria-label="Book an appointment via Calendly"
                >
                  Book via Calendly
                </a>
                <a
                  href="mailto:bahatibrianp@gmail.com?subject=Appointment Request&body=Hi Brian,%0D%0A%0D%0AI would like to schedule an appointment. Please let me know your availability.%0D%0A%0D%0APreferred date/time:%0D%0ATopic:%0D%0A%0D%0AThank you!"
                  className="btn btn--stroke block text-center"
                  aria-label="Request appointment via email"
                >
                  Request via Email
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Note:</strong> If you don't see available times
                  that work for you, please email me directly and I'll do my best to accommodate
                  your schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel space-panel" id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl font-serif mb-3">
            Let's Connect
          </h2>
          <p className="text-slate-300 max-w-3xl mb-6">
            I'm always open to discussing new opportunities, collaborations, or answering questions
            about software engineering, security, or open-source contributions. Feel free to reach
            out!
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <a
              href="mailto:bahatibrianp@gmail.com"
              className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              aria-label="Send me an email"
            >
              <h3 className="font-semibold text-sky-300 mb-2">Email</h3>
              <p className="text-slate-300 text-sm">bahatibrianp@gmail.com</p>
            </a>
            <a
              href="https://github.com/Bahati308"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              aria-label="Visit my GitHub profile"
            >
              <h3 className="font-semibold text-sky-300 mb-2">GitHub</h3>
              <p className="text-slate-300 text-sm">@Bahati308</p>
            </a>
            <a
              href="https://www.linkedin.com/in/brian-patrick-bahati"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              aria-label="Visit my LinkedIn profile"
            >
              <h3 className="font-semibold text-sky-300 mb-2">LinkedIn</h3>
              <p className="text-slate-300 text-sm">brian-patrick-bahati</p>
            </a>
            <a
              href="mailto:bahatibrianp@gmail.com?subject=Resume Request"
              className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              aria-label="Request my resume"
            >
              <h3 className="font-semibold text-sky-300 mb-2">Resume</h3>
              <p className="text-slate-300 text-sm">Available upon request</p>
            </a>
          </div>
          <div className="panel__actions">
            <a
              className="btn"
              href="mailto:bahatibrianp@gmail.com?subject=Project Inquiry"
              aria-label="Send me a project inquiry"
            >
              Start a Project
            </a>
            <a
              className="btn btn--stroke"
              href="https://github.com/Bahati308"
              target="_blank"
              rel="noreferrer"
              aria-label="View my GitHub profile"
            >
              View GitHub
            </a>
          </div>
        </section>

        <footer className="footer" role="contentinfo">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Brian Patrick Bahati. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Floating full-moon chatbot */}
      <button
        aria-label="Open moon chat assistant"
        className="fixed bottom-6 right-6 moon border border-white/10 z-50"
        onClick={() => setChatOpen(true)}
        title="Chat with the Moon - Ask questions about Brian, IT careers, or skills"
        type="button"
      />

      {chatOpen && (
        <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-24 sm:right-6 w-auto sm:w-[360px] text-slate-100 z-50">
          <div className="chat-card rounded-xl border border-white/10 bg-black/40 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="moon w-10 h-10" />
                <div>
                  <div className="font-semibold">
                    Moon Bot • <span className="text-sky-400">Brian Patrick Bahati</span>
                  </div>
                  <div className="text-xs text-slate-300">Friendly IT & site assistant</div>
                </div>
              </div>
              <button
                aria-label="Close chat"
                className="text-slate-300 hover:text-white"
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
            </div>
            {/* Quick FAQs chips */}
            <div className="px-4 pt-3 flex gap-2 overflow-auto">
              {faqs.slice(0, 6).map((f, i) => (
                <button
                  key={i}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-3 py-1 whitespace-nowrap"
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      { role: 'user', text: f.q },
                      { role: 'bot', text: f.a },
                    ])
                  }}
                >
                  {f.q}
                </button>
              ))}
            </div>
            <div
              ref={chatListRef}
              className="max-h-[50vh] sm:max-h-[280px] overflow-auto px-4 py-3 space-y-3"
            >
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={
                      'inline-block rounded-lg px-3 py-2 text-sm ' +
                      (m.role === 'user' ? 'bg-sky-600/70' : 'bg-white/10')
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex items-center gap-2 px-3 py-3 border-t border-white/10"
              onSubmit={(e) => {
                e.preventDefault()
                const value = inputRef.current?.value?.trim()
                if (!value) return
                setMessages((prev) => [...prev, { role: 'user', text: value }])
                // simple local bot reply with FAQ search
                const lower = value.toLowerCase()
                let reply = ''
                if (lower === 'faq' || lower.includes('faqs')) {
                  reply = 'FAQs: ' + faqs.map((f) => f.q).join(' • ')
                } else if (lower.includes('brian') || lower.includes('bahati')) {
                  reply =
                    'Brian is a cybersecurity professional and web developer with OpenMRS/OpenELIS experience.'
                } else if (lower.includes('experience')) {
                  reply =
                    'Experience: OpenMRS (Community Contributor), OpenELIS (Developer) — see Experience section.'
                } else if (lower.includes('education') || lower.includes('cert')) {
                  reply =
                    'Education/Certs: Ethical Hacking (Sep 2023), CyberOps (Aug 2023), CCNA (Nov 2022).'
                } else if (lower.includes('blog')) {
                  reply = 'See the Blog section for GSoC and security posts.'
                } else if (lower.includes('contact') || lower.includes('email')) {
                  reply = 'Reach Brian at bahatibrianp@gmail.com.'
                } else {
                  // keyword match against FAQs
                  const hit = faqs.find((f) => {
                    const tokens = f.q.toLowerCase().split(/\W+/)
                    return tokens.some((t) => t && lower.includes(t))
                  })
                  reply = hit
                    ? hit.a
                    : 'I can help with IT skills, security, networking, cloud, DevOps, careers — type “faq”.'
                }
                setTimeout(() => {
                  setMessages((prev) => [...prev, { role: 'bot', text: reply }])
                }, 300)
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Brian, sections, or features..."
                className="carbon-field flex-1 rounded-md px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none"
              />
              <button type="submit" className="btn">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
