import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  type IScannerControls,
} from '@zxing/browser'

export type DecodedScan = {
  text: string
  format: string
}

export type CameraScannerSession = {
  source: 'native' | 'fallback'
  stop: () => void
}

type NativeDetectedBarcode = {
  rawValue: string
  format: string
}

type NativeDetector = {
  detect: (
    source: HTMLVideoElement | HTMLImageElement,
  ) => Promise<NativeDetectedBarcode[]>
}

type NativeDetectorConstructor = {
  new (options?: { formats?: string[] }): NativeDetector
  getSupportedFormats: () => Promise<string[]>
}

type WindowWithBarcodeDetector = Window & {
  BarcodeDetector?: NativeDetectorConstructor
}

const nativeFormats = [
  'qr_code',
  'code_128',
  'code_39',
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'itf',
]

const zxingFormats = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.ITF,
]

const zxingFormatLabels: Record<string, string> = {
  QR_CODE: 'QR Code',
  CODE_128: 'Code 128',
  CODE_39: 'Code 39',
  EAN_13: 'EAN-13',
  EAN_8: 'EAN-8',
  UPC_A: 'UPC-A',
  UPC_E: 'UPC-E',
  ITF: 'ITF',
}

function zxingFormatLabel(format: BarcodeFormat) {
  const name = BarcodeFormat[format]
  return zxingFormatLabels[name] ?? name ?? 'Barcode'
}

function getNativeConstructor() {
  return (window as WindowWithBarcodeDetector).BarcodeDetector
}

async function getNativeDetector() {
  const Detector = getNativeConstructor()
  if (!Detector) return null

  try {
    const supported = await Detector.getSupportedFormats()
    const formats = nativeFormats.filter((format) => supported.includes(format))
    if (formats.length !== nativeFormats.length) return null
    return new Detector({ formats })
  } catch {
    return null
  }
}

function nativeFormatLabel(format: string) {
  const labels: Record<string, string> = {
    qr_code: 'QR Code',
    code_128: 'Code 128',
    code_39: 'Code 39',
    ean_13: 'EAN-13',
    ean_8: 'EAN-8',
    upc_a: 'UPC-A',
    upc_e: 'UPC-E',
    itf: 'ITF',
  }
  return labels[format] ?? format.toUpperCase()
}

export async function listCameras() {
  if (!navigator.mediaDevices?.enumerateDevices) return []
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices
    .filter((device) => device.kind === 'videoinput')
    .map(({ deviceId, label }) => ({ deviceId, label: label || 'Camera' }))
}

export async function startCameraScanner(
  video: HTMLVideoElement,
  deviceId: string,
  onResult: (result: DecodedScan) => void,
  onCameras: (cameras: { deviceId: string; label: string }[]) => void,
): Promise<CameraScannerSession> {
  const detector = await getNativeDetector()

  if (detector && navigator.mediaDevices?.getUserMedia) {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: { ideal: 'environment' } },
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    let stopped = false
    let detecting = false
    let frameId = 0
    let delivered = false
    const stop = () => {
      if (stopped) return
      stopped = true
      cancelAnimationFrame(frameId)
      stream.getTracks().forEach((track) => track.stop())
      video.pause()
      video.srcObject = null
    }

    try {
      video.srcObject = stream
      video.playsInline = true
      video.muted = true
      await video.play()
      onCameras(await listCameras())
    } catch (error) {
      stop()
      throw error
    }

    const scanFrame = async () => {
      if (stopped) return
      if (!detecting && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        detecting = true
        try {
          const matches = await detector.detect(video)
          if (!delivered && matches.length) {
            delivered = true
            onResult({
              text: matches[0].rawValue,
              format: nativeFormatLabel(matches[0].format),
            })
          }
        } catch {
          // Keep scanning through transient camera-frame decode failures.
        } finally {
          detecting = false
        }
      }
      frameId = requestAnimationFrame(scanFrame)
    }

    frameId = requestAnimationFrame(scanFrame)
    return { source: 'native', stop }
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Camera access requires a supported browser on HTTPS or localhost.')
  }

  const reader = new BrowserMultiFormatReader(undefined, {
    delayBetweenScanAttempts: 250,
    delayBetweenScanSuccess: 750,
  })
  reader.possibleFormats = zxingFormats
  let controls: IScannerControls | undefined
  let stopped = false
  const controlsPromise = reader.decodeFromVideoDevice(
    deviceId || undefined,
    video,
    (result) => {
      if (result && !stopped) {
        onResult({
          text: result.getText(),
          format: zxingFormatLabel(result.getBarcodeFormat()),
        })
      }
    },
  )

  try {
    controls = await controlsPromise
    onCameras(await listCameras())
  } catch (error) {
    stopped = true
    controls?.stop()
    throw error
  }

  return {
    source: 'fallback',
    stop: () => {
      if (stopped) return
      stopped = true
      controls?.stop()
      video.pause()
      video.srcObject = null
    },
  }
}

export async function decodeImageFile(file: File): Promise<DecodedScan> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file such as JPEG, PNG, or WebP.')
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 20 MB.')
  }

  const imageUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = imageUrl
    await image.decode()

    const nativeDetector = await getNativeDetector()
    if (nativeDetector) {
      try {
        const [match] = await nativeDetector.detect(image)
        if (match)
          return { text: match.rawValue, format: nativeFormatLabel(match.format) }
      } catch {
        // Try the local ZXing decoder if native image detection fails.
      }
    }

    const reader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 250,
    })
    reader.possibleFormats = zxingFormats
    const result = await reader.decodeFromImageElement(image)
    return {
      text: result.getText(),
      format: zxingFormatLabel(result.getBarcodeFormat()),
    }
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

export function getCameraErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'Could not start the camera. Try again.'
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return 'Camera permission was denied. Allow camera access in your browser settings, then try again.'
  }
  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return 'No camera was found on this device.'
  }
  if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    return 'The camera is busy or unavailable. Close other apps using it and try again.'
  }
  if (error.name === 'OverconstrainedError') {
    return 'That camera is unavailable. Choose another camera or use the default.'
  }
  if (error.message.includes('HTTPS')) return error.message
  return 'Could not start the camera. Check browser permissions and try again.'
}
