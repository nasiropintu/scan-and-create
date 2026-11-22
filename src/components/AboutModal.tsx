import { useEffect } from 'react'
import { Bot, Code2, ExternalLink, Heart, ShieldCheck, Sparkles, X } from 'lucide-react'

type AboutModalProps = {
  isOpen: boolean
  onClose: () => void
}

const socialLinks = [
  { name: 'GitHub', handle: '@nasiropintu', url: 'https://github.com/nasiropintu' },
  { name: 'X', handle: '@nasiropintu', url: 'https://x.com/nasiropintu' },
  { name: 'Instagram', handle: '@the_np2', url: 'https://www.instagram.com/the_np2/' },
  {
    name: 'Facebook',
    handle: 'mohammadnasiruddin.pintu',
    url: 'https://www.facebook.com/mohammadnasiruddin.pintu/',
  },
]

const aiCollaborators = [
  {
    name: 'Gemini',
    provider: 'Google DeepMind',
    role: 'Architecture & agentic workflows',
  },
  { name: 'Manus', provider: 'Manus AI', role: 'Autonomous planning & synthesis' },
  { name: 'ChatGPT', provider: 'OpenAI', role: 'Logic synthesis & reasoning' },
  { name: 'DeepSeek', provider: 'DeepSeek', role: 'Algorithmic problem-solving' },
  {
    name: 'Claude',
    provider: 'Anthropic',
    role: 'Systems reasoning & technical drafting',
  },
  {
    name: 'Vibe by Mistral',
    provider: 'Mistral AI',
    role: 'Code generation & engineering',
  },
]

const openSourceCredits = [
  { name: 'React', author: 'Meta', desc: 'Component-based user interface.' },
  {
    name: 'Vite',
    author: 'Evan You & contributors',
    desc: 'Development server and production build tooling.',
  },
  { name: 'TypeScript', author: 'Microsoft', desc: 'Typed application development.' },
  {
    name: 'Tailwind CSS',
    author: 'Tailwind Labs',
    desc: 'Utility-first styling system.',
  },
  {
    name: 'Lucide',
    author: 'Lucide contributors',
    desc: 'Open-source interface icon set.',
  },
]

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="about-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="about-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        <button className="about-close" onClick={onClose} aria-label="Close about dialog">
          <X size={18} />
        </button>

        <div className="about-creator">
          <div className="about-avatar-wrap">
            <div className="about-avatar-fallback visible" aria-hidden="true">
              NP
            </div>
            <img
              className="about-avatar"
              src={`${import.meta.env.BASE_URL}branding/nasirpintu.jpg`}
              alt="Portrait of NasirPintu"
              onError={(event) => {
                event.currentTarget.hidden = true
              }}
            />
            <span className="about-avatar-badge">
              <Sparkles size={12} />
            </span>
          </div>
          <div className="about-creator-copy">
            <span className="about-kicker">
              <Heart size={12} fill="currentColor" /> BUILT WITH PURPOSE
            </span>
            <h2 id="about-title">NasirPintu</h2>
            <p className="about-subtitle">
              Mohammad Nasiruddin Pintu · Creator & Product Architect
            </p>
            <p className="about-bio">
              Building free, private-by-design digital tools that empower people without
              paywalls, subscriptions or data tracking.
            </p>
          </div>
        </div>

        <div className="about-section">
          <h3>CONNECT WITH NASIRPINTU</h3>
          <div className="about-social-grid">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer">
                <span>
                  <strong>{link.name}</strong>
                  <small>{link.handle}</small>
                </span>
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </div>

        <div className="about-section">
          <div className="about-section-heading">
            <h3>
              <Bot size={14} /> AI COLLABORATION CREDITS
            </h3>
            <span>Human-directed · AI-assisted</span>
          </div>
          <p className="about-narrative">
            Architected and guided by <strong>NasirPintu</strong> in collaboration with
            frontier artificial intelligence models and coding assistants.
          </p>
          <div className="about-ai-grid">
            {aiCollaborators.map((ai) => (
              <div className="about-credit-card" key={ai.name}>
                <span className="about-credit-dot" />
                <span>
                  <strong>{ai.name}</strong>
                  <small>{ai.provider}</small>
                  <small>{ai.role}</small>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-section">
          <h3>
            <Code2 size={14} /> OPEN-SOURCE COMMUNITY CREDITS
          </h3>
          <div className="about-oss-grid">
            {openSourceCredits.map((credit) => (
              <div className="about-oss-card" key={credit.name}>
                <strong>{credit.name}</strong>
                <small>by {credit.author}</small>
                <p>{credit.desc}</p>
              </div>
            ))}
          </div>
          <p className="about-oss-note">
            Dependency credits are maintained alongside the project dependencies.
          </p>
        </div>

        <div className="about-guarantee">
          <ShieldCheck size={17} />
          <span>
            <strong>Privacy-first by design.</strong> This preview includes no analytics
            or tracking. On-device scanning and generation are planned product
            requirements.
          </span>
        </div>
        <p className="about-statement">
          “The future of human-directed, agent-assisted engineering.”
        </p>
      </section>
    </div>
  )
}
