import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import {
  Bookmark,
  Check,
  Copy,
  Download,
  QrCode,
  Share2,
  ShieldCheck,
} from 'lucide-react'
import {
  createQrPayload,
  QrPayloadError,
  type QrContentType,
  type QrFormValues,
} from './payload'
import './QRStudio.css'
import { saveHistoryItem } from '../history/database'

const contentTypes: { value: QrContentType; label: string }[] = [
  { value: 'text', label: 'Plain text' },
  { value: 'url', label: 'Website' },
  { value: 'phone', label: 'Phone number' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'contact', label: 'Contact card' },
]

const initialValues: QrFormValues = {
  text: '',
  url: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
  ssid: '',
  password: '',
  security: 'WPA',
  hidden: false,
  firstName: '',
  lastName: '',
}

export default function QRStudio() {
  const [contentType, setContentType] = useState<QrContentType>('text')
  const [values, setValues] = useState<QrFormValues>(initialValues)
  const [generatedCode, setGeneratedCode] = useState<{
    payload: string
    image?: string
    error?: string
  } | null>(null)
  const [actionStatus, setActionStatus] = useState<{
    payload: string
    message: string
  } | null>(null)

  const payloadResult = useMemo(() => {
    try {
      return { payload: createQrPayload(contentType, values), error: '' }
    } catch (error) {
      return {
        payload: '',
        error:
          error instanceof QrPayloadError
            ? error.message
            : 'Check the information and try again.',
      }
    }
  }, [contentType, values])

  useEffect(() => {
    let cancelled = false

    if (!payloadResult.payload) return

    QRCode.toDataURL(payloadResult.payload, {
      errorCorrectionLevel: 'M',
      margin: 4,
      width: 320,
      color: { dark: '#171722', light: '#FFFFFF' },
    })
      .then((image) => {
        if (!cancelled) setGeneratedCode({ payload: payloadResult.payload, image })
      })
      .catch(() => {
        if (!cancelled) {
          setGeneratedCode({
            payload: payloadResult.payload,
            error: 'This content is too long to fit in a QR code.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [payloadResult.payload])

  const currentCode =
    generatedCode?.payload === payloadResult.payload ? generatedCode : null
  const qrImage = currentCode?.image ?? null
  const generationError = currentCode?.error ?? ''
  const message =
    actionStatus?.payload === payloadResult.payload ? actionStatus.message : ''

  const updateValue = (key: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const input = (key: string, label: string, type = 'text', hint?: string) => (
    <label className="qr-field" htmlFor={`qr-${key}`} key={key}>
      <span>{label}</span>
      <input
        id={`qr-${key}`}
        type={type}
        value={typeof values[key] === 'string' ? values[key] : ''}
        onChange={(event) => updateValue(key, event.target.value)}
        autoComplete="off"
      />
      {hint && <small>{hint}</small>}
    </label>
  )

  const textarea = (key: string, label: string, hint?: string) => (
    <label className="qr-field" htmlFor={`qr-${key}`} key={key}>
      <span>{label}</span>
      <textarea
        id={`qr-${key}`}
        value={typeof values[key] === 'string' ? values[key] : ''}
        onChange={(event) => updateValue(key, event.target.value)}
        rows={4}
      />
      {hint && <small>{hint}</small>}
    </label>
  )

  const renderFields = () => {
    switch (contentType) {
      case 'text':
        return textarea('text', 'Text', 'Any text you want to share.')
      case 'url':
        return input(
          'url',
          'Website address',
          'url',
          'If needed, https:// is added automatically.',
        )
      case 'phone':
        return input('phone', 'Phone number', 'tel')
      case 'email':
        return (
          <>
            {input('email', 'Email address', 'email')}
            {input('subject', 'Subject (optional)')}
          </>
        )
      case 'sms':
        return (
          <>
            {input('phone', 'Phone number', 'tel')}
            {textarea('message', 'Message (optional)')}
          </>
        )
      case 'wifi':
        return (
          <>
            {input('ssid', 'Network name')}
            <label className="qr-field" htmlFor="qr-security">
              <span>Security</span>
              <select
                id="qr-security"
                value={String(values.security)}
                onChange={(event) => updateValue('security', event.target.value)}
              >
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No password</option>
              </select>
            </label>
            {values.security !== 'nopass' && input('password', 'Password', 'password')}
            <label className="qr-checkbox">
              <input
                type="checkbox"
                checked={values.hidden === true}
                onChange={(event) => updateValue('hidden', event.target.checked)}
              />
              <span>Hidden network</span>
            </label>
          </>
        )
      case 'contact':
        return (
          <>
            {input('firstName', 'First name')}
            {input('lastName', 'Last name')}
            {input('phone', 'Phone number (optional)', 'tel')}
            {input('email', 'Email address (optional)', 'email')}
          </>
        )
    }
  }

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payloadResult.payload)
      setActionStatus({ payload: payloadResult.payload, message: 'Content copied.' })
    } catch {
      setActionStatus({
        payload: payloadResult.payload,
        message: 'Clipboard access is unavailable in this browser.',
      })
    }
  }

  const shareQr = async () => {
    if (!qrImage || !navigator.share) return
    try {
      const blob = await (await fetch(qrImage)).blob()
      const file = new File([blob], 'scan-and-create-qr.png', { type: 'image/png' })
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        setActionStatus({
          payload: payloadResult.payload,
          message: 'Image sharing is unavailable. Download the PNG instead.',
        })
        return
      }
      await navigator.share({ files: [file], title: 'QR code' })
      setActionStatus({ payload: payloadResult.payload, message: 'QR code shared.' })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setActionStatus({
        payload: payloadResult.payload,
        message: 'Sharing is unavailable. Download the PNG instead.',
      })
    }
  }

  const saveQrToHistory = async () => {
    try {
      await saveHistoryItem({
        kind: 'qr',
        format: contentType,
        value: payloadResult.payload,
      })
      setActionStatus({
        payload: payloadResult.payload,
        message: 'Saved in this browser.',
      })
    } catch {
      setActionStatus({
        payload: payloadResult.payload,
        message: 'Could not save this QR code.',
      })
    }
  }

  return (
    <section className="qr-studio-page" aria-labelledby="qr-studio-title">
      <div className="qr-studio-heading">
        <div>
          <div className="eyebrow">
            <QrCode size={14} /> QR STUDIO
          </div>
          <h1 id="qr-studio-title">Create a QR code</h1>
          <p>Build a code for information you want to share.</p>
        </div>
        <div className="qr-privacy-note">
          <ShieldCheck size={17} /> Generated on this device
        </div>
      </div>

      <div className="qr-studio-grid">
        <div className="qr-builder-card">
          <label className="qr-field" htmlFor="qr-content-type">
            <span>Content type</span>
            <select
              id="qr-content-type"
              value={contentType}
              onChange={(event) => setContentType(event.target.value as QrContentType)}
            >
              {contentTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="qr-fields">{renderFields()}</div>
          {payloadResult.error && (
            <p className="qr-validation" role="status">
              {payloadResult.error}
            </p>
          )}
          {generationError && (
            <p className="qr-validation" role="alert">
              {generationError}
            </p>
          )}
          <p className="qr-payload-label">Encoded content</p>
          <pre className="qr-payload" aria-live="polite">
            {payloadResult.payload || 'Your QR content will appear here.'}
          </pre>
          <button
            className="qr-secondary-button"
            type="button"
            onClick={copyPayload}
            disabled={!payloadResult.payload}
          >
            <Copy size={15} /> Copy content
          </button>
          <button
            className="qr-secondary-button"
            type="button"
            onClick={saveQrToHistory}
            disabled={!payloadResult.payload}
          >
            <Bookmark size={15} /> Save to history
          </button>
          <small className="qr-history-note">
            Saved locally. Wi-Fi codes may include a network password.
          </small>
        </div>

        <div className="qr-preview-card" aria-label="QR code preview">
          <div className={`qr-image-frame ${qrImage ? 'has-image' : ''}`}>
            {qrImage ? (
              <img src={qrImage} alt="Generated QR code" />
            ) : (
              <div className="qr-preview-empty">
                <QrCode size={42} strokeWidth={1.4} />
                <span>
                  {payloadResult.error || 'Enter information to preview your code.'}
                </span>
              </div>
            )}
          </div>
          <div className="qr-preview-caption">
            <strong>{qrImage ? 'Ready to share' : 'Live preview'}</strong>
            <span>Keep the clear border for reliable scanning.</span>
          </div>
          <div className="qr-preview-actions">
            <a
              className={`qr-primary-button ${!qrImage ? 'disabled' : ''}`}
              href={qrImage || undefined}
              download="scan-and-create-qr.png"
              aria-disabled={!qrImage}
              onClick={(event) => {
                if (!qrImage) event.preventDefault()
              }}
            >
              <Download size={16} /> Download PNG
            </a>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                className="qr-secondary-button"
                type="button"
                onClick={shareQr}
                disabled={!qrImage}
              >
                <Share2 size={15} /> Share
              </button>
            )}
          </div>
          <p className="qr-status" role="status" aria-live="polite">
            {message ||
              (qrImage ? (
                <>
                  <Check size={13} /> QR code updates as you type.
                </>
              ) : (
                ''
              ))}
          </p>
        </div>
      </div>
    </section>
  )
}
