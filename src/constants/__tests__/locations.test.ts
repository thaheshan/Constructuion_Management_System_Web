import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SRI_LANKAN_DISTRICTS,
  ALL_DISTRICTS,
  isValidSriLankanDistrict,
} from '../locations';

test('Locations: Sri Lanka has exactly 9 provinces', () => {
  assert.equal(SRI_LANKAN_DISTRICTS.length, 9);
});

test('Locations: Sri Lanka has exactly 25 official districts', () => {
  assert.equal(ALL_DISTRICTS.length, 25);

  // Check no duplicates exist
  const uniqueDistricts = new Set(ALL_DISTRICTS);
  assert.equal(uniqueDistricts.size, 25);
});

test('Locations: Western Province contains Colombo, Gampaha, and Kalutara', () => {
  const western = SRI_LANKAN_DISTRICTS.find((p) => p.province === 'Western Province');
  assert.ok(western);
  assert.deepEqual(western.districts, ['Colombo', 'Gampaha', 'Kalutara']);
});

test('Locations: isValidSriLankanDistrict correctly identifies real districts', () => {
  assert.equal(isValidSriLankanDistrict('Colombo'), true);
  assert.equal(isValidSriLankanDistrict('Kandy'), true);
  assert.equal(isValidSriLankanDistrict('Jaffna'), true);
  assert.equal(isValidSriLankanDistrict('Galle'), true);
  assert.equal(isValidSriLankanDistrict('London'), false);
  assert.equal(isValidSriLankanDistrict(''), false);
});
