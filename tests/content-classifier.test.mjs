import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyContent } from '../src/features/results/contentClassifier.ts'

test('classifies URLs correctly', () => {
  const result1 = classifyContent('https://example.com/test?query=1')
  assert.equal(result1.type, 'url')
  if (result1.type === 'url') {
    assert.equal(result1.href, 'https://example.com/test?query=1')
  }

  const result2 = classifyContent('github.com/nasiropintu')
  assert.equal(result2.type, 'url')
  if (result2.type === 'url') {
    assert.equal(result2.href, 'https://github.com/nasiropintu')
  }
})

test('classifies email addresses and mailto URIs', () => {
  const result1 = classifyContent('hello@example.com')
  assert.equal(result1.type, 'email')
  if (result1.type === 'email') {
    assert.equal(result1.email, 'hello@example.com')
    assert.equal(result1.href, 'mailto:hello@example.com')
  }

  const result2 = classifyContent('mailto:test@example.com?subject=Hello')
  assert.equal(result2.type, 'email')
  if (result2.type === 'email') {
    assert.equal(result2.email, 'test@example.com')
    assert.equal(result2.subject, 'Hello')
  }
})

test('classifies phone numbers and tel URIs', () => {
  const result1 = classifyContent('tel:+15551234567')
  assert.equal(result1.type, 'phone')
  if (result1.type === 'phone') {
    assert.equal(result1.phone, '+15551234567')
  }

  const result2 = classifyContent('+1 (555) 234-5678')
  assert.equal(result2.type, 'phone')
  if (result2.type === 'phone') {
    assert.equal(result2.phone, '+1 (555) 234-5678')
  }
})

test('classifies SMS URIs', () => {
  const result = classifyContent('SMSTO:+1234567890:Hello there')
  assert.equal(result.type, 'sms')
  if (result.type === 'sms') {
    assert.equal(result.phone, '+1234567890')
    assert.equal(result.message, 'Hello there')
  }
})

test('classifies Wi-Fi networks and unescapes credentials', () => {
  const result = classifyContent('WIFI:T:WPA;S:Office\\;Guest;P:sec\\;ret;H:false;;')
  assert.equal(result.type, 'wifi')
  if (result.type === 'wifi') {
    assert.equal(result.ssid, 'Office;Guest')
    assert.equal(result.password, 'sec;ret')
    assert.equal(result.security, 'WPA')
    assert.equal(result.hidden, false)
  }
})

test('classifies vCards and extracts contact information', () => {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:John Doe',
    'TEL;TYPE=CELL:+15559876543',
    'EMAIL:john@example.com',
    'ORG:Acme Corp',
    'END:VCARD',
  ].join('\n')

  const result = classifyContent(vcard)
  assert.equal(result.type, 'contact')
  if (result.type === 'contact') {
    assert.equal(result.name, 'John Doe')
    assert.equal(result.phone, '+15559876543')
    assert.equal(result.email, 'john@example.com')
    assert.equal(result.org, 'Acme Corp')
  }
})

test('falls back to plain text for unformatted strings', () => {
  const result = classifyContent('Just some normal text here.')
  assert.equal(result.type, 'text')
  if (result.type === 'text') {
    assert.equal(result.text, 'Just some normal text here.')
  }
})
