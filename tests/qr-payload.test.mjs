import assert from 'node:assert/strict'
import test from 'node:test'
import { createQrPayload, QrPayloadError } from '../src/features/qr-generator/payload.ts'

test('builds a plain text payload and rejects blank text', () => {
  assert.equal(createQrPayload('text', { text: '  Hello QR  ' }), 'Hello QR')
  assert.throws(
    () => createQrPayload('text', { text: '  ' }),
    (error) => error instanceof QrPayloadError && error.message === 'Text is required.',
  )
})

test('normalizes web addresses and rejects non-web protocols', () => {
  assert.equal(
    createQrPayload('url', { url: 'example.com/path' }),
    'https://example.com/path',
  )
  assert.equal(
    createQrPayload('url', { url: 'http://example.com' }),
    'http://example.com/',
  )
  assert.throws(
    () => createQrPayload('url', { url: 'javascript:alert(1)' }),
    /Website addresses must use http or https\./,
  )
})

test('builds phone and SMS payloads and validates phone numbers', () => {
  assert.equal(
    createQrPayload('phone', { phone: '+1 (555) 123-4567' }),
    'tel:+1 (555) 123-4567',
  )
  assert.equal(
    createQrPayload('sms', { phone: '+15551234567', message: 'I am here' }),
    'SMSTO:+15551234567:I am here',
  )
  assert.throws(
    () => createQrPayload('phone', { phone: 'call me' }),
    /Enter a valid phone number\./,
  )
})

test('builds email payloads with an encoded subject and validates addresses', () => {
  assert.equal(
    createQrPayload('email', { email: 'hello@example.com', subject: 'Hi there!' }),
    'mailto:hello@example.com?subject=Hi%20there!',
  )
  assert.throws(
    () => createQrPayload('email', { email: 'not-an-address' }),
    /Enter a valid email address\./,
  )
})

test('escapes Wi-Fi fields and supports open networks', () => {
  assert.equal(
    createQrPayload('wifi', {
      ssid: 'Home;Net',
      password: 'p;ass\\word,"x"',
      security: 'WPA',
      hidden: true,
    }),
    'WIFI:T:WPA;S:Home\\;Net;P:p\\;ass\\\\word\\,\\"x\\";H:true;;',
  )
  assert.equal(
    createQrPayload('wifi', { ssid: 'Guest', security: 'nopass' }),
    'WIFI:T:nopass;S:Guest;P:;H:false;;',
  )
  assert.throws(
    () => createQrPayload('wifi', { ssid: 'Home', security: 'WPA' }),
    /Password is required/,
  )
})

test('builds vCards with escaped names and optional contact details', () => {
  assert.equal(
    createQrPayload('contact', {
      firstName: 'Ada;L.',
      lastName: 'Lovelace',
      phone: '+441234567',
      email: 'ada@example.com',
    }),
    [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Lovelace;Ada\\;L.;;;',
      'FN:Ada\\;L. Lovelace',
      'TEL;TYPE=CELL:+441234567',
      'EMAIL:ada@example.com',
      'END:VCARD',
    ].join('\r\n'),
  )
  assert.throws(
    () => createQrPayload('contact', { firstName: 'Ada', email: 'bad' }),
    /Enter a valid email address\./,
  )
})
