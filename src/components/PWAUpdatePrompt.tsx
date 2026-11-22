import { useRegisterSW } from 'virtual:pwa-register/react'
import { Check, Download, X } from 'lucide-react'
import './PWAUpdatePrompt.css'

export default function PWAUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!offlineReady && !needRefresh) return null

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <aside className="pwa-notice" role="status" aria-live="polite">
      <span className="pwa-notice-icon">
        {offlineReady ? <Check size={17} /> : <Download size={17} />}
      </span>
      <span className="pwa-notice-message">
        <strong>{offlineReady ? 'Ready to use offline' : 'Update available'}</strong>
        <small>
          {offlineReady
            ? 'The app shell and static files are saved on this device.'
            : 'Refresh when you are ready to use the latest version.'}
        </small>
      </span>
      {needRefresh && (
        <button
          className="pwa-notice-action"
          type="button"
          onClick={() => void updateServiceWorker(true)}
        >
          Update
        </button>
      )}
      <button
        className="pwa-notice-close"
        type="button"
        onClick={close}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </aside>
  )
}
