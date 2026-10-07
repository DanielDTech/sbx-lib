import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateBookmark } from '../index.js';

test('a complete bookmark is valid', () => {
  assert.deepEqual(validateBookmark({ title: 'Docs', url: 'https://nodejs.org', tags: ['node'] }), { ok: true, errors: [] });
});

test('a blank title and a url without a scheme are both reported', () => {
  const result = validateBookmark({ title: '  ', url: 'nodejs.org' });
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 2);
});

test('tags must be short lowercase words', () => {
  assert.equal(validateBookmark({ title: 'a', url: 'http://a.b', tags: ['Bad Tag'] }).ok, false);
});

test('more than ten tags is refused', () => {
  const tags = Array.from({ length: 11 }, (_, i) => `t${i}`);
  assert.equal(validateBookmark({ title: 'a', url: 'http://a.b', tags }).ok, false);
});

test('a missing body is invalid, not an exception', () => {
  assert.equal(validateBookmark(null).ok, false);
});
