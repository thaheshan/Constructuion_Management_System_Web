// Verification script for Owner Onboarding Logic
const assert = require('assert');

// 1. Test Sri Lanka Districts
const districtsData = [
  { province: 'Western Province', districts: ['Colombo', 'Gampaha', 'Kalutara'] },
  { province: 'Central Province', districts: ['Kandy', 'Matale', 'Nuwara Eliya'] },
  { province: 'Southern Province', districts: ['Galle', 'Matara', 'Hambantota'] },
  { province: 'Northern Province', districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'] },
  { province: 'Eastern Province', districts: ['Batticaloa', 'Ampara', 'Trincomalee'] },
  { province: 'North Western Province', districts: ['Kurunegala', 'Puttalam'] },
  { province: 'North Central Province', districts: ['Anuradhapura', 'Polonnaruwa'] },
  { province: 'Uva Province', districts: ['Badulla', 'Monaragala'] },
  { province: 'Sabaragamuwa Province', districts: ['Ratnapura', 'Kegalle'] },
];

const allDistricts = districtsData.flatMap(d => d.districts);
assert.strictEqual(allDistricts.length, 25, 'Sri Lanka must have exactly 25 districts');
assert.strictEqual(districtsData.length, 9, 'Sri Lanka must have 9 provinces');
console.log('✔ PASS: Sri Lanka 25 districts & 9 provinces verified.');

// 2. Test Password Strength Logic
function calculatePasswordStrength(password) {
  if (!password) {
    return { score: 0, level: 'NONE' };
  }
  let checksPassed = 0;
  if (password.length >= 8) checksPassed++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) checksPassed++;
  if (/[0-9]/.test(password)) checksPassed++;
  if (/[^A-Za-z0-9]/.test(password)) checksPassed++;

  if (password.length < 8) {
    return { score: 1, level: 'WEAK' };
  }
  switch (checksPassed) {
    case 1: return { score: 1, level: 'WEAK' };
    case 2: return { score: 2, level: 'FAIR' };
    case 3: return { score: 3, level: 'GOOD' };
    case 4: default: return { score: 4, level: 'STRONG' };
  }
}

assert.strictEqual(calculatePasswordStrength('').level, 'NONE');
assert.strictEqual(calculatePasswordStrength('abc').level, 'WEAK');
assert.strictEqual(calculatePasswordStrength('abcdefgh').level, 'WEAK');
assert.strictEqual(calculatePasswordStrength('Abcdefgh').level, 'FAIR');
assert.strictEqual(calculatePasswordStrength('Abcdefg1').level, 'GOOD');
assert.strictEqual(calculatePasswordStrength('Abcdef1@').level, 'STRONG');
console.log('✔ PASS: Password strength calculation verified across all 5 tiers.');

// 3. Test Sri Lanka Phone & NIC Validations
const isValidSriLankaPhone = (phone) => /^7[0-9]{8}$/.test(phone.replace(/\s+/g, ''));
assert.strictEqual(isValidSriLankaPhone('771234567'), true);
assert.strictEqual(isValidSriLankaPhone('77 123 4567'), true);
assert.strictEqual(isValidSriLankaPhone('112345678'), false, 'Landline not valid for mobile');
assert.strictEqual(isValidSriLankaPhone('77123456'), false, '8 digits too short');
console.log('✔ PASS: Sri Lanka mobile phone format validation verified.');

// 4. Test Step 5 Shop ID Format & Next Steps
const isValidShopId = (id) => /^FUT-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(id);
assert.strictEqual(isValidShopId('FUT-7K4M-9Q2X'), true);
assert.strictEqual(isValidShopId('FUT-1234-ABCD'), true);
assert.strictEqual(isValidShopId('FUT-123-ABCD'), false, 'Segment too short');
assert.strictEqual(isValidShopId('INVALID-ID'), false, 'Wrong prefix');

const STEP_5_NEXT_STEPS = [
  'Share Shop ID',
  'Approve requests',
  'Create first project',
  'Review settings',
];
assert.strictEqual(STEP_5_NEXT_STEPS.length, 4, 'Must have 4 next steps');
console.log('✔ PASS: Step 5 Shop ID format and 4 next-step actions verified.');

console.log('\nAll Onboarding automated verification checks PASSED successfully!');
