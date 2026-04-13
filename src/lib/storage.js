/**
 * localStorage-хранилище — только анонимная агрегированная аналитика.
 * Контакты перенесены в Supabase (src/lib/contactSubmit.js).
 * Никаких персональных данных здесь нет.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';

// ── Remote event ping (fire-and-forget) ────────────────────────────────────
function sendEvent(eventType, value = 1) {
  fetch(`${SUPABASE_URL}/rest/v1/game_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ game: 'larets', event_type: eventType, value }),
  }).catch(() => { /* silent — metrics are best-effort */ });
}

const KEYS = {
  game:    'qm.game.v1',
  metrics: 'qm.metrics.v1',
  admin:   'qm.admin.v1',
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

// ── Game state ─────────────────────────────────────────────────────────────
export function loadGame() {
  return safeRead(KEYS.game, { completedSymbols: [], scrollEntries: {}, currentSymbol: null });
}
export function saveGame(state) {
  safeWrite(KEYS.game, state);
}

// ── Metrics (non-PII) ──────────────────────────────────────────────────────
function defaultMetrics() {
  return { visitors: 0, users: 0, keyActions: 0, returns: 0, ratings: [], sessionStart: null };
}
export function loadMetrics() {
  return safeRead(KEYS.metrics, defaultMetrics());
}
export function saveMetrics(m) {
  safeWrite(KEYS.metrics, m);
}
const SESSION_KEY = 'larets_session';

export function trackVisit() {
  // Deduplicate within the same browser session
  if (sessionStorage.getItem(SESSION_KEY)) return;
  sessionStorage.setItem(SESSION_KEY, '1');
  const m = loadMetrics();
  m.visitors = (m.visitors || 0) + 1;
  saveMetrics(m);
  sendEvent('visit');
}
export function trackUser() {
  const m = loadMetrics();
  m.users = (m.users || 0) + 1;
  saveMetrics(m);
  sendEvent('completion');
}
export function trackKeyAction() {
  const m = loadMetrics();
  m.keyActions = (m.keyActions || 0) + 1;
  saveMetrics(m);
  sendEvent('cta');
}
export function trackReturn() {
  const m = loadMetrics();
  m.returns = (m.returns || 0) + 1;
  saveMetrics(m);
}
export function trackRating(rating) {
  const m = loadMetrics();
  m.ratings = [...(m.ratings || []), { rating, ts: Date.now() }];
  saveMetrics(m);
  sendEvent('rating', rating);
}
export function resetMetrics() {
  safeWrite(KEYS.metrics, defaultMetrics());
}
export function exportMetrics() {
  return {
    metrics: loadMetrics(),
    exportedAt: new Date().toISOString(),
    note: 'Contacts are stored in Supabase, not here.',
  };
}

// ── Admin session flag ─────────────────────────────────────────────────────
export function isAdmin() {
  return safeRead(KEYS.admin, false) === true;
}
export function setAdmin(val) {
  safeWrite(KEYS.admin, val);
}
