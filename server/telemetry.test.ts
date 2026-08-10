import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsBatchSchema } from '../shared/schema.js';
import { csvCell, isBot, normalizePath, normalizeReferrer, parseDevice } from './telemetry.js';

test('analytics batch accepts strict session-only events', () => {
  const result = analyticsBatchSchema.parse({ events: [{ type: 'page_view', sessionId: 'session_1234567890', path: '/' }] });
  assert.equal(result.events[0].referrer, 'Direct');
  assert.throws(() => analyticsBatchSchema.parse({ events: [{ type: 'project_click', sessionId: 'session_1234567890', path: '/' }] }));
  assert.throws(() => analyticsBatchSchema.parse({ events: Array.from({ length: 21 }, () => ({ type: 'page_view', sessionId: 'session_1234567890', path: '/' })) }));
});

test('paths and referrers are normalized without retaining private URLs', () => {
  assert.equal(normalizePath('https://example.com//projects?token=secret'), '/projects');
  assert.equal(normalizePath('/admin/analytics'), '');
  assert.equal(normalizeReferrer('https://www.google.com/search?q=private'), 'google.com');
  assert.equal(normalizeReferrer('not a url'), 'Direct');
});

test('device and bot parsing is coarse and predictable', () => {
  assert.equal(parseDevice('Mozilla/5.0 (iPhone; Mobile)'), 'Mobile');
  assert.equal(parseDevice('Mozilla/5.0 (iPad; Tablet)'), 'Tablet');
  assert.equal(parseDevice('Mozilla/5.0 (Windows NT 10.0)'), 'Desktop');
  assert.equal(isBot('Googlebot/2.1'), true);
});

test('CSV values are escaped safely', () => {
  assert.equal(csvCell('hello, "world"'), '"hello, ""world"""');
  assert.equal(csvCell(['title', 'link']), '"title|link"');
});
