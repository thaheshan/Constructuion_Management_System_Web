import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePasswordStrength,
  validateSriLankaPhone,
  validateSriLankaNIC,
} from '../validation';

test('Password strength: empty string returns NONE', () => {
  const result = calculatePasswordStrength('');
  assert.equal(result.score, 0);
  assert.equal(result.level, 'NONE');
  assert.equal(result.label, '');
});

test('Password strength: less than 8 characters is strictly WEAK', () => {
  const r1 = calculatePasswordStrength('short');
  assert.equal(r1.score, 1);
  assert.equal(r1.level, 'WEAK');

  const r2 = calculatePasswordStrength('Ab1@');
  assert.equal(r2.score, 1);
  assert.equal(r2.level, 'WEAK');
});

test('Password strength: 8-character password with mixed case, number, and symbol is capped at GOOD (not STRONG)', () => {
  // An 8-character password like Abcdef1@ must NOT be marked as STRONG
  const result = calculatePasswordStrength('Abcdef1@');
  assert.equal(result.score, 3);
  assert.equal(result.level, 'GOOD');
  assert.equal(result.label, 'GOOD');
});

test('Password strength: passwords between 8 and 11 characters evaluate FAIR or GOOD', () => {
  const fairResult = calculatePasswordStrength('Abcdefgh');
  assert.equal(fairResult.score, 2);
  assert.equal(fairResult.level, 'FAIR');

  const goodResult = calculatePasswordStrength('Abcdef11');
  assert.equal(goodResult.score, 3);
  assert.equal(goodResult.level, 'GOOD');

  const goodWithSymbol = calculatePasswordStrength('Abcdef1@99');
  assert.equal(goodWithSymbol.score, 3);
  assert.equal(goodWithSymbol.level, 'GOOD');
});

test('Password strength: 12 or more characters with full variety achieves STRONG', () => {
  const strongResult = calculatePasswordStrength('Abcdef1@ghij');
  assert.equal(strongResult.score, 4);
  assert.equal(strongResult.level, 'STRONG');
  assert.equal(strongResult.label, 'STRONG');
  assert.equal(strongResult.colorClass, 'bg-emerald-500');
});

test('Sri Lanka Phone Validation: accepts valid mobile formats', () => {
  assert.equal(validateSriLankaPhone('771234567'), true);
  assert.equal(validateSriLankaPhone('77 123 4567'), true);
  assert.equal(validateSriLankaPhone('+94 77 123 4567'), true);
  assert.equal(validateSriLankaPhone('0771234567'), true);
  assert.equal(validateSriLankaPhone('71-234-5678'), true);
  assert.equal(validateSriLankaPhone('701234567'), true);
});

test('Sri Lanka Phone Validation: rejects invalid formats and landlines', () => {
  assert.equal(validateSriLankaPhone(''), false);
  assert.equal(validateSriLankaPhone('112345678'), false, 'Colombo landline is not mobile');
  assert.equal(validateSriLankaPhone('77123456'), false, 'Too short (8 digits)');
  assert.equal(validateSriLankaPhone('7712345678'), false, 'Too long (10 digits without leading 0)');
  assert.equal(validateSriLankaPhone('abcdefghi'), false);
});

test('Sri Lanka NIC Validation: validates old 9-digit + V/X format', () => {
  assert.equal(validateSriLankaNIC('901234567V'), true);
  assert.equal(validateSriLankaNIC('851234567v'), true);
  assert.equal(validateSriLankaNIC('921234567X'), true);
  assert.equal(validateSriLankaNIC('921234567x'), true);
});

test('Sri Lanka NIC Validation: validates new 12-digit format', () => {
  assert.equal(validateSriLankaNIC('199012345678'), true);
  assert.equal(validateSriLankaNIC('200012345678'), true);
});

test('Sri Lanka NIC Validation: rejects invalid NIC numbers', () => {
  assert.equal(validateSriLankaNIC(''), false);
  assert.equal(validateSriLankaNIC('12345'), false);
  assert.equal(validateSriLankaNIC('901234567A'), false, 'Invalid letter A');
  assert.equal(validateSriLankaNIC('1990123456789'), false, 'Too long (13 digits)');
  assert.equal(validateSriLankaNIC('90123456V'), false, 'Too short for old format');
});
