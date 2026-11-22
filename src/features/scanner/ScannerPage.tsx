import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Bookmark,
  Camera,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  ImageUp,
  Mail,
  MessageSquare,
  PhoneCall,
  ScanLine,
  Share2,
  ShieldCheck,
  Square,
  User,
  Wifi,
} from 'lucide-react'
import {
  decodeImageFile,
  getCameraErrorMessage,
  startCameraScanner,
  type CameraScannerSession,
  type DecodedScan,
} from './scannerAdapter'
import './ScannerPage.css'
import { saveHistoryItem } from '../history/database'
import { classifyContent } from '../results/contentClassifier'

type CameraOption = { deviceId: string; label: string }

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [cameraId, setCameraId] = useState('')
  const [cameras, setCameras] = useState<CameraOption[]>([])
  const [result, setResult] = useState<DecodedScan | null>(null)
  const [scanError, setScanError] = useState('')
  const [imageBusy, setImageBusy] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!isScanning) return
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    let receivedResult = false
    let session: CameraScannerSession | undefined

    void startCameraScanner(
      video,
      cameraId,
      (decoded) => {
        if (cancelled || receivedResult) return
        receivedResult = true
        setResult(decoded)
        setIsScanning(false)
        setStatus('Code detected. The camera has been stopped.')
      },
      setCameras,
    )
      .then((activeSession) => {
        session = activeSession
        if (cancelled) {
          activeSession.stop()
          return
        }
        setScanError('')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setScanError(getCameraErrorMessage(error))
        setIsScanning(false)
      })

    return () => {
      cancelled = true
      session?.stop()
      video.pause()
      video.srcObject = null
    }
  }, [cameraId, isScanning])

  const startScanning = () => {
    setResult(null)
    setStatus('')
    setScanError('')
    setIsScanning(true)
  }

  const stopScanning = () => {
    setIsScanning(false)
    setStatus('Camera stopped.')
  }

  const scanImage = async (file?: File) => {
    if (!file) return
    setIsScanning(false)
    setImageBusy(true)
    setScanError('')
    setStatus('Reading image on this device…')
    try {
      const decoded = await decodeImageFile(file)
      setResult(decoded)
      setStatus('Code detected in the image.')
    } catch (error) {
      setResult(null)
      setScanError(
        error instanceof Error && error.message.includes('Choose an image')
          ? error.message
          : error instanceof Error && error.message.includes('20 MB')
            ? error.message
            : 'No supported QR code or barcode was found in that image.',
      )
      setStatus('')
    } finally {
      setImageBusy(false)
    }
  }

  const copyResult = async () => {
    if (!result) return
    await copyText(result.text, 'Result copied.')
  }

  const copyText = async (text: string, successMessage = 'Copied.') => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(successMessage)
    } catch {
      setStatus('Clipboard access is unavailable in this browser.')
    }
  }

  const shareResult = async () => {
    if (!result || !navigator.share) return
    try {
      await navigator.share({
        title: 'Scan & Create',
        text: result.text,
      })
      setStatus('Shared successfully.')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setStatus('Sharing cancelled.')
    }
  }

  const saveResult = async () => {
    if (!result) return
    try {
      await saveHistoryItem({ kind: 'scan', format: result.format, value: result.text })
      setStatus('Saved in this browser.')
    } catch {
      setScanError('Could not save this result. Check your browser storage settings.')
    }
  }

  const classified = useMemo(
    () => (result ? classifyContent(result.text) : null),
    [result],
  )

  return (
    <section className="scanner-page" aria-labelledby="scanner-title">
      <div className="scanner-heading">
        <div>
          <div className="eyebrow">
            <ScanLine size={14} /> SMART SCANNER
          </div>
          <h1 id="scanner-title">Scan a code</h1>
          <p>Scan a QR code or barcode with your camera, or choose an image.</p>
        </div>
        <div className="scanner-privacy-note">
          <ShieldCheck size={17} /> Decoded on this device
        </div>
      </div>

      <div className="scanner-layout">
        <div className="scanner-preview-card">
          <div className={`scanner-video-frame ${isScanning ? 'is-active' : ''}`}>
            {isScanning ? (
              <video
                ref={videoRef}
                className="scanner-video"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="scanner-idle">
                <span className="scanner-idle-icon">
                  <ScanLine size={34} />
                </span>
                <strong>{result ? 'Scan complete' : 'Camera is off'}</strong>
                <span>Camera access starts only when you tap Start camera.</span>
              </div>
            )}
            {isScanning && <span className="scanner-guide" aria-hidden="true" />}
          </div>
          <div className="scanner-controls">
            {!isScanning ? (
              <button
                className="scanner-primary-button"
                type="button"
                onClick={startScanning}
              >
                <Camera size={17} /> Start camera
              </button>
            ) : (
              <button
                className="scanner-stop-button"
                type="button"
                onClick={stopScanning}
              >
                <Square size={15} fill="currentColor" /> Stop camera
              </button>
            )}
            {cameras.length > 1 && (
              <label className="scanner-camera-select">
                <span>Camera</span>
                <select
                  value={cameraId}
                  onChange={(event) => setCameraId(event.target.value)}
                  aria-label="Choose camera"
                >
                  <option value="">Default (rear camera preferred)</option>
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>

        <div className="scanner-result-card">
          <div className="scanner-result-heading">
            <div>
              <span className="scanner-card-eyebrow">DECODED CONTENT</span>
              <h2>Scan result</h2>
            </div>
            {result && <span className="scanner-result-format">{result.format}</span>}
          </div>
          {result && classified ? (
            <>
              <div className="scanner-smart-container">
                {classified.type === 'url' && (
                  <>
                    <span className="scanner-smart-badge">
                      <Globe size={12} /> Website Link
                    </span>
                    <div className="scanner-smart-box">
                      <a
                        className="scanner-smart-url"
                        href={classified.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {classified.display}
                      </a>
                    </div>
                    <a
                      className="scanner-action-link"
                      href={classified.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={15} /> Open website
                    </a>
                  </>
                )}

                {classified.type === 'email' && (
                  <>
                    <span className="scanner-smart-badge">
                      <Mail size={12} /> Email Address
                    </span>
                    <div className="scanner-smart-box">
                      <strong>{classified.email}</strong>
                      {classified.subject && <small>Subject: {classified.subject}</small>}
                    </div>
                    <a className="scanner-action-link" href={classified.href}>
                      <Mail size={15} /> Compose email
                    </a>
                  </>
                )}

                {classified.type === 'phone' && (
                  <>
                    <span className="scanner-smart-badge">
                      <PhoneCall size={12} /> Phone Number
                    </span>
                    <div className="scanner-smart-box">
                      <strong>{classified.phone}</strong>
                    </div>
                    <a className="scanner-action-link" href={classified.href}>
                      <PhoneCall size={15} /> Call number
                    </a>
                  </>
                )}

                {classified.type === 'sms' && (
                  <>
                    <span className="scanner-smart-badge">
                      <MessageSquare size={12} /> SMS Message
                    </span>
                    <div className="scanner-smart-box">
                      <strong>To: {classified.phone}</strong>
                      {classified.message && <small>Message: {classified.message}</small>}
                    </div>
                    <a className="scanner-action-link" href={classified.href}>
                      <MessageSquare size={15} /> Send message
                    </a>
                  </>
                )}

                {classified.type === 'wifi' && (
                  <>
                    <span className="scanner-smart-badge">
                      <Wifi size={12} /> Wi-Fi Network
                    </span>
                    <div className="scanner-smart-box">
                      <div className="scanner-wifi-row">
                        <span>Network:</span>
                        <strong>{classified.ssid}</strong>
                      </div>
                      <div className="scanner-wifi-row">
                        <span>Security:</span>
                        <span>{classified.security}</span>
                      </div>
                      {classified.password && (
                        <div className="scanner-wifi-row">
                          <span>Password:</span>
                          <code>{classified.password}</code>
                        </div>
                      )}
                    </div>
                    {classified.password && (
                      <button
                        className="scanner-secondary-button"
                        type="button"
                        onClick={() =>
                          void copyText(classified.password!, 'Wi-Fi password copied.')
                        }
                      >
                        <Copy size={15} /> Copy password
                      </button>
                    )}
                  </>
                )}

                {classified.type === 'contact' && (
                  <>
                    <span className="scanner-smart-badge">
                      <User size={12} /> Contact Card
                    </span>
                    <div className="scanner-smart-box">
                      <strong>{classified.name}</strong>
                      {classified.org && <small>{classified.org}</small>}
                      {classified.title && <small>{classified.title}</small>}
                      {classified.phone && (
                        <div className="scanner-contact-row">
                          <span>Phone:</span>
                          <strong>{classified.phone}</strong>
                        </div>
                      )}
                      {classified.email && (
                        <div className="scanner-contact-row">
                          <span>Email:</span>
                          <strong>{classified.email}</strong>
                        </div>
                      )}
                    </div>
                    {classified.phone && (
                      <a className="scanner-action-link" href={`tel:${classified.phone}`}>
                        <PhoneCall size={15} /> Call {classified.name}
                      </a>
                    )}
                  </>
                )}

                {classified.type === 'text' && (
                  <span className="scanner-smart-badge">
                    <FileText size={12} /> Plain Text
                  </span>
                )}
              </div>

              <pre className="scanner-result-value">{result.text}</pre>
              <div className="scanner-result-actions">
                <button
                  className="scanner-secondary-button"
                  type="button"
                  onClick={copyResult}
                >
                  <Copy size={15} /> Copy raw text
                </button>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    className="scanner-secondary-button"
                    type="button"
                    onClick={() => void shareResult()}
                  >
                    <Share2 size={15} /> Share
                  </button>
                )}
                <button
                  className="scanner-secondary-button"
                  type="button"
                  onClick={() => void saveResult()}
                >
                  <Bookmark size={15} /> Save to history
                </button>
              </div>
              <p className="scanner-safe-note">
                Scanned content is shown safely. External links and device actions are
                only triggered when you click them.
              </p>
            </>
          ) : (
            <div className="scanner-result-empty">
              <span>No result yet</span>
              <small>Your decoded content will appear here.</small>
            </div>
          )}
          <div className="scanner-image-upload">
            <div className="scanner-upload-copy">
              <ImageUp size={17} />
              <span>Scan an image instead</span>
            </div>
            <label className="scanner-upload-button">
              {imageBusy ? 'Reading image…' : 'Choose image'}
              <input
                type="file"
                accept="image/*"
                disabled={imageBusy}
                onChange={(event) => {
                  void scanImage(event.target.files?.[0])
                  event.currentTarget.value = ''
                }}
                aria-label="Choose an image containing a QR code or barcode"
              />
            </label>
          </div>
        </div>
      </div>

      {scanError && (
        <p className="scanner-error" role="alert">
          <AlertCircle size={16} /> {scanError}
        </p>
      )}
      {status && (
        <p className="scanner-status" role="status" aria-live="polite">
          <Check size={14} /> {status}
        </p>
      )}
    </section>
  )
}
