import { lazy, Suspense, useEffect, useState } from 'react'
import AboutModal from './components/AboutModal'
import {
  Activity,
  ArrowRight,
  Barcode,
  Camera,
  ChevronRight,
  Clock3,
  Command,
  History,
  Heart,
  Home,
  Laptop,
  Moon,
  Plus,
  QrCode,
  ScanLine,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react'
import QRStudio from './features/qr-generator/QRStudio'
import BarcodeStudio from './features/barcode-generator/BarcodeStudio'
import HistoryPage from './features/history/HistoryPage'
import SettingsPage, { type ThemePreference } from './features/settings/SettingsPage'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import {
  getDashboardStats,
  getRecentItems,
  type DashboardStats,
  type HistoryItem,
} from './features/history/database'

const ScannerPage = lazy(() => import('./features/scanner/ScannerPage'))

type Page =
  'dashboard' | 'scanner' | 'qr' | 'barcode' | 'history' | 'favorites' | 'settings'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, shortcut: '⌘ 0' },
  { id: 'scanner', label: 'Scan code', icon: ScanLine, shortcut: '⌘ 1' },
  { id: 'qr', label: 'QR Studio', icon: QrCode, shortcut: '⌘ 2' },
  { id: 'barcode', label: 'Barcode Studio', icon: Barcode, shortcut: '⌘ 3' },
]

