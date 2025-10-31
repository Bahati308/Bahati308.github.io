import React, { useEffect, useRef, useState } from 'react'

function rand(min, max) { return Math.random() * (max - min) + min }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

export default function App() {
  const canvasRef = useRef(null)
  const [starsCount, setStarsCount] = useState(0)
  const [commitCount, setCommitCount] = useState(0)
  const [daybreak, setDaybreak] = useState(false)

  // simple sim entities kept in ref to avoid rerenders
  const simRef = useRef({ stars: [], comets: [], planets: [], galaxies: [], bg: { img: null, x: 0, y: 0, vx: 1.2, vy: 0.9, w: 100, h: 100, alpha: 0.08 } })
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi, I’m Moon Bot. Ask about Brian, IT careers, skills, tools, or type “faq”.' }
  ])
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
    { q: 'What does an IT specialist do?', a: 'Designs, implements, and supports systems: networks, servers, endpoints, apps, and security controls.' },
    { q: 'Key IT specialist skills?', a: 'Networking (TCP/IP, DNS), OS (Linux/Windows), scripting (Bash/Python), cloud basics, troubleshooting, documentation.' },
    { q: 'Cybersecurity basics to learn?', a: 'Threat modeling, least privilege, patching, secure configs, SIEM basics, OWASP Top 10, incident response basics.' },
    { q: 'Common certifications?', a: 'CompTIA A+, Network+, Security+, CCNA, AWS Cloud Practitioner, Linux+, CYSA+, CEH (verify relevance).' },
    { q: 'Scripting vs programming?', a: 'Scripting automates admin tasks (Bash/Python/PowerShell). Programming builds apps/services with deeper engineering.' },
    { q: 'Monitoring tools?', a: 'Prometheus, Grafana, ELK/Opensearch, Zabbix, Nagios, Datadog, CloudWatch, Sentinel/Splunk for security.' },
    { q: 'Ticketing/ITSM tools?', a: 'Jira Service Management, ServiceNow, Freshservice, Zendesk. Emphasize SLAs, runbooks, postmortems.' },
    { q: 'Backup best practices?', a: '3-2-1 rule, test restores, encrypt backups, offsite/immutable storage, document RPO/RTO.' },
    { q: 'Disaster recovery vs high availability?', a: 'HA reduces downtime via redundancy. DR recovers after failure via backups, replicas, runbooks, and drills.' },
    { q: 'Networking essentials?', a: 'IP addressing, subnets/VLANs, routing, NAT, DNS/DHCP, VPNs, firewalls, Wi‑Fi, TLS/PKI.' },
    { q: 'Security hardening tips?', a: 'MFA, patching, CIS Benchmarks, firewall least access, logging, EDR/AV, secrets management, zero trust principles.' },
    { q: 'Cloud fundamentals?', a: 'IaaS/PaaS/SaaS, regions/AZs, IAM, VPCs, security groups, managed databases, cost controls, backups.' },
    { q: 'DevOps basics?', a: 'Version control (Git), CI/CD, Infrastructure as Code (Terraform), containers (Docker), observability, shift-left security.' },
    { q: 'Help desk to sysadmin path?', a: 'Start with support and scripting, earn Net+/Sec+, shadow infra work, take small ownerships, build homelab, document.' },
    { q: 'Homelab ideas?', a: 'Proxmox/VMware, Docker, Pi-hole, WireGuard, ELK, Kubernetes basics, Ansible playbooks, monitoring stack, break-and-fix drills.' },
    { q: 'Interview prep?', a: 'Practice troubleshooting stories (STAR), review fundamentals, lab projects, be clear on tradeoffs and incident lessons.' },
    { q: 'Soft skills?', a: 'Clear communication, prioritization, incident calm, collaboration, writing docs/runbooks, customer empathy.' },
  ]

  // init planets
  useEffect(() => {
    simRef.current.planets = [
      { r: 80,  a: rand(0, Math.PI * 2), speed: 0.00045, size: 5, color: '#74c0fc', spin: rand(0, Math.PI*2), spinSpeed: 0.0009, moons: [{ r: 22, a: 0, speed: 0.0013, size: 2 }] },
      { r: 130, a: rand(0, Math.PI * 2), speed: 0.00032, size: 7, color: '#38bdf8', spin: rand(0, Math.PI*2), spinSpeed: 0.0007, moons: [{ r: 28, a: 0.5, speed: 0.0010, size: 2 }] },
      { r: 190, a: rand(0, Math.PI * 2), speed: 0.00026, size: 9, color: '#ffd43b', spin: rand(0, Math.PI*2), spinSpeed: 0.0006, moons: [{ r: 36, a: 0.2, speed: 0.0009, size: 3 }] },
      { r: 250, a: rand(0, Math.PI * 2), speed: 0.00020, size: 8, color: '#b197fc', spin: rand(0, Math.PI*2), spinSpeed: 0.0008, moons: [{ r: 26, a: 0.7, speed: 0.0011, size: 2 }] },
      { r: 320, a: rand(0, Math.PI * 2), speed: 0.00016, size: 11, color: '#fb7185', spin: rand(0, Math.PI*2), spinSpeed: 0.0005, moons: [{ r: 50, a: 1.1, speed: 0.0007, size: 3 }, { r: 34, a: 2.2, speed: 0.0012, size: 2 }] },
      { r: 390, a: rand(0, Math.PI * 2), speed: 0.00013, size: 7, color: '#34d399', spin: rand(0, Math.PI*2), spinSpeed: 0.0010, moons: [] }
    ]
  }, [])

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
        const d2 = dx*dx + dy*dy
        if (d2 < 140*140) {
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
    cnv.addEventListener('pointermove', (e) => { if (e.buttons) pointer(e) })
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
      stars.push({
        x: rand(0, cnv.clientWidth),
        y: rand(0, cnv.clientHeight),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        r: rand(1.2, 2.6),
        hue: rand(200, 260)
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
    const id = setInterval(() => {
      // spawn multiple commits with mixed directions
      const dir1 = Math.random() < 0.5 ? 'ltr' : 'rtl'
      commitNow(dir1)
      if (Math.random() < 0.7) commitNow(dir1 === 'ltr' ? 'rtl' : 'ltr')
      if (Math.random() < 0.35) commitNow(Math.random() < 0.5 ? 'ltr' : 'rtl')
    }, 2200)
    return () => clearInterval(id)
  }, [])

  // initial stars
  useEffect(() => { addStars(120) }, [])

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

      // background gradient (night to daybreak)
      const grd = ctx.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, daybreak ? '#1e3a8a' : '#050617')
      grd.addColorStop(1, daybreak ? '#f59e0b' : '#0b1028')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      const centerX = w / 2
      const centerY = h / 2

      // initialize galaxies once we know dimensions
      const sim = simRef.current
      if (sim.galaxies.length === 0) {
        sim.galaxies = [
          { x: w * 0.22, y: h * 0.28, rot: rand(0, 6.28), speed: 0.00004, arms: 4, spread: 120, hue: 210 },
          { x: w * 0.78, y: h * 0.18, rot: rand(0, 6.28), speed: 0.00005, arms: 3, spread: 90, hue: 275 },
          { x: w * 0.72, y: h * 0.72, rot: rand(0, 6.28), speed: 0.00003, arms: 5, spread: 140, hue: 195 }
        ]
      }

      // galaxies (soft spiral starfields)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let g of sim.galaxies) {
        g.rot += g.speed * dt * 16.67
        const particles = 240
        for (let i = 0; i < particles; i++) {
          const arm = i % g.arms
          const t = (i / particles) * Math.PI * 4 + arm * (2 * Math.PI / g.arms) + g.rot
          const r = (i / particles) * g.spread
          const x = g.x + Math.cos(t) * r + rand(-2, 2)
          const y = g.y + Math.sin(t) * r + rand(-2, 2)
          const alpha = 0.05 + 0.25 * (1 - i / particles)
          ctx.fillStyle = `hsla(${g.hue}, 80%, 75%, ${alpha})`
          ctx.fillRect(x, y, 1.2, 1.2)
        }
      }
      ctx.restore()

      // sun
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = daybreak ? 'rgba(255,200,80,0.45)' : 'rgba(255,200,80,0.1)'
      const sunY = daybreak ? h * 0.75 : h + 80
      ctx.beginPath()
      ctx.arc(centerX, sunY, 140, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'

      // background bouncing image (behind galaxies/planets/stars)
      const bg = simRef.current.bg
      if (!bg.img) {
        const image = new Image()
        image.src = '/letterB.jpg'
        image.onload = () => {
          simRef.current.bg.img = image
          simRef.current.bg.w = Math.min(140, image.width)
          simRef.current.bg.h = Math.min(140, image.height)
          simRef.current.bg.x = rand(0, Math.max(0, w - simRef.current.bg.w))
          simRef.current.bg.y = rand(0, Math.max(0, h - simRef.current.bg.h))
        }
      }
      if (bg.img) {
        bg.x += bg.vx * dt
        bg.y += bg.vy * dt
        if (bg.x <= 0 || bg.x + bg.w >= w) { bg.vx *= -1; bg.x = clamp(bg.x, 0, Math.max(0, w - bg.w)) }
        if (bg.y <= 0 || bg.y + bg.h >= h) { bg.vy *= -1; bg.y = clamp(bg.y, 0, Math.max(0, h - bg.h)) }
        ctx.save()
        ctx.globalAlpha = bg.alpha
        ctx.drawImage(bg.img, bg.x, bg.y, bg.w, bg.h)
        ctx.restore()
      }

      // planets & moons (scaled down to ~2x, with axial self-rotation visual)
      const planetScale = 2
      for (let p of simRef.current.planets) {
        p.a += p.speed * dt * 16.67
        if (p.spin !== undefined) p.spin += p.spinSpeed * dt * 16.67
        const px = centerX + Math.cos(p.a) * p.r
        const py = centerY + Math.sin(p.a) * p.r
        const R = p.size * planetScale
        // body gradient to fake shading
        const grad = ctx.createRadialGradient(px - R*0.4, py - R*0.4, R*0.2, px, py, R)
        grad.addColorStop(0, 'white')
        grad.addColorStop(0.15, p.color)
        grad.addColorStop(1, 'black')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2); ctx.fill()
        // subtle rim glow
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(px, py, R+0.5, 0, Math.PI * 2); ctx.stroke()
        // axial features (equatorial bands) rotating with spin
        if (p.spin !== undefined) {
          ctx.save()
          ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2); ctx.clip()
          ctx.translate(px, py)
          ctx.rotate(p.spin)
          ctx.strokeStyle = 'rgba(255,255,255,0.12)'
          ctx.lineWidth = Math.max(1, R * 0.06)
          for (let k = -1; k <= 1; k++) {
            ctx.beginPath()
            ctx.ellipse(0, 0, R * 0.95, R * (0.18 + k*0.06), 0, 0, Math.PI * 2)
            ctx.stroke()
          }
          ctx.restore()
        }
        // optional rings for larger planets
        if (R > 40) {
          ctx.save()
          ctx.translate(px, py)
          ctx.rotate(p.a * 0.5)
          ctx.strokeStyle = 'rgba(255,255,255,0.18)'
          ctx.lineWidth = 3
          ctx.beginPath(); ctx.ellipse(0, 0, R * 1.6, R * 0.5, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        for (let m of p.moons) {
          m.a += m.speed * dt * 16.67
          const mx = px + Math.cos(m.a) * m.r
          const my = py + Math.sin(m.a) * m.r
          ctx.fillStyle = '#e5e7eb'
          ctx.beginPath(); ctx.arc(mx, my, m.size * planetScale, 0, Math.PI * 2); ctx.fill()
        }
      }

      // stars physics
      const stars = simRef.current.stars
      for (let s of stars) {
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.vx *= 0.995
        s.vy *= 0.995
        if (s.x < 0 || s.x > w) s.vx *= -1, s.x = clamp(s.x, 0, w)
        if (s.y < 0 || s.y > h) s.vy *= -1, s.y = clamp(s.y, 0, h)
      }
      // draw stars
      for (let s of stars) {
        ctx.fillStyle = `hsl(${s.hue}, 80%, 80%)`
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      }

      // comets (shooting stars)
      const comets = simRef.current.comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i]
        c.x += c.vx * dt
        c.life -= 0.008 * dt
        // tail (opposite to velocity)
        const tail = 80
        const tailX = c.vx >= 0 ? c.x - tail : c.x + tail
        const tailY = c.vx >= 0 ? c.y + 10 : c.y - 10
        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${clamp(c.life,0,1)})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(c.x, c.y); ctx.stroke()
        ctx.fillStyle = 'white'
        ctx.beginPath(); ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2); ctx.fill()
        if (c.x > w + 100 || c.x < -100 || c.life <= 0) comets.splice(i, 1)
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
    const speedPxPerSec = 40
    function step(ts) {
      if (!autoScroll) return
      const dt = Math.min(32, (ts - (last || ts)))
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointerdown', stop) }
  }, [autoScroll])

  return (
    <div className="min-h-screen text-slate-100 relative">
      <canvas ref={canvasRef} className="sky" />
      <header className="ui">
        <div className="ui__stats ml-auto mr-2">
          <span>★ {starsCount}</span>
          <span>☄︎ {commitCount}</span>
        </div>
      </header>

      <div className="content pt-24">
      <section className="panel" id="intro">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3">Brian Patrick Bahati</h1>
        <p className="text-slate-300 max-w-3xl">
          Cybersecurity professional, ethical hacker, and web developer. I build secure
          web applications, contribute to open source, and mentor developers.
        </p>
        <div className="panel__actions">
          <a className="btn" href="https://github.com/Bahati308" target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn btn--stroke" href="mailto:bahatibrianp@gmail.com">Contact</a>
        </div>
      </section>

      <section className="panel" id="about">
        <h2 className="text-2xl sm:text-3xl font-serif mb-3">About</h2>
        <p className="text-slate-300 max-w-3xl">
          I am a professional web developer and ethical hacker with a passion for
          cybersecurity and open-source collaboration. I focus on clean architecture,
          secure coding, and practical problem solving.
        </p>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
          <li>Cybersecurity</li>
          <li>Networking</li>
          <li>Ethical Hacking</li>
          <li>Web Development</li>
          <li>Open Source</li>
          <li>Linux</li>
        </ul>
      </section>

      <section className="panel" id="blog">
        <h2 className="text-2xl sm:text-3xl font-serif mb-3">Blog</h2>
        <div className="space-y-4">
          <article className="rounded-md border border-white/10 p-4 bg-white/5">
            <h3 className="text-xl font-semibold">GSoC 2025 — OpenELIS</h3>
            <p className="text-slate-300">Community bonding and ramp-up notes.</p>
          </article>
          <article className="rounded-md border border-white/10 p-4 bg-white/5">
            <h3 className="text-xl font-semibold">Secure Web Development</h3>
            <p className="text-slate-300">Essential practices to avoid common vulnerabilities.</p>
          </article>
        </div>
      </section>

      <section className="panel" id="education">
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

      <section className="panel" id="experience">
        <h2 className="text-2xl sm:text-3xl font-serif mb-3">Experience</h2>
        <div className="space-y-6">
          <div className="border-l-2 border-white/20 pl-4">
            <h3 className="font-semibold">OpenMRS — Community Contributor</h3>
            <p className="text-slate-300 text-sm">2021 – Present</p>
            <p className="text-slate-300 mt-2">Collaborated with global teams to develop features, resolve issues, and
              improve documentation.</p>
          </div>
          <div className="border-l-2 border-white/20 pl-4">
            <h3 className="font-semibold">OpenELIS — Developer</h3>
            <p className="text-slate-300 text-sm">June 2024 – Present</p>
            <p className="text-slate-300 mt-2">Contributing to an open-source laboratory information system to streamline
              medical workflows.</p>
          </div>
        </div>
      </section>

      <section className="panel" id="testimonials">
        <h2 className="text-2xl sm:text-3xl font-serif mb-3">Testimonials</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <blockquote className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-200">“In programming, the real challenge is not just writing code that works,
              but writing code that’s clean, efficient, and scalable.”</p>
            <div className="mt-3 text-slate-400 text-sm">— Linus Torvalds</div>
          </blockquote>
          <blockquote className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-200">“Code isn't just lines of text—it's the architecture of our future.”</p>
            <div className="mt-3 text-slate-400 text-sm">— Edward Snowden</div>
          </blockquote>
          <blockquote className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-200">“Computers are more than machines; they are the gateways to innovation.”</p>
            <div className="mt-3 text-slate-400 text-sm">— Brian P. Bahati</div>
          </blockquote>
          <blockquote className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-200">“The only way to do great work is to love what you do.”</p>
            <div className="mt-3 text-slate-400 text-sm">— Steve Jobs</div>
          </blockquote>
        </div>
      </section>

      <section className="panel" id="stars">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3">Knock The Stars</h1>
        <p className="text-slate-300 max-w-2xl">Tap or drag to nudge nearby stars. They glide and gently collide.</p>
        <div className="panel__actions">
          <button className="btn" onClick={() => addStars(60)}>Add Stars</button>
          <button className="btn btn--stroke" onClick={clearAll}>Clear</button>
        </div>
      </section>

      <section className="panel" id="commits">
        <h2 className="text-2xl sm:text-3xl font-serif mb-3">Shooting-Star Commits</h2>
        <p className="text-slate-300 max-w-2xl">Commits streak across the sky periodically. Click to spawn one.</p>
        <div className="panel__actions">
          <button className="btn" onClick={commitNow}>Commit (☄︎)</button>
        </div>
      </section>

      <section className="panel" id="sun">
        <h2 className="text-2xl sm:text-3xl font-serif mb-3">The Sun</h2>
        <p className="text-slate-300 max-w-2xl">Toggle daybreak to raise the sun and warm the horizon.</p>
        <div className="panel__actions">
          <button className="btn" onClick={() => setDaybreak(v => !v)}>Toggle Daybreak</button>
        </div>
      </section>

      <footer className="footer">
        <span className="block">Night Sky • React + Vite + Tailwind</span>
        <span className="block">Click, drag, and enjoy</span>
      </footer>
      </div>

      {/* Floating full-moon chatbot */}
      <button
        aria-label="Open moon chat"
        className="fixed bottom-6 right-6 moon border border-white/10 z-50"
        onClick={() => setChatOpen(true)}
        title="Chat with the Moon"
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
              >✕</button>
            </div>
            {/* Quick FAQs chips */}
            <div className="px-4 pt-3 flex gap-2 overflow-auto">
              {faqs.slice(0, 6).map((f, i) => (
                <button
                  key={i}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-3 py-1 whitespace-nowrap"
                  onClick={() => {
                    setMessages((prev) => [...prev, { role: 'user', text: f.q }, { role: 'bot', text: f.a }])
                  }}
                >{f.q}</button>
              ))}
            </div>
            <div ref={chatListRef} className="max-h-[50vh] sm:max-h-[280px] overflow-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={
                    'inline-block rounded-lg px-3 py-2 text-sm ' +
                    (m.role === 'user' ? 'bg-sky-600/70' : 'bg-white/10')
                  }>
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
                  reply = 'FAQs: ' + faqs.map(f => f.q).join(' • ')
                } else if (lower.includes('brian') || lower.includes('bahati')) {
                  reply = 'Brian is a cybersecurity professional and web developer with OpenMRS/OpenELIS experience.'
                } else if (lower.includes('experience')) {
                  reply = 'Experience: OpenMRS (Community Contributor), OpenELIS (Developer) — see Experience section.'
                } else if (lower.includes('education') || lower.includes('cert')) {
                  reply = 'Education/Certs: Ethical Hacking (Sep 2023), CyberOps (Aug 2023), CCNA (Nov 2022).'
                } else if (lower.includes('blog')) {
                  reply = 'See the Blog section for GSoC and security posts.'
                } else if (lower.includes('contact') || lower.includes('email')) {
                  reply = 'Reach Brian at bahatibrianp@gmail.com.'
                } else {
                  // keyword match against FAQs
                  const hit = faqs.find(f => {
                    const tokens = f.q.toLowerCase().split(/\W+/)
                    return tokens.some(t => t && lower.includes(t))
                  })
                  reply = hit ? hit.a : 'I can help with IT skills, security, networking, cloud, DevOps, careers — type “faq”.'
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
                className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <button type="submit" className="btn">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


