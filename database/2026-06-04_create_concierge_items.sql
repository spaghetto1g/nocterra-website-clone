create table if not exists public.concierge_items (
  id bigserial primary key,
  title text not null,
  category text not null default 'Custom Experiences',
  description text,
  location text,
  image_url text,
  website_url text,
  phone text,
  email text,
  priority integer not null default 100,
  is_active boolean not null default true,
  villa_ids integer[] not null default '{}',
  property_types text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists concierge_items_active_priority_idx
on public.concierge_items (is_active, priority, id);

create index if not exists concierge_items_villa_ids_idx
on public.concierge_items using gin (villa_ids);

create index if not exists concierge_items_property_types_idx
on public.concierge_items using gin (property_types);

create or replace function public.set_concierge_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_concierge_items_updated_at on public.concierge_items;

create trigger set_concierge_items_updated_at
before update on public.concierge_items
for each row
execute function public.set_concierge_items_updated_at();
