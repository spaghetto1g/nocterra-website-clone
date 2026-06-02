NOCTERRA v29 - Special Request runtime fix

Fixed:
- Villa/property pages no longer crash from missing specialRequestForm state.
- Added missing modal open state.
- Added Special Request button only when enabled from admin.
- No public design/layout/spacing change beyond optional button/modal when enabled.

Required Supabase SQL columns:
alter table public.villas
  add column if not exists special_request_enabled boolean default false,
  add column if not exists special_request_label text default 'Special Request',
  add column if not exists special_request_email text default 'info@nocterra.gr';
