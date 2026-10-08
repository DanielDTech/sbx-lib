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

test('a url with a scheme that the URL parser still rejects is invalid', () => {
  assert.equal(validateBookmark({ title: 'a', url: 'http://a:99999' }).ok, false);
  assert.equal(validateBookmark({ title: 'a', url: 'http://[x' }).ok, false);
});

test('a note is optional, whether its key is absent or explicitly undefined', () => {
  const absent = validateBookmark({ title: 'a', url: 'http://a.b' });
  const explicitlyUndefined = validateBookmark({ title: 'a', url: 'http://a.b', note: undefined });
  assert.deepEqual(absent, { ok: true, errors: [] });
  assert.deepEqual(explicitlyUndefined, absent);
});

test('a note of exactly 500 characters is valid', () => {
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: 'n'.repeat(500) }), { ok: true, errors: [] });
});

test('an empty note and a whitespace-only note are valid, because optional means no minimum', () => {
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: '' }), { ok: true, errors: [] });
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: '   ' }), { ok: true, errors: [] });
});

test('a note of exactly 501 characters is too long', () => {
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: 'n'.repeat(501) }), {
    ok: false,
    errors: ['note is longer than 500 characters'],
  });
});

test('the note ceiling counts the string as given, with no trimming', () => {
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: ' '.repeat(501) }), {
    ok: false,
    errors: ['note is longer than 500 characters'],
  });
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: ' '.repeat(500) }), { ok: true, errors: [] });
});

test('a note that is not text is reported without throwing', () => {
  for (const note of [7, {}, null]) {
    assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note }), { ok: false, errors: ['note must be text'] });
  }
});

test('a blank title and an over-limit note are both reported, neither masking the other', () => {
  const result = validateBookmark({ title: '  ', url: 'http://a.b', note: 'n'.repeat(501) });
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.includes('title is required'));
  assert.ok(result.errors.includes('note is longer than 500 characters'));
});

test('the note ceiling measures code units, the same measure the title ceiling uses', () => {
  assert.deepEqual(validateBookmark({ title: 'a', url: 'http://a.b', note: '\u{1F600}'.repeat(250) }), { ok: true, errors: [] });
});
