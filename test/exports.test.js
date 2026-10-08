import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as sbxLib from '../index.js';

test('the package root exports exactly the shared validation and formatting contract', () => {
  assert.deepEqual(Object.keys(sbxLib).sort(), ['formatDate', 'formatTags', 'slugify', 'validateBookmark']);
});
