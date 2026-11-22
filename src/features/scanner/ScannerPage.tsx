import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  Camera,
  Check,
  Copy,
  ImageUp,
  ScanLine,
  ShieldCheck,
  Square,
} from 'lucide-react'
import {
  decodeImageFile,
  getCameraErrorMessage,
  startCameraScanner,
  type CameraScannerSession,
  type DecodedScan,
} from './scannerAdapter'
import './ScannerPage.css'

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
    try {
      await navigator.clipboard.writeText(result.text)
      setStatus('Result copied.')
    } catch {
      setStatus('Clipboard access is unavailable in this browser.')
    }
  }

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
          {result ? (
            <>
              <pre className="scanner-result-value">{result.text}</pre>
              <button
                className="scanner-secondary-button"
                type="button"
                onClick={copyResult}
              >
                <Copy size={15} /> Copy result
              </button>
              <p className="scanner-safe-note">
                Scanned content is shown as text. Links are never opened automatically.
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
