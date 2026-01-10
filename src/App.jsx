import React, { useEffect, useState } from 'react'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })

  // Smooth scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'experience', 'contact']
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

  // Projects data
  const projects = [
    {
      id: 1,
      title: 'OpenELIS-Global2',
      description:
        'Contributing to an open-source laboratory information system used by healthcare facilities worldwide. Focus on secure data handling and workflow optimization.',
      tags: ['Java', 'Spring Boot', 'Open Source', 'Healthcare IT'],
      github: 'https://github.com/openelisglobal/openelisglobal-core',
      demo: null,
      thumbnail: '/letterB.jpg',
    },
    {
      id: 2,
      title: 'GSoC 2025 Project',
      description:
        'Google Summer of Code 2025 project focusing on testing frameworks and quality assurance automation for large-scale healthcare systems.',
      tags: ['Testing', 'QA Automation', 'Open Source', 'GSoC'],
      github: null,
      demo: null,
      thumbnail: '/letterB.jpg',
    },
    {
      id: 3,
      title: 'Testing Frameworks',
      description:
        'Development of comprehensive testing frameworks for ensuring code quality, security, and reliability in enterprise applications.',
      tags: ['Testing', 'Java', 'CI/CD', 'Quality Assurance'],
      github: null,
      demo: null,
      thumbnail: '/letterB.jpg',
    },
  ]

  // Experience data
  const experiences = [
    {
      title: 'Software Engineer | OpenELIS-Global2',
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
      title: 'Software Engineer | Open Source Contributor',
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
                href="#projects"
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'projects'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-700 hover:text-sky-blue'
                }`}
              >
                Projects
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
                href="#projects"
                className="block text-gray-700 hover:text-sky-blue transition-colors"
                onClick={handleNavClick}
              >
                Projects
              </a>
              <a
                href="#experience"
                className="block text-gray-700 hover:text-sky-blue transition-colors"
                onClick={handleNavClick}
              >
                Experience
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
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-blue/10 via-white to-gold/10 pt-16">
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
            Software Engineer | Cybersecurity Specialist
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Building secure, scalable applications with a passion for quality assurance, AI
            innovation, and open-source contributions. CCNA, CyberOps, and Ethical Hacking
            certified.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="px-8 py-3 bg-sky-blue text-white rounded-lg font-semibold hover:bg-opacity-90 hover:outline hover:outline-2 hover:outline-gold transition-all shadow-lg"
            >
              View Projects
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
              I am a Software Engineer with expertise in building secure, scalable applications
              and contributing to open-source projects. My approach combines clean architecture
              principles, security-first development practices, and pragmatic problem-solving.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              With professional certifications in Ethical Hacking, CyberOps, and CCNA, I bring a
              comprehensive understanding of both software engineering and cybersecurity to deliver
              robust, production-ready solutions.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              I specialize in full-stack development with a focus on creating maintainable
              codebases, implementing security best practices, and collaborating effectively within
              distributed teams. My experience includes contributing to large-scale open-source
              healthcare systems that serve millions of users worldwide.
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

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4 text-center">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Here are some of my key projects showcasing problem-solving, security-first development,
            and open-source contributions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-sky-blue/20 to-gold/20 flex items-center justify-center">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🚀</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-sky-blue/10 text-sky-blue rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-2 bg-sky-blue text-white rounded-lg text-center text-sm font-medium hover:bg-opacity-90 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-2 bg-gold text-white rounded-lg text-center text-sm font-medium hover:bg-opacity-90 transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
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
                <a
                  href="https://twitter.com/Bahati308"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-blue/10 to-gold/10 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">🐦</span>
                  <div>
                    <p className="font-semibold text-gray-900">Twitter/X</p>
                    <p className="text-gray-600 text-sm">@Bahati308</p>
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
                        message: 'Oops! Something went wrong. Please try again or email me directly.',
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
            © {new Date().getFullYear()} Brian Patrick <span className="font-bold">Bahati</span>. All rights reserved.
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
            <a
              href="https://twitter.com/Bahati308"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gold transition-colors"
              aria-label="Twitter/X"
            >
              Twitter/X
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
