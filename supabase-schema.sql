-- ============================================================================
--  AERION Live Telemetry - Supabase Schema
--  Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Telemetry data table
create table telemetry (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),
  temperature float,
  humidity float,
  voltage float,
  current float,
  power float,
  total_energy float,
  status text
);

-- Enable Realtime for this table
alter publication supabase_realtime add table telemetry;

-- Index for time-series queries (latest first)
create index idx_telemetry_created_at on telemetry (created_at desc);

-- Row Level Security (public dashboard - no auth required)
alter table telemetry enable row level security;
create policy "Allow public read" on telemetry for select using (true);
create policy "Allow public insert" on telemetry for insert with check (true);
