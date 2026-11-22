export type BarcodeFormat =
  'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'UPCE' | 'CODE39' | 'ITF' | 'ITF14'

export const barcodeFormats: { value: BarcodeFormat; label: string; hint: string }[] = [
  {
    value: 'CODE128',
    label: 'Code 128',
    hint: 'Variable length; ASCII characters only.',
  },
  {
    value: 'EAN13',
    label: 'EAN-13',
    hint: 'Enter all 13 digits, including a valid check digit.',
  },
  {
    value: 'EAN8',
    label: 'EAN-8',
    hint: 'Enter all 8 digits, including a valid check digit.',
  },
  {
    value: 'UPC',
    label: 'UPC-A',
    hint: 'Enter all 12 digits, including a valid check digit.',
  },
  {
    value: 'UPCE',
    label: 'UPC-E',
    hint: 'Enter 8 digits: number system, 6 data digits, and check digit.',
  },
  {
    value: 'CODE39',
    label: 'Code 39',
    hint: 'Use uppercase letters, digits, spaces, and - . $ / + %.',
  },
  {
    value: 'ITF',
    label: 'ITF',
    hint: 'Use an even number of digits (2 or more); no check digit is added.',
  },
  {
    value: 'ITF14',
    label: 'ITF-14',
    hint: 'Enter all 14 digits, including a valid check digit.',
  },
]

export class BarcodeValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BarcodeValidationError'
  }
}

function checkDigit(data: string) {
  const sum = [...data]
    .reverse()
    .reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 3 : 1), 0)
  return String((10 - (sum % 10)) % 10)
}

function requireDigits(value: string, format: string, length: number) {
  if (!new RegExp(`^\\d{${length}}$`).test(value)) {
    throw new BarcodeValidationError(`${format} requires exactly ${length} digits.`)
  }
  if (value.at(-1) !== checkDigit(value.slice(0, -1))) {
    throw new BarcodeValidationError(`${format} has an incorrect check digit.`)
  }
}

function expandUpcE(value: string) {
  const middle = value.slice(1, 7)
  const last = Number(middle[5])
  let body: string

  if (last <= 2) body = `${middle.slice(0, 2)}${last}0000${middle.slice(2, 5)}`
  else if (last === 3) body = `${middle.slice(0, 3)}00000${middle[3]}${middle[4]}`
  else if (last === 4) body = `${middle.slice(0, 4)}00000${middle[4]}`
  else body = `${middle.slice(0, 5)}0000${last}`

  return `${value[0]}${body}`
}

export function validateBarcodeValue(format: BarcodeFormat, value: string) {
  if (!value.length) throw new BarcodeValidationError('Enter a barcode value.')

  switch (format) {
    case 'CODE128':
      if (![...value].every((character) => character.codePointAt(0)! <= 0x7f)) {
        throw new BarcodeValidationError('Code 128 supports ASCII characters only.')
      }
      break
    case 'EAN13':
      requireDigits(value, 'EAN-13', 13)
      break
    case 'EAN8':
      requireDigits(value, 'EAN-8', 8)
      break
    case 'UPC':
      requireDigits(value, 'UPC-A', 12)
      break
    case 'UPCE': {
      if (!/^[01]\d{7}$/.test(value)) {
        throw new BarcodeValidationError(
          'UPC-E requires 8 digits and a number system of 0 or 1.',
        )
      }
      const expanded = expandUpcE(value)
      if (value[7] !== checkDigit(expanded)) {
        throw new BarcodeValidationError('UPC-E has an incorrect check digit.')
      }
      break
    }
    case 'CODE39':
      if (!/^[0-9A-Z .$/+%-]+$/.test(value)) {
        throw new BarcodeValidationError(
          'Code 39 accepts uppercase letters, digits, spaces, and - . $ / + %.',
        )
      }
      break
    case 'ITF':
      if (!/^(?:\d{2})+$/.test(value)) {
        throw new BarcodeValidationError(
          'ITF requires an even number of digits (2 or more).',
        )
      }
      break
    case 'ITF14':
      requireDigits(value, 'ITF-14', 14)
      break
  }

  return value
}
