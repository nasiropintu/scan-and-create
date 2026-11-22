export type QrContentType =
  'text' | 'url' | 'phone' | 'email' | 'sms' | 'wifi' | 'contact'

export type QrFormValues = Record<string, string | boolean>

export class QrPayloadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QrPayloadError'
  }
}

function required(values: QrFormValues, key: string, label: string) {
  const value = values[key]
  if (typeof value !== 'string' || !value.trim()) {
    throw new QrPayloadError(`${label} is required.`)
  }
  return value.trim()
}

function phoneNumber(values: QrFormValues) {
  const number = required(values, 'phone', 'Phone number')
  if (!/^[+\d\s().-]+$/.test(number) || number.replace(/\D/g, '').length < 3) {
    throw new QrPayloadError('Enter a valid phone number.')
  }
  return number
}

function escapeWifi(value: string) {
  return value.replace(/[\\;:,"]/g, (character) => `\\${character}`)
}

function escapeVCard(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/([;,])/g, '\\$1')
}

export function createQrPayload(type: QrContentType, values: QrFormValues) {
  switch (type) {
    case 'text':
      return required(values, 'text', 'Text')
    case 'url': {
      const input = required(values, 'url', 'Website address')
      const normalized = /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`
      let url: URL
      try {
        url = new URL(normalized)
      } catch {
        throw new QrPayloadError('Enter a valid web address.')
      }
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw new QrPayloadError('Website addresses must use http or https.')
      }
      return url.toString()
    }
    case 'phone':
      return `tel:${phoneNumber(values)}`
    case 'email': {
      const address = required(values, 'email', 'Email address')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        throw new QrPayloadError('Enter a valid email address.')
      }
      const subject = typeof values.subject === 'string' ? values.subject.trim() : ''
      return `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
    }
    case 'sms': {
      const number = phoneNumber(values)
      const message = typeof values.message === 'string' ? values.message.trim() : ''
      return `SMSTO:${number}:${message}`
    }
    case 'wifi': {
      const ssid = escapeWifi(required(values, 'ssid', 'Network name'))
      const security = typeof values.security === 'string' ? values.security : 'WPA'
      const password = typeof values.password === 'string' ? values.password : ''
      if (security !== 'nopass' && !password.trim()) {
        throw new QrPayloadError('Password is required for this network security type.')
      }
      const hidden = values.hidden === true ? 'true' : 'false'
      return `WIFI:T:${security};S:${ssid};P:${escapeWifi(password)};H:${hidden};;`
    }
    case 'contact': {
      const firstName =
        typeof values.firstName === 'string' ? values.firstName.trim() : ''
      const lastName = typeof values.lastName === 'string' ? values.lastName.trim() : ''
      if (!firstName && !lastName) {
        throw new QrPayloadError('Enter at least a first or last name.')
      }
      const fullName = [firstName, lastName].filter(Boolean).join(' ')
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
        `FN:${escapeVCard(fullName)}`,
      ]
      const phone = typeof values.phone === 'string' ? values.phone.trim() : ''
      const email = typeof values.email === 'string' ? values.email.trim() : ''
      if (phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(phone)}`)
      if (email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new QrPayloadError('Enter a valid email address.')
        }
        lines.push(`EMAIL:${escapeVCard(email)}`)
      }
      lines.push('END:VCARD')
      return lines.join('\r\n')
    }
  }
}
