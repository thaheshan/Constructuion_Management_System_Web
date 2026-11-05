import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidSriLankaMobile,
  isValidCompanyPhone,
  isValidShopId,
  isValidNIC,
  calculatePasswordStrength,
  validateOwnerStep1,
  validateOwnerStep1Field,
  validateOwnerStep2,
  validateOwnerStep2Field,
} from '../validators';

test('Email validator: correctly validates standard email addresses', () => {
  assert.equal(isValidEmail('test@example.com'), true);
  assert.equal(isValidEmail('owner@company.lk'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('no-domain@'), false);
  assert.equal(isValidEmail('@nodomain.com'), false);
});

test('Phone validator: validates Sri Lanka 9-digit mobile numbers', () => {
  assert.equal(isValidSriLankaMobile('771234567'), true);
  assert.equal(isValidSriLankaMobile('77 123 4567'), true);
  assert.equal(isValidSriLankaMobile('+94 77 123 4567'), true);
  assert.equal(isValidSriLankaMobile('0771234567'), true);
  assert.equal(isValidSriLankaMobile('112345678'), false); // Landline
  assert.equal(isValidSriLankaMobile('7712345'), false); // Too short
});

test('Company phone validator: accepts 8-10 digit numbers', () => {
  assert.equal(isValidCompanyPhone('112345678'), true);
  assert.equal(isValidCompanyPhone('0112345678'), true);
  assert.equal(isValidCompanyPhone('123'), false);
});

test('Shop ID validator: matches FUT-XXXX-XXXX format', () => {
  assert.equal(isValidShopId('FUT-7K4M-9Q2X'), true);
  assert.equal(isValidShopId('FUT-1234-ABCD'), true);
  assert.equal(isValidShopId('INVALID-ID'), false);
  assert.equal(isValidShopId('FUT-123-ABCD'), false);
});

test('NIC validator: validates old 9-digit+V/X and new 12-digit format', () => {
  assert.equal(isValidNIC('923456789V'), true);
  assert.equal(isValidNIC('923456789X'), true);
  assert.equal(isValidNIC('199234567890'), true);
  assert.equal(isValidNIC('invalid'), false);
});

test('Password strength: evaluates tiers accurately', () => {
  assert.equal(calculatePasswordStrength('').level, 'NONE');
  assert.equal(calculatePasswordStrength('short').level, 'WEAK');
  assert.equal(calculatePasswordStrength('Abcdefgh').level, 'FAIR');
  assert.equal(calculatePasswordStrength('Abcdef1@').level, 'GOOD'); // 8 chars capped at GOOD
  assert.equal(calculatePasswordStrength('Abcdef1@ghij').level, 'STRONG'); // 12+ chars
});

test('validateOwnerStep1: flags missing or invalid personal details', () => {
  const emptyErrors = validateOwnerStep1({});
  assert.ok(emptyErrors.fullName);
  assert.ok(emptyErrors.email);
  assert.ok(emptyErrors.phone);
  assert.ok(emptyErrors.password);
  assert.ok(emptyErrors.confirmPassword);
  assert.ok(emptyErrors.agreedToTerms);

  const validErrors = validateOwnerStep1({
    fullName: 'Kamal Perera',
    email: 'kamal@example.com',
    phone: '771234567',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    agreedToTerms: true,
  });
  assert.equal(Object.keys(validErrors).length, 0);
});

test('validateOwnerStep2: flags required company details', () => {
  const emptyErrors = validateOwnerStep2({});
  assert.ok(emptyErrors.companyName);
  assert.ok(emptyErrors.businessType);
  assert.ok(emptyErrors.companyPhone);
  assert.ok(emptyErrors.addressLine);
  assert.ok(emptyErrors.city);
  assert.ok(emptyErrors.district);

  const validErrors = validateOwnerStep2({
    companyName: 'Futura Builders',
    businessType: 'Private Limited Company (Pvt Ltd)',
    companyPhone: '112345678',
    addressLine: '123 Galle Road',
    city: 'Colombo',
    district: 'Colombo',
  });
  assert.equal(Object.keys(validErrors).length, 0);
});
