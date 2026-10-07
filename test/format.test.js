import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, formatDate, formatTags } from '../index.js';

test('slugify folds accents and joins words', () => {
  assert.equal(slugify('Café  Notes!'), 'cafe-notes');
});

test('formatDate keeps the day', () => {
  assert.equal(formatDate('2026-10-07T15:00:00Z'), '2026-10-07');
});

test('formatTags prefixes each tag', () => {
  assert.equal(formatTags(['a', 'b']), '#a #b');
});
