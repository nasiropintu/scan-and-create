export type ClassifiedContent =
  | { type: 'url'; href: string; display: string }
  | { type: 'email'; email: string; subject?: string; href: string }
  | { type: 'phone'; phone: string; href: string }
  | { type: 'sms'; phone: string; message?: string; href: string }
  | {
      type: 'wifi'
      ssid: string
      password?: string
      security: string
      hidden: boolean
    }
  | {
      type: 'contact'
      name: string
      phone?: string
      email?: string
      org?: string
      title?: string
      url?: string
    }
  | { type: 'text'; text: string }

function unescapeWifi(value: string) {
  return value.replace(/\\([\\;:,"])/g, '$1')
}

function parseWifiField(raw: string, key: string): string | undefined {
  const regex = new RegExp(`(?:^|;)${key}:((?:\\\\;|[^;])*)`, 'i')
  const match = raw.match(regex)
  return match ? unescapeWifi(match[1]) : undefined
}

function unescapeVCard(value: string) {
  return value.replace(/\\n/gi, '\n').replace(/\\([\\;,])/g, '$1')
}

export function classifyContent(raw: string): ClassifiedContent {
  const trimmed = raw.trim()

  // 1. Wi-Fi QR (WIFI:S:MySSID;T:WPA;P:password;H:false;;)
  if (/^WIFI:/i.test(trimmed)) {
    const ssid = parseWifiField(trimmed, 'S')
    const password = parseWifiField(trimmed, 'P')
    const security = parseWifiField(trimmed, 'T')?.toUpperCase() || 'WPA'
    const hidden = parseWifiField(trimmed, 'H')?.toLowerCase() === 'true'

    if (ssid) {
      return {
        type: 'wifi',
        ssid,
        password,
        security,
        hidden,
      }
    }
  }

  // 2. vCard / Contact Card
  if (/BEGIN:VCARD/i.test(trimmed) && /END:VCARD/i.test(trimmed)) {
    const fnMatch = trimmed.match(/\nFN(?:;[^\n:]*)?:([^\r\n]+)/i)
    const nMatch = trimmed.match(/\nN(?:;[^\n:]*)?:([^\r\n]+)/i)
    const telMatch = trimmed.match(/\nTEL(?:;[^\n:]*)?:([^\r\n]+)/i)
    const emailMatch = trimmed.match(/\nEMAIL(?:;[^\n:]*)?:([^\r\n]+)/i)
    const orgMatch = trimmed.match(/\nORG(?:;[^\n:]*)?:([^\r\n]+)/i)
    const titleMatch = trimmed.match(/\nTITLE(?:;[^\n:]*)?:([^\r\n]+)/i)
    const urlMatch = trimmed.match(/\nURL(?:;[^\n:]*)?:([^\r\n]+)/i)

    let name = fnMatch ? unescapeVCard(fnMatch[1].trim()) : ''
    if (!name && nMatch) {
      const parts = nMatch[1].split(';').map((p) => unescapeVCard(p.trim()))
      const [last, first] = parts
      name = [first, last].filter(Boolean).join(' ')
    }

    return {
      type: 'contact',
      name: name || 'Contact card',
      phone: telMatch ? telMatch[1].trim() : undefined,
      email: emailMatch ? emailMatch[1].trim() : undefined,
      org: orgMatch ? unescapeVCard(orgMatch[1].trim()) : undefined,
      title: titleMatch ? unescapeVCard(titleMatch[1].trim()) : undefined,
      url: urlMatch ? urlMatch[1].trim() : undefined,
    }
  }

  // 3. Email (mailto:... or plain email address)
  if (/^mailto:/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      const email = parsed.pathname
      const subject = parsed.searchParams.get('subject') || undefined
      return {
        type: 'email',
        email,
        subject,
        href: trimmed,
      }
    } catch {
      const email = trimmed.replace(/^mailto:/i, '').split('?')[0]
      return { type: 'email', email, href: trimmed }
    }
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return {
      type: 'email',
      email: trimmed,
      href: `mailto:${trimmed}`,
    }
  }

  // 4. SMS (SMSTO:number:body or sms:number?body=...)
  if (/^SMSTO:/i.test(trimmed)) {
    const parts = trimmed.slice(6).split(':')
    const phone = parts[0]
    const message = parts.slice(1).join(':') || undefined
    return {
      type: 'sms',
      phone,
      message,
      href: `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`,
    }
  }
  if (/^sms:/i.test(trimmed)) {
    const rawNumber = trimmed.slice(4).split('?')[0]
    const query = trimmed.includes('?') ? trimmed.slice(trimmed.indexOf('?') + 1) : ''
    const params = new URLSearchParams(query)
    const message = params.get('body') || undefined
    return {
      type: 'sms',
      phone: rawNumber,
      message,
      href: trimmed,
    }
  }

  // 5. Phone (tel:... or formatted phone number)
  if (/^tel:/i.test(trimmed)) {
    const phone = trimmed.slice(4)
    return {
      type: 'phone',
      phone,
      href: trimmed,
    }
  }
  // If it looks strictly like a standalone phone number (starts with + or digit, minimum 7 digits, no alpha)
  if (
    /^\+?[0-9\s().-]{7,25}$/.test(trimmed) &&
    (trimmed.match(/\d/g) || []).length >= 7
  ) {
    return {
      type: 'phone',
      phone: trimmed,
      href: `tel:${trimmed.replace(/\s+/g, '')}`,
    }
  }

  // 6. URL (http/https or valid domain name with path)
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return {
          type: 'url',
          href: parsed.href,
          display: parsed.href,
        }
      }
    } catch {
      // not a valid url
    }
  }
  // Check domain-like strings e.g. "www.example.com" or "example.com/page"
  if (/^(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/.test(trimmed)) {
    try {
      const parsed = new URL(`https://${trimmed}`)
      return {
        type: 'url',
        href: parsed.href,
        display: trimmed,
      }
    } catch {
      // not a valid url
    }
  }

  // 7. Fallback: plain text
  return {
    type: 'text',
    text: raw,
  }
}
