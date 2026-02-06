-- Elite-Varejo: Script de Criação do Banco de Dados no Supabase

-- 1. Habilitar a extensão UUID
create extension if not exists "uuid-ossp";

-- 2. Tabela de Lojas (Stores)
create table stores (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  razao_social text,
  fantasia text not null,
  manager text,
  last_update timestamp with time zone default now(),
  custom_rewards jsonb default '{"Iniciante": 0, "Bronze": 0, "Prata": 0, "Ouro": 0, "Elite (Diamante)": 0}'::jsonb,
  tier_colors jsonb default '{"Iniciante": "#94a3b8", "Bronze": "#cd7f32", "Prata": "#c0c0c0", "Ouro": "#ffd700", "Elite (Diamante)": "#00ffff"}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Tabela de KPIs
create table kpis (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  description text,
  category text,
  target numeric not null,
  actual numeric not null default 0,
  unit text,
  weight numeric default 1,
  created_at timestamp with time zone default now()
);

-- 4. Habilitar RLS (Row Level Security)
alter table stores enable row level security;
alter table kpis enable row level security;

-- 5. Políticas de Acesso
create policy "Acesso público para leitura" on stores for select using (true);
create policy "Acesso público para leitura" on kpis for select using (true);
create policy "Acesso total p/ Admin" on stores for all using (true);
create policy "Acesso total p/ Admin" on kpis for all using (true);
