import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BarcodeValidationError,
  validateBarcodeValue,
} from '../src/features/barcode-generator/validation.ts'

test('accepts Code 128 ASCII without changing the input', () => {
  const value = 'Box 12 / shelf-A'
  assert.equal(validateBarcodeValue('CODE128', value), value)
  assert.throws(() => validateBarcodeValue('CODE128', 'café'), /ASCII characters only/)
})

test('validates full EAN, UPC-A, and ITF-14 values without adding digits', () => {
  const validValues = [
    ['EAN13', '5901234123457'],
    ['EAN8', '96385074'],
    ['UPC', '036000291452'],
    ['ITF14', '10012345000017'],
  ]
  for (const [format, value] of validValues) {
    assert.equal(validateBarcodeValue(format, value), value)
  }
  assert.throws(
    () => validateBarcodeValue('EAN13', '590123412345'),
    /requires exactly 13 digits/,
  )
  assert.throws(
    () => validateBarcodeValue('UPC', '036000291453'),
    /incorrect check digit/,
  )
})

test('validates UPC-E number system and check digit', () => {
  assert.equal(validateBarcodeValue('UPCE', '04252614'), '04252614')
  assert.throws(() => validateBarcodeValue('UPCE', '24252614'), /number system of 0 or 1/)
  assert.throws(() => validateBarcodeValue('UPCE', '04252615'), /incorrect check digit/)
})

test('accepts only Code 39 supported uppercase characters', () => {
  const value = 'ITEM 42-A/$'
  assert.equal(validateBarcodeValue('CODE39', value), value)
  assert.throws(
    () => validateBarcodeValue('CODE39', 'item-42'),
    /Code 39 accepts uppercase/,
  )
})

test('requires digit pairs for ITF and preserves them exactly', () => {
  assert.equal(validateBarcodeValue('ITF', '001234'), '001234')
  assert.throws(() => validateBarcodeValue('ITF', '123'), /even number of digits/)
  assert.throws(() => validateBarcodeValue('ITF', '12AB'), BarcodeValidationError)
})
