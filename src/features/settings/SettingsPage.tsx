import { useEffect, useState } from 'react'
import {
  Check,
  Database,
  Download,
  Heart,
  Laptop,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  Trash2,
} from 'lucide-react'
import {
  clearHistoryItems,
  getDashboardStats,
  getHistoryItems,
  type DashboardStats,
} from '../history/database'
import './SettingsPage.css'

export type ThemePreference = 'light' | 'dark' | 'system'

type SettingsPageProps = {
  theme: ThemePreference
  onThemeChange: (theme: ThemePreference) => void
  onOpenAbout: () => void
}

export default function SettingsPage({
  theme,
  onThemeChange,
  onOpenAbout,
}: SettingsPageProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    qrCreations: 0,
    barcodesCreated: 0,
    savedFavorites: 0,
  })
  const [statusMessage, setStatusMessage] = useState('')

  const loadStats = async () => {
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch {
      // Storage unavailable
    }
  }

  useEffect(() => {
    let isCurrent = true
    getDashboardStats()
      .then((data) => {
        if (isCurrent) setStats(data)
      })
      .catch(() => {
        // Storage unavailable
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const exportBackup = async () => {
    try {
      const items = await getHistoryItems()
      const dataStr = JSON.stringify(
        {
          app: 'Scan & Create',
          exportedAt: new Date().toISOString(),
          version: '0.1.1',
          items,
        },
        null,
        2,
      )
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scan-and-create-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.append(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setStatusMessage('Backup exported successfully.')
    } catch {
      setStatusMessage('Could not export backup.')
    }
  }

  const handleClearAll = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete all saved scans and creations from this device? This action cannot be undone.',
      )
    ) {
      return
    }

    try {
      await clearHistoryItems()
      await loadStats()
      setStatusMessage('All stored items were deleted.')
    } catch {
      setStatusMessage('Could not clear local storage.')
    }
  }

  const totalItems = stats.totalScans + stats.qrCreations + stats.barcodesCreated

  return (
    <section className="settings-page" aria-labelledby="settings-title">
      <div className="settings-heading">
        <div className="eyebrow">
          <ShieldCheck size={14} /> PREFERENCES & STORAGE
        </div>
        <h1 id="settings-title">Settings</h1>
        <p>Configure appearance, local database storage, and privacy controls.</p>
      </div>

      <div className="settings-sections">
        {/* 1. Theme Configuration */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="settings-card-icon">
              {theme === 'light' ? (
                <Sun size={20} />
              ) : theme === 'dark' ? (
                <Moon size={20} />
              ) : (
                <Laptop size={20} />
              )}
            </span>
            <div>
              <h2>Appearance</h2>
              <p>Choose your preferred interface theme or match your device.</p>
            </div>
          </div>

          <div className="theme-options-grid">
            <button
              type="button"
              className={`theme-option-button ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              <Sun size={18} />
              <span>Light</span>
            </button>
            <button
              type="button"
              className={`theme-option-button ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              <Moon size={18} />
              <span>Dark</span>
            </button>
            <button
              type="button"
              className={`theme-option-button ${theme === 'system' ? 'active' : ''}`}
              onClick={() => onThemeChange('system')}
            >
              <Laptop size={18} />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* 2. Storage & Backup */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="settings-card-icon">
              <Database size={20} />
            </span>
            <div>
              <h2>Local Storage & Backup</h2>
              <p>
                All data is stored directly in your browser's IndexedDB. No data is ever
                transmitted to a server.
              </p>
            </div>
          </div>

          <div className="storage-stats-grid">
            <div className="storage-stat-box">
              <span>Total Saved Items</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="storage-stat-box">
              <span>Scanned Codes</span>
              <strong>{stats.totalScans}</strong>
            </div>
            <div className="storage-stat-box">
              <span>QR Creations</span>
              <strong>{stats.qrCreations}</strong>
            </div>
            <div className="storage-stat-box">
              <span>Barcodes Created</span>
              <strong>{stats.barcodesCreated}</strong>
            </div>
          </div>

          <div className="settings-action-row">
            <button
              type="button"
              className="settings-secondary-button"
              onClick={() => void exportBackup()}
            >
              <Download size={15} /> Export JSON backup
            </button>
            <button
              type="button"
              className="settings-danger-button"
              onClick={() => void handleClearAll()}
            >
              <Trash2 size={15} /> Delete all stored data
            </button>
          </div>
        </div>

        {/* 3. Privacy & Offline Architecture */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="settings-card-icon">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2>Privacy & Integrity</h2>
              <p>Core principles built into the application foundation.</p>
            </div>
          </div>

          <ul className="privacy-bullets">
            <li>
              <Check size={14} /> Zero analytics, trackers, cookies, or remote databases.
            </li>
            <li>
              <Check size={14} /> Scanner only accesses the camera after explicit user
              interaction.
            </li>
            <li>
              <Check size={14} /> Camera streams and tracks are terminated immediately
              upon leaving the scanner.
            </li>
            <li>
              <Check size={14} /> Scanned links are never opened or navigated to
              automatically.
            </li>
            <li>
              <Check size={14} /> PWA service worker caches only static application
              assets, never user history.
            </li>
          </ul>
        </div>

        {/* 4. About & Attribution */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="settings-card-icon">
              <Heart size={20} fill="currentColor" />
            </span>
            <div>
              <h2>About & Creator</h2>
              <p>Scan & Create · Version 0.1.1</p>
            </div>
          </div>

          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              margin: '0 0 14px',
            }}
          >
            Conceived and architected by <strong>NasirPintu</strong> (Mohammad Nasiruddin
            Pintu) in human + AI collaboration.
          </p>

          <button
            type="button"
            className="settings-secondary-button"
            onClick={onOpenAbout}
          >
            <Heart size={14} fill="currentColor" /> View creator profile & credits
          </button>
        </div>
      </div>

      {statusMessage && (
        <p className="settings-status-msg" role="status" aria-live="polite">
          <RotateCcw size={14} /> {statusMessage}
        </p>
      )}
    </section>
  )
}
