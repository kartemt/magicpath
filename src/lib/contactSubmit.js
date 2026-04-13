/**
 * Отправляет контакт в Supabase таблицу larets_contacts.
 * Anon-ключ публичный — RLS разрешает только INSERT, SELECT заблокирован.
 * Никакие контакты не попадают в localStorage.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';

function sendCta() {
  fetch(`${SUPABASE_URL}/rest/v1/game_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ game: 'larets', event_type: 'cta', value: 1 }),
  }).catch(() => {});
}

/** @returns {'ok' | 'empty' | 'error'} */
export async function submitContact(raw) {
  const value = String(raw || '').replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim().slice(0, 200);
  if (!value) return 'empty';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/larets_contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ value }),
    });
    if (res.ok) { sendCta(); return 'ok'; }
    return 'error';
  } catch {
    return 'error';
  }
}
