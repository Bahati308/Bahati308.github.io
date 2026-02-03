import React, { useEffect, useState, useRef } from 'react'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })

  // Custom cursor state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorHover, setCursorHover] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cursorRef = useRef(null)
  const rafRef = useRef(null)

  // Smooth scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'blog', 'experience', 'other-life', 'contact']
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on link click
  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  // Detect mobile/touch devices - disable cursor on mobile
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isTouchDevice || isSmallScreen)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Custom cursor movement tracking
  useEffect(() => {
    if (isMobile) return

    let rafId = null
    let mouseX = 0
    let mouseY = 0

    const updateCursorPosition = () => {
      setCursorPos({ x: mouseX, y: mouseY })
      rafId = null
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!rafId) {
        rafId = requestAnimationFrame(updateCursorPosition)
      }
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (!target) return

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[role="button"]') !== null ||
        (window.getComputedStyle(target).cursor === 'pointer' && target.tagName !== 'BODY')

      setCursorHover(isInteractive)
    }

    const handleMouseOut = (e) => {
      // Only reset if we're leaving the document or going to a non-interactive element
      if (
        !e.relatedTarget ||
        e.relatedTarget === document.body ||
        e.relatedTarget === document.documentElement
      ) {
        setCursorHover(false)
      }
    }

    const handleClick = (e) => {
      // Create ripple effect
      const ripple = document.createElement('div')
      ripple.className = 'cursor-ripple'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      document.body.appendChild(ripple)

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove()
        }
      }, 600)
    }

    // Use capture phase for better hover detection
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { capture: true, passive: true })
    document.addEventListener('mouseout', handleMouseOut, { capture: true, passive: true })
    document.addEventListener('click', handleClick, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver, { capture: true })
      document.removeEventListener('mouseout', handleMouseOut, { capture: true })
      document.removeEventListener('click', handleClick)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  // Blog categories
  const blogCategories = [
    {
      title: 'Physical Intelligence',
      description:
        'Exploring the intersection of robotics, AI, and physical systems. Insights on building intelligent machines that interact with the real world.',
      icon: '🤖',
    },
    {
      title: 'Automation',
      description:
        'Best practices, tools, and strategies for automating software development, testing, and deployment pipelines.',
      icon: '⚙️',
    },
    {
      title: 'Cybersecurity',
      description:
        'Security-first development practices, threat mitigation strategies, and building resilient systems.',
      icon: '🔒',
    },
    {
      title: 'Ethical Hacking',
      description:
        'Penetration testing, vulnerability assessment, and responsible disclosure practices for secure systems.',
      icon: '🛡️',
    },
    {
      title: 'Open Source Contributions',
      description:
        'Contributions to open-source projects, community engagement, and lessons learned from collaborative development.',
      icon: '🌐',
    },
    {
      title: 'Cloud Computing',
      description:
        'Cloud infrastructure, architecture patterns, scalability solutions, and best practices for deploying and managing applications in the cloud.',
      icon: '☁️',
    },
  ]

  // Experience data
  const experiences = [
    {
      title: 'Software Developer',
      company: 'Open Data Ensemble (ODE)',
      period: 'November 2025 – Present',
      description: [
        'Developing scalable software solutions for data management and analytics',
        'Implementing secure and efficient data processing systems',
        'Collaborating with cross-functional teams to deliver high-quality products',
        'Contributing to open data initiatives and platform development',
      ],
    },
    {
      title: 'Developers Team Lead',
      company: 'Sapiens Solution',
      period: 'November 2025 – Present',
      description: [
        'Leading development teams in building innovative software solutions',
        'Architecting scalable systems with focus on security and performance',
        'Mentoring developers and establishing best practices',
        'Driving technical decisions and ensuring code quality standards',
      ],
    },
    {
      title: 'Open Source Contributor-QA',
      company: 'OpenELIS',
      period: 'June 2024 – Present',
      description: [
        'Contributing to open-source laboratory information system serving millions of users',
        'Developing secure features for medical data handling and workflow optimization',
        'Participating in Google Summer of Code 2025 program',
        'Collaborating with international teams on large-scale healthcare systems',
      ],
    },
    {
      title: 'Open Source Contributor',
      company: 'OpenMRS',
      period: '2021 – Present',
      description: [
        'Active contributor to global open-source medical records platform',
        'Implemented features, bug fixes, and security enhancements',
        'Mentored new contributors and improved developer documentation',
        'Participated in code reviews and community discussions',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Cursor - Only on desktop */}
      {!isMobile && (
        <>
          <div
            ref={cursorRef}
            className={`custom-cursor ${cursorHover ? 'cursor-hover' : ''}`}
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
            }}
            aria-hidden="true"
          />
        </>
      )}
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#hero"
              className="text-xl font-display text-sky-blue hover:text-gold transition-colors"
              onClick={handleNavClick}
            >
              <span className="font-normal">Brian P.</span>{' '}
              <span className="font-bold">Bahati</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#about"
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'about'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-700 hover:text-sky-blue'
                }`}
              >
                About
              </a>
              <a
                href="#blog"
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'blog'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-700 hover:text-sky-blue'
                }`}
              >
                Blog
              </a>
              <a
                href="#experience"
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'experience'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-700 hover:text-sky-blue'
                }`}
              >
                Experience
              </a>
              <a
                href="#other-life"
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'other-life'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-700 hover:text-sky-blue'
                }`}
              >
                Other Life
              </a>
              <a
                href="#contact"
                className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-opacity-90 hover:outline hover:outline-2 hover:outline-gold transition-all"
              >
                Contact
              </a>
            </div>
            <button
              className="md:hidden text-gray-700 hover:text-sky-blue"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
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
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#about"
                className="block text-gray-700 hover:text-sky-blue transition-colors"
                onClick={handleNavClick}
              >
                About
              </a>
              <a
                href="#blog"
                className="block text-gray-700 hover:text-sky-blue transition-colors"
                onClick={handleNavClick}
              >
                Blog
              </a>
              <a
                href="#experience"
                className="block text-gray-700 hover:text-sky-blue transition-colors"
                onClick={handleNavClick}
              >
                Experience
              </a>
              <a
                href="#other-life"
                className="block text-gray-700 hover:text-sky-blue transition-colors"
                onClick={handleNavClick}
              >
                Other Life
              </a>
              <a
                href="#contact"
                className="block px-4 py-2 bg-sky-blue text-white rounded-lg text-center hover:bg-opacity-90 transition-colors"
                onClick={handleNavClick}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-blue/10 via-white to-gold/10 pt-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img
              src="/letterB.jpg"
              alt="Brian Patrick Bahati"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gold shadow-lg object-cover"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-gray-900 mb-4">
            <span className="font-normal">Brian Patrick</span>{' '}
            <span className="font-bold">Bahati</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-sky-blue mb-6">
            Physical Intelligence Engineer | Cybersecurity Professional
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Engineering intelligent, secure, and scalable systems with a strong foundation in software
            development, cybersecurity, and AI-driven innovation. Passionate about quality assurance,
            automation, and impactful open-source contributions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#blog"
              className="px-8 py-3 bg-sky-blue text-white rounded-lg font-semibold hover:bg-opacity-90 hover:outline hover:outline-2 hover:outline-gold transition-all shadow-lg"
            >
              View Blog
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-white text-sky-blue border-2 border-sky-blue rounded-lg font-semibold hover:bg-sky-blue hover:text-white transition-all shadow-lg"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-8 text-center">
            About Me
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              I am a Bachelor of Engineering (B.E.) student in Robotics and Artificial Intelligence with a
              strong background in software engineering and cybersecurity. My work focuses on building
              secure, scalable, and maintainable systems, combining engineering discipline with emerging
              AI technologies.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              I apply security-first development practices, clean architecture principles, and pragmatic
              problem-solving to real-world systems. Alongside my academic training in robotics and AI, I
              actively contribute to open-source projects and large-scale software platforms, including
              healthcare systems used by millions globally.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              With professional certifications in Ethical Hacking, CyberOps, and CCNA, I bring a
              well-rounded perspective that bridges intelligent systems, software engineering, and
              cybersecurity. I am particularly interested in secure AI systems, automation, and resilient
              infrastructure for mission-critical applications.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-sky-blue/10 text-sky-blue rounded-full text-sm font-medium">
                CCNA Certified
              </span>
              <span className="px-4 py-2 bg-sky-blue/10 text-sky-blue rounded-full text-sm font-medium">
                CyberOps Certified
              </span>
              <span className="px-4 py-2 bg-sky-blue/10 text-sky-blue rounded-full text-sm font-medium">
                Ethical Hacking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4 text-center">
            Blog
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Sharing insights on Physical Intelligence, Automation, Cybersecurity, Ethical Hacking, and
            Open Source contributions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-sky-blue/20 to-gold/20 flex items-center justify-center">
                  <span className="text-6xl">{category.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                  <a
                    href="#blog"
                    className="inline-block px-4 py-2 bg-sky-blue text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-sky-blue/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-12 text-center">
            Experience & Credentials
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-4 border-sky-blue bg-white p-6 rounded-lg shadow-md"
              >
                <div className="absolute -left-2 top-6 w-4 h-4 bg-gold rounded-full border-4 border-white"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{exp.title}</h3>
                <p className="text-sky-blue font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-gray-500 mb-4">{exp.period}</p>
                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Life Section */}
      <section id="other-life" className="py-20 bg-gradient-to-br from-gray-50 to-sky-blue/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4 text-center">
            Other Life
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Beyond code and computers, here's a glimpse into the other aspects of my life that inspire
            and energize me.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">✝️</span>
                <h3 className="text-xl font-semibold text-gray-900">Faith & Belief</h3>
              </div>
              <p className="text-gray-600">
                I am a believer in Jesus Christ, the risen Savior of all, including you. As a
                Seventh-Day Adventist, my faith guides my values, principles, and approach to life,
                work, and service to others.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🎨</span>
                <h3 className="text-xl font-semibold text-gray-900">Creative Pursuits</h3>
              </div>
              <p className="text-gray-600">
                Exploring creativity through various mediums, finding inspiration in art, music, and
                design that fuels innovation in my technical work.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🌍</span>
                <h3 className="text-xl font-semibold text-gray-900">Travel & Culture</h3>
              </div>
              <p className="text-gray-600">
                Discovering new places, cultures, and perspectives that broaden my worldview and
                enhance my understanding of global technology needs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">📚</span>
                <h3 className="text-xl font-semibold text-gray-900">Reading & Learning</h3>
              </div>
              <p className="text-gray-600">
                Continuous learning beyond technology—exploring philosophy, history, science, and
                literature that shape my thinking and approach to problem-solving.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🏃</span>
                <h3 className="text-xl font-semibold text-gray-900">Fitness & Wellness</h3>
              </div>
              <p className="text-gray-600">
                Maintaining physical and mental wellness through regular exercise, mindfulness, and
                activities that keep me balanced and energized.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🎵</span>
                <h3 className="text-xl font-semibold text-gray-900">Music & Entertainment</h3>
              </div>
              <p className="text-gray-600">
                Enjoying music, films, and entertainment that provide relaxation and creative
                inspiration during breaks from coding.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🌱</span>
                <h3 className="text-xl font-semibold text-gray-900">Permaculture & Livestock Rearing</h3>
              </div>
              <p className="text-gray-600">
                Practicing sustainable agriculture through permaculture principles and raising
                livestock, connecting with nature and contributing to food security and environmental
                stewardship.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">⭐</span>
                <h3 className="text-xl font-semibold text-gray-900">Star Gazing</h3>
              </div>
              <p className="text-gray-600">
                Observing the night sky, exploring constellations, and marveling at the cosmos. Star
                gazing provides moments of wonder, reflection, and connection with the vast universe
                beyond our world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4 text-center">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            I'm always open to discussing new opportunities, collaborations, or answering questions
            about software engineering, security, or open-source contributions.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <a
                  href="mailto:bahatibrianp@gmail.com"
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-blue/10 to-gold/10 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600 text-sm">bahatibrianp@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://github.com/Bahati308"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-blue/10 to-gold/10 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">💻</span>
                  <div>
                    <p className="font-semibold text-gray-900">GitHub</p>
                    <p className="text-gray-600 text-sm">@Bahati308</p>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/brian-patrick-bahati"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-blue/10 to-gold/10 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">💼</span>
                  <div>
                    <p className="font-semibold text-gray-900">LinkedIn</p>
                    <p className="text-gray-600 text-sm">brian-patrick-bahati</p>
                  </div>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h3>
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  formData.append('form-name', 'contact')

                  try {
                    const response = await fetch('/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: new URLSearchParams(formData).toString(),
                    })

                    if (response.ok) {
                      setFormStatus({
                        type: 'success',
                        message: 'Thank you! Your message has been sent successfully.',
                      })
                      e.target.reset()
                      setTimeout(() => setFormStatus({ type: '', message: '' }), 5000)
                    } else {
                      setFormStatus({
                        type: 'error',
                        message:
                          'Oops! Something went wrong. Please try again or email me directly.',
                      })
                    }
                  } catch (error) {
                    setFormStatus({
                      type: 'error',
                      message:
                        'Oops! Something went wrong. Please email me directly at bahatibrianp@gmail.com',
                    })
                  }
                }}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>
                {formStatus.message && (
                  <div
                    className={`p-4 rounded-lg ${
                      formStatus.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {formStatus.message}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all resize-vertical"
                    aria-required="true"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-sky-blue text-white rounded-lg font-semibold hover:bg-opacity-90 hover:outline hover:outline-2 hover:outline-gold transition-all shadow-lg focus:ring-2 focus:ring-sky-blue focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Brian Patrick <span className="font-bold">Bahati</span>.
            All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="https://github.com/Bahati308"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gold transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/brian-patrick-bahati"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gold transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