const libraryNavigation = [
  { id: 'history', label: 'History', icon: History, shortcut: '⌘ 4' },
  { id: 'favorites', label: 'Favorites', icon: Star },
]

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  scanner: 'Smart Scanner',
  qr: 'QR Studio',
  barcode: 'Barcode Studio',
  history: 'History',
  favorites: 'Favorites',
  settings: 'Settings',
}

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem('scan-create-theme')
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved
    }
    return 'system'
  })

  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    qrCreations: 0,
    barcodesCreated: 0,
    savedFavorites: 0,
  })
  const [recentItems, setRecentItems] = useState<HistoryItem[]>([])

  // Refresh dashboard metrics when navigating to dashboard
  useEffect(() => {
    if (page === 'dashboard') {
      let isCurrent = true
      Promise.all([getDashboardStats(), getRecentItems(4)])
        .then(([loadedStats, loadedRecent]) => {
          if (isCurrent) {
            setStats(loadedStats)
            setRecentItems(loadedRecent)
          }
        })
        .catch(() => {
          // Storage temporarily inaccessible
        })
      return () => {
        isCurrent = false
      }
    }
  }, [page])

  // System and manual theme handling
  useEffect(() => {
    localStorage.setItem('scan-create-theme', theme)

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const applySystemTheme = () => {
        document.documentElement.dataset.theme = media.matches ? 'dark' : 'light'
      }
      applySystemTheme()
      media.addEventListener('change', applySystemTheme)
      return () => media.removeEventListener('change', applySystemTheme)
    } else {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  // Global keyboard shortcuts (Cmd/Ctrl + 1..4, Cmd/Ctrl + 0)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.metaKey || event.ctrlKey) {
        if (event.key === '0') {
          event.preventDefault()
          setPage('dashboard')
        } else if (event.key === '1') {
          event.preventDefault()
          setPage('scanner')
        } else if (event.key === '2') {
          event.preventDefault()
          setPage('qr')
        } else if (event.key === '3') {
          event.preventDefault()
          setPage('barcode')
        } else if (event.key === '4') {
          event.preventDefault()
          setPage('history')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navigate = (destination: string) => {
    setPage(destination as Page)
  }

  const cycleTheme = () => {
    setTheme((current) => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  const isDashboard = page === 'dashboard'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => navigate('dashboard')}
          aria-label="Go to dashboard"
        >
          <span className="brand-mark">
            <ScanLine size={22} strokeWidth={2.2} />
          </span>
          <span className="brand-copy">
            <strong>Scan & Create</strong>
            <small>YOUR DIGITAL TOOLKIT</small>
          </span>
        </button>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="nav-group" aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon, shortcut }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
              aria-current={page === id ? 'page' : undefined}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {shortcut && <span className="nav-shortcut">{shortcut}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-label library-label">YOUR LIBRARY</div>

        <nav className="nav-group" aria-label="Library navigation">
          {libraryNavigation.map(({ id, label, icon: Icon, shortcut }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
              aria-current={page === id ? 'page' : undefined}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {shortcut && <span className="nav-shortcut">{shortcut}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="privacy-card">
            <span className="privacy-icon">
              <ShieldCheck size={19} />
            </span>
            <strong>Your privacy matters</strong>
            <p>
              No accounts, tracking, or cloud servers. All processing stays on your
              device.
            </p>
            <span className="privacy-status">
              <span className="status-dot" />
              Privacy-first
            </span>
          </div>

          <button
            className={`nav-item ${page === 'settings' ? 'active' : ''}`}
            onClick={() => navigate('settings')}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </button>

          <button
            className="creator-attribution"
            onClick={() => setIsAboutOpen(true)}
            aria-label="About NasirPintu and project credits"
          >
            <Heart size={15} fill="currentColor" />
            <span>
              Crafted with <strong>♥</strong> by <b>NasirPintu</b>
            </span>
            <ChevronRight size={14} className="creator-attribution-arrow" />
          </button>

          <div className="sidebar-footer">
            <span className="footer-dot" />
            Version 0.1.1 · PWA
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>{pageTitles[page]}</strong>
          </div>

          <div className="topbar-actions">
            <span className="offline-indicator">
              <span className="status-dot" />
              No tracking
            </span>

            <button
              className="icon-button theme-button"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme`}
              title={`Current theme: ${theme} (Click to toggle)`}
            >
              {theme === 'light' ? (
                <Sun size={19} />
              ) : theme === 'dark' ? (
                <Moon size={19} />
              ) : (
                <Laptop size={19} />
              )}
            </button>

            <div className="avatar" aria-label="Scan & Create">
              SC
            </div>
          </div>
        </header>

        <div className="page-content">
          {page === 'qr' ? (
            <QRStudio />
          ) : page === 'barcode' ? (
            <BarcodeStudio />
          ) : page === 'scanner' ? (
            <Suspense
              fallback={<section className="placeholder-page">Loading scanner…</section>}
            >
              <ScannerPage />
            </Suspense>
          ) : page === 'history' ? (
            <HistoryPage />
          ) : page === 'favorites' ? (
            <HistoryPage favoritesOnly />
          ) : page === 'settings' ? (
            <SettingsPage
              theme={theme}
              onThemeChange={setTheme}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
          ) : isDashboard ? (
            <>
              <section className="welcome-section">
                <div>
                  <div className="eyebrow">
                    <Sparkles size={14} />
                    YOUR CREATIVE WORKSPACE
                  </div>
                  <h1>Everything starts with a scan.</h1>
                  <p>Scan, create and manage codes — all in one simple place.</p>
                </div>
                <div className="welcome-decoration" aria-hidden="true">
                  <div className="decoration-ring ring-one" />
                  <div className="decoration-ring ring-two" />
                  <QrCode size={90} strokeWidth={1} />
                </div>
              </section>

              <section className="quick-section">
                <div className="section-heading">
                  <div>
                    <h2>Quick actions</h2>
                    <p>What would you like to do today?</p>
                  </div>
                </div>

                <div className="action-grid">
                  <button
                    className="action-card scan-card"
                    onClick={() => navigate('scanner')}
                  >
                    <span className="action-icon">
                      <ScanLine size={23} />
                    </span>
                    <span className="action-text">
                      <strong>Scan a code</strong>
                      <small>Use your camera or an image</small>
                    </span>
                    <ArrowRight className="action-arrow" size={19} />
                  </button>

                  <button className="action-card" onClick={() => navigate('qr')}>
                    <span className="action-icon qr-icon">
                      <QrCode size={23} />
                    </span>
                    <span className="action-text">
                      <strong>Create QR code</strong>
                      <small>Links, text, Wi-Fi and more</small>
                    </span>
                    <ArrowRight className="action-arrow" size={19} />
                  </button>

                  <button className="action-card" onClick={() => navigate('barcode')}>
                    <span className="action-icon barcode-icon">
                      <Barcode size={23} />
                    </span>
                    <span className="action-text">
                      <strong>Create barcode</strong>
                      <small>Generate printable barcodes</small>
                    </span>
                    <ArrowRight className="action-arrow" size={19} />
                  </button>
                </div>
              </section>

              <section className="overview-section">
                <div className="section-heading">
                  <div>
                    <h2>Your overview</h2>
                    <p>A live snapshot of your local storage.</p>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon purple">
                      <Activity size={19} />
                    </span>
                    <span className="stat-label">Total scans</span>
                    <strong className="stat-number">{stats.totalScans}</strong>
                    <span className="stat-caption">
                      {stats.totalScans > 0
                        ? `${stats.totalScans} codes scanned`
                        : 'Ready for your first scan'}
                    </span>
                  </div>

                  <div className="stat-card">
                    <span className="stat-icon blue">
                      <QrCode size={19} />
                    </span>
                    <span className="stat-label">QR creations</span>
                    <strong className="stat-number">{stats.qrCreations}</strong>
                    <span className="stat-caption">
                      {stats.qrCreations > 0
                        ? `${stats.qrCreations} codes created`
                        : 'Bring your ideas to life'}
                    </span>
                  </div>

                  <div className="stat-card">
                    <span className="stat-icon orange">
                      <Barcode size={19} />
                    </span>
                    <span className="stat-label">Barcodes created</span>
                    <strong className="stat-number">{stats.barcodesCreated}</strong>
                    <span className="stat-caption">
                      {stats.barcodesCreated > 0
                        ? `${stats.barcodesCreated} barcodes created`
                        : 'Ready when you are'}
                    </span>
                  </div>

                  <div className="stat-card">
                    <span className="stat-icon green">
                      <Star size={19} />
                    </span>
                    <span className="stat-label">Saved favorites</span>
                    <strong className="stat-number">{stats.savedFavorites}</strong>
                    <span className="stat-caption">
                      {stats.savedFavorites > 0
                        ? `${stats.savedFavorites} bookmarked`
                        : 'Keep important codes close'}
                    </span>
                  </div>
                </div>
              </section>

              <section className="recent-section">
                <div className="section-heading recent-heading">
                  <div>
                    <h2>Recent activity</h2>
                    <p>Your latest scans and creations from local storage.</p>
                  </div>
                  <button className="text-button" onClick={() => navigate('history')}>
                    View history <ArrowRight size={15} />
                  </button>
                </div>

                {recentItems.length > 0 ? (
                  <div className="dashboard-recent-list">
                    {recentItems.map((item) => (
                      <article
                        key={item.id}
                        className="dashboard-recent-card"
                        onClick={() => navigate('history')}
                        title="View in history"
                      >
                        <div className="dashboard-recent-header">
                          <span className={`recent-kind-pill kind-${item.kind}`}>
                            {item.kind === 'scan'
                              ? 'Scan'
                              : item.kind === 'qr'
                                ? 'QR'
                                : 'Barcode'}
                          </span>
                          <span className="recent-format">{item.format}</span>
                          <time dateTime={new Date(item.createdAt).toISOString()}>
                            {new Intl.DateTimeFormat(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(item.createdAt)}
                          </time>
                        </div>
                        <p className="dashboard-recent-value">{item.value}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Clock3 size={25} strokeWidth={1.5} />
                    </div>
                    <strong>Nothing here just yet</strong>
                    <p>
                      Your activity will appear here once you scan or create your first
                      code.
                    </p>
                    <button className="empty-action" onClick={() => navigate('scanner')}>
                      <Camera size={16} />
                      Start scanning
                    </button>
                  </div>
                )}
              </section>

              <footer className="page-footer">
                <span>Made for simplicity. Designed for privacy.</span>
                <span className="footer-brand">
                  <Command size={13} /> Scan & Create
                </span>
              </footer>
            </>
          ) : (
            <section className="placeholder-page">
              <div className="placeholder-icon">
                <Zap size={32} />
              </div>
              <div className="eyebrow">
                <Zap size={14} /> DEVELOPMENT IN PROGRESS
              </div>
              <h1>{pageTitles[page]}</h1>
              <p>
                This feature is part of the Scan & Create roadmap. We're building it step
                by step.
              </p>
              <button className="primary-button" onClick={() => navigate('dashboard')}>
                Back to dashboard <ArrowRight size={17} />
              </button>
            </section>
          )}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button
          className={page === 'dashboard' ? 'selected' : ''}
          onClick={() => navigate('dashboard')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button
          className={page === 'scanner' ? 'selected' : ''}
          onClick={() => navigate('scanner')}
        >
          <ScanLine size={20} />
          <span>Scan</span>
        </button>
        <button
          className={page === 'qr' ? 'selected' : ''}
          onClick={() => navigate('qr')}
        >
          <Plus size={20} />
          <span>Create</span>
        </button>
        <button
          className={page === 'history' ? 'selected' : ''}
          onClick={() => navigate('history')}
        >
          <History size={20} />
          <span>History</span>
        </button>
        <button
          className={page === 'favorites' ? 'selected' : ''}
          onClick={() => navigate('favorites')}
        >
          <Star size={20} />
          <span>Saved</span>
        </button>
      </nav>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <PWAUpdatePrompt />
    </div>
  )
}

export default App
