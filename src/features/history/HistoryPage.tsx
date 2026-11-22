import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  Bookmark,
  Check,
  Clock3,
  Copy,
  Heart,
  History,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import {
  clearHistoryItems,
  deleteHistoryItem,
  getHistoryItems,
  setHistoryFavorite,
  type HistoryItem,
  type HistoryKind,
} from './database'
import './HistoryPage.css'

type HistoryPageProps = { favoritesOnly?: boolean }

export default function HistoryPage({ favoritesOnly = false }: HistoryPageProps) {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [kindFilter, setKindFilter] = useState<HistoryKind | 'all'>('all')
  const [status, setStatus] = useState('')

  const refresh = async () => {
    try {
      setItems(await getHistoryItems())
      setError('')
    } catch {
      setError('Local storage is unavailable. Check your browser storage settings.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let current = true
    getHistoryItems()
      .then((loadedItems) => {
        if (!current) return
        setItems(loadedItems)
        setError('')
      })
      .catch(() => {
        if (current) {
          setError('Local storage is unavailable. Check your browser storage settings.')
        }
      })
      .finally(() => {
        if (current) setIsLoading(false)
      })

    return () => {
      current = false
    }
  }, [])

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return items.filter((item) => {
      if (favoritesOnly && !item.favorite) return false
      if (kindFilter !== 'all' && item.kind !== kindFilter) return false
      if (!normalizedQuery) return true
      return `${item.format} ${item.value}`.toLocaleLowerCase().includes(normalizedQuery)
    })
  }, [favoritesOnly, items, kindFilter, query])

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('Content copied.')
    } catch {
      setStatus('Clipboard access is unavailable in this browser.')
    }
  }

  const toggleFavorite = async (item: HistoryItem) => {
    if (item.id === undefined) return
    try {
      await setHistoryFavorite(item.id, !item.favorite)
      setStatus(item.favorite ? 'Removed from favorites.' : 'Added to favorites.')
      await refresh()
    } catch {
      setError('Could not update this favorite. Try again.')
    }
  }

  const removeItem = async (item: HistoryItem) => {
    if (item.id === undefined) return
    try {
      await deleteHistoryItem(item.id)
      setStatus('Saved item deleted.')
      await refresh()
    } catch {
      setError('Could not delete this item. Try again.')
    }
  }

  const clearAll = async () => {
    if (
      !window.confirm('Delete all saved scans and generated codes from this browser?')
    ) {
      return
    }
    try {
      await clearHistoryItems()
      setStatus('All saved items were deleted from this browser.')
      await refresh()
    } catch {
      setError('Could not clear saved items. Try again.')
    }
  }

  const isWebsite = (value: string) => {
    try {
      const url = new URL(value)
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
    } catch {
      return null
    }
  }

  return (
    <section className="history-page" aria-labelledby="history-page-title">
      <div className="history-heading">
        <div>
          <div className="eyebrow">
            {favoritesOnly ? <Star size={14} /> : <History size={14} />}
            {favoritesOnly ? 'YOUR FAVORITES' : 'YOUR LIBRARY'}
          </div>
          <h1 id="history-page-title">{favoritesOnly ? 'Favorites' : 'History'}</h1>
          <p>
            {favoritesOnly
              ? 'Keep the codes you want to find again.'
              : 'Your saved scans and generated codes, stored in this browser.'}
          </p>
        </div>
        {!favoritesOnly && items.length > 0 && (
          <button className="history-danger-button" type="button" onClick={clearAll}>
            <Trash2 size={15} /> Clear all
          </button>
        )}
      </div>

      <p className="history-privacy-note">
        <Clock3 size={15} /> Saved only on this device. Browser-local data is not
        encrypted by this app.
      </p>

      {!isLoading && items.length > 0 && (
        <div className="history-toolbar">
          <label className="history-search" htmlFor="history-search">
            <Search size={15} />
            <input
              id="history-search"
              type="search"
              placeholder="Search saved content"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {!favoritesOnly && (
            <label className="history-filter" htmlFor="history-filter">
              <span>Type</span>
              <select
                id="history-filter"
                value={kindFilter}
                onChange={(event) =>
                  setKindFilter(event.target.value as HistoryKind | 'all')
                }
              >
                <option value="all">All saved</option>
                <option value="scan">Scans</option>
                <option value="qr">QR codes</option>
                <option value="barcode">Barcodes</option>
              </select>
            </label>
          )}
        </div>
      )}

      {error && (
        <p className="history-error" role="alert">
          <AlertCircle size={15} /> {error}
        </p>
      )}

      {isLoading ? (
        <div className="history-empty-state">Loading saved items…</div>
      ) : visibleItems.length ? (
        <div className="history-list">
          {visibleItems.map((item) => (
            <article className="history-item" key={item.id}>
              <div className="history-item-main">
                <div className="history-item-meta">
                  <span className={`history-kind history-kind-${item.kind}`}>
                    {kindLabel(item.kind)}
                  </span>
                  <span>{item.format}</span>
                  <time dateTime={new Date(item.createdAt).toISOString()}>
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(item.createdAt)}
                  </time>
                </div>
                <pre className="history-item-value">{item.value}</pre>
                <div className="history-item-actions">
                  <button type="button" onClick={() => void copyValue(item.value)}>
                    <Copy size={14} /> Copy
                  </button>
                  {isWebsite(item.value) && (
                    <a href={isWebsite(item.value)!} target="_blank" rel="noreferrer">
                      <ArrowUpRight size={14} /> Open website
                    </a>
                  )}
                  <button
                    type="button"
                    aria-pressed={item.favorite}
                    onClick={() => void toggleFavorite(item)}
                  >
                    {item.favorite ? (
                      <Heart size={14} fill="currentColor" />
                    ) : (
                      <Bookmark size={14} />
                    )}
                    {item.favorite ? 'Favorited' : 'Favorite'}
                  </button>
                  <button
                    className="history-delete-action"
                    type="button"
                    onClick={() => void removeItem(item)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="history-empty-state">
          <span className="history-empty-icon">
            {favoritesOnly ? <Star size={25} /> : <Bookmark size={25} />}
          </span>
          <strong>
            {items.length === 0
              ? favoritesOnly
                ? 'No favorites yet'
                : 'Nothing saved yet'
              : 'No matching items'}
          </strong>
          <span>
            {items.length === 0
              ? 'Save a scan or generated code and it will appear here.'
              : 'Try another search or type filter.'}
          </span>
        </div>
      )}

      {status && (
        <p className="history-status" role="status" aria-live="polite">
          <Check size={14} /> {status}
        </p>
      )}
    </section>
  )
}

function kindLabel(kind: HistoryKind) {
  if (kind === 'scan') return 'Scanned'
  if (kind === 'qr') return 'QR code'
  return 'Barcode'
}
