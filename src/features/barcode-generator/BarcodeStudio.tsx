import { useEffect, useMemo, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import {
  AlertCircle,
  Barcode,
  Bookmark,
  Check,
  Download,
  Printer,
  ShieldCheck,
} from 'lucide-react'
import {
  barcodeFormats,
  BarcodeValidationError,
  type BarcodeFormat,
  validateBarcodeValue,
} from './validation'
import './BarcodeStudio.css'
import { saveHistoryItem } from '../history/database'

const barcodeOptions = {
  width: 2,
  height: 100,
  margin: 18,
  displayValue: true,
  font: 'Arial',
  fontSize: 18,
  textMargin: 8,
  background: '#ffffff',
  lineColor: '#171722',
}

export default function BarcodeStudio() {
  const [format, setFormat] = useState<BarcodeFormat>('CODE128')
  const [value, setValue] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [generation, setGeneration] = useState<{
    input: string
    format: BarcodeFormat
    svg?: string
    error?: string
  } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const validation = useMemo(() => {
    try {
      return { value: validateBarcodeValue(format, value), error: '' }
    } catch (error) {
      return {
        value: '',
        error:
          error instanceof BarcodeValidationError
            ? error.message
            : 'Check the value and try again.',
      }
    }
  }, [format, value])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !validation.value) return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      svg.replaceChildren()
      try {
        JsBarcode(svg, validation.value, { ...barcodeOptions, format })
        setGeneration({ input: validation.value, format, svg: svg.outerHTML })
      } catch {
        setGeneration({
          input: validation.value,
          format,
          error: 'This value could not be encoded in the selected format.',
        })
      }
    })
    return () => {
      cancelled = true
    }
  }, [format, validation.value])

  const currentGeneration =
    generation?.input === validation.value && generation.format === format
      ? generation
      : null
  const currentSvg = currentGeneration?.svg
  const generationError = currentGeneration?.error
  const formatInfo = barcodeFormats.find((item) => item.value === format)!

  const downloadSvg = () => {
    if (!currentSvg) return
    const blob = new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' })
    downloadBlob(blob, `scan-and-create-${format.toLowerCase()}.svg`)
  }

  const saveBarcode = async () => {
    if (!validation.value || !currentSvg) return
    try {
      await saveHistoryItem({ kind: 'barcode', format, value: validation.value })
      setSaveMessage('Saved in this browser.')
    } catch {
      setSaveMessage('Could not save this barcode.')
    }
  }

  const downloadPng = async () => {
    if (!currentSvg) return
    const imageUrl = URL.createObjectURL(
      new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' }),
    )
    try {
      const image = new Image()
      image.src = imageUrl
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width * 3
      canvas.height = image.height * 3
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas is unavailable')
      context.scale(3, 3)
      context.drawImage(image, 0, 0)
      const png = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
          'image/png',
        ),
      )
      downloadBlob(png, `scan-and-create-${format.toLowerCase()}.png`)
    } catch {
      // PNG conversion can be unavailable in restricted browsers; SVG remains available.
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  return (
    <section className="barcode-studio-page" aria-labelledby="barcode-studio-title">
      <div className="barcode-studio-heading">
        <div>
          <div className="eyebrow">
            <Barcode size={14} /> BARCODE STUDIO
          </div>
          <h1 id="barcode-studio-title">Create a barcode</h1>
          <p>Generate a clear, printable barcode without changing your value.</p>
        </div>
        <div className="barcode-privacy-note">
          <ShieldCheck size={17} /> Generated on this device
        </div>
      </div>

      <div className="barcode-studio-grid">
        <div className="barcode-builder-card">
          <label className="qr-field" htmlFor="barcode-format">
            <span>Barcode format</span>
            <select
              id="barcode-format"
              value={format}
              onChange={(event) => setFormat(event.target.value as BarcodeFormat)}
            >
              {barcodeFormats.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="qr-field barcode-value-field" htmlFor="barcode-value">
            <span>Value</span>
            <input
              id="barcode-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="barcode-format-hint barcode-check-digit-note"
            />
            <small id="barcode-format-hint">{formatInfo.hint}</small>
          </label>
          <p id="barcode-check-digit-note" className="barcode-check-digit-note">
            Check digits are validated, never added or corrected for you. Your value is
            encoded exactly as entered.
          </p>
          {(validation.error || generationError) && (
            <p className="barcode-error" role="alert">
              <AlertCircle size={15} /> {validation.error || generationError}
            </p>
          )}
          {currentSvg && (
            <div className="barcode-actions">
              <button className="qr-primary-button" type="button" onClick={downloadSvg}>
                <Download size={16} /> Download SVG
              </button>
              <button className="qr-secondary-button" type="button" onClick={downloadPng}>
                <Download size={15} /> Download PNG
              </button>
              <button
                className="qr-secondary-button"
                type="button"
                onClick={() => window.print()}
              >
                <Printer size={15} /> Print
              </button>
              <button className="qr-secondary-button" type="button" onClick={saveBarcode}>
                <Bookmark size={15} /> Save to history
              </button>
            </div>
          )}
        </div>

        <div className="barcode-preview-card">
          <div className="barcode-print-area">
            <div className="barcode-preview-frame">
              {validation.value ? (
                <svg ref={svgRef} aria-label={`${formatInfo.label} barcode preview`} />
              ) : (
                <div className="barcode-preview-empty">
                  <Barcode size={42} strokeWidth={1.4} />
                  <span>
                    {validation.error || 'Enter a value to preview your barcode.'}
                  </span>
                </div>
              )}
            </div>
            <div className="barcode-preview-caption">
              <strong>{currentSvg ? 'Ready to print' : 'Live preview'}</strong>
              <span>Keep the clear space around the bars for reliable scanning.</span>
            </div>
          </div>
          <p className="barcode-status" role="status" aria-live="polite">
            {saveMessage ||
              (currentSvg && (
                <>
                  <Check size={13} /> Preview updates as you type.
                </>
              ))}
          </p>
        </div>
      </div>
    </section>
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
