/**
 * Supabase public config — anon key безопасно хранить в клиентском коде.
 * RLS на таблице larets_contacts разрешает anon только INSERT; SELECT заблокирован.
 * Service role key хранится только на сервере Beget (beget-dashboard/larets.php).
 */
export const SUPABASE_URL = 'https://mjrutipusamijyxsgtyx.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcnV0aXB1c2FtaWp5eHNndHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTgxOTYsImV4cCI6MjA5MTU5NDE5Nn0.giTgGyapNn5vT3nEOLjcXHvqTWozYiH4wfUPOEbSFg4';
