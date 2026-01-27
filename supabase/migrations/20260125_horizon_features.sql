-- 20260125_horizon_features.sql

-- 1. Pay Periods Table
-- Defines custom date ranges for a user (e.g., specific pay cycles).
create table if not exists pay_periods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  income_total numeric(12, 2) default 0.00, -- Optional: cached total income for this period
  is_closed boolean default false,
  created_at timestamptz default now()
);

-- Index for querying ranges efficiently
create index idx_pay_periods_user_dates on pay_periods(user_id, start_date, end_date);


-- 2. Allocation Buckets Table
-- Defines categories (buckets) where income should be distributed.
create table if not exists allocation_buckets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null, -- e.g., "Savings", "Rent", "Fun Money"
  percentage numeric(5, 2), -- Optional: 20.00 for 20%
  fixed_amount numeric(12, 2), -- Optional: Flat amount like $1500
  allocation_type text check (allocation_type in ('percentage', 'fixed', 'remainder')) not null default 'fixed',
  created_at timestamptz default now()
);

-- 3. Sentiment Logs Table
-- Tracks user's financial mood/sentiment.
create table if not exists sentiment_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  sentiment_score int check (sentiment_score between 1 and 10), -- 1 (Anxious) to 10 (Confident)
  sentiment_label text, -- Optional enum or string: 'Anxious', 'Confident', 'Impulsive'
  context_note text, -- "Felt good about saving", "Stressed about bills"
  linked_transaction_id uuid references public.transactions(id) on delete set null, -- Optional link to a specific purchase
  log_date date default CURRENT_DATE,
  created_at timestamptz default now()
);

-- Enable RLS
alter table pay_periods enable row level security;
alter table allocation_buckets enable row level security;
alter table sentiment_logs enable row level security;

-- Policies (Simple: Users can only see/edit their own data)
create policy "Users can view own pay periods" on pay_periods for select using (auth.uid() = user_id);
create policy "Users can insert own pay periods" on pay_periods for insert with check (auth.uid() = user_id);
create policy "Users can update own pay periods" on pay_periods for update using (auth.uid() = user_id);
create policy "Users can delete own pay periods" on pay_periods for delete using (auth.uid() = user_id);

create policy "Users can view own allocation buckets" on allocation_buckets for select using (auth.uid() = user_id);
create policy "Users can insert own allocation buckets" on allocation_buckets for insert with check (auth.uid() = user_id);
create policy "Users can update own allocation buckets" on allocation_buckets for update using (auth.uid() = user_id);
create policy "Users can delete own allocation buckets" on allocation_buckets for delete using (auth.uid() = user_id);

create policy "Users can view own sentiment logs" on sentiment_logs for select using (auth.uid() = user_id);
create policy "Users can insert own sentiment logs" on sentiment_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own sentiment logs" on sentiment_logs for update using (auth.uid() = user_id);
create policy "Users can delete own sentiment logs" on sentiment_logs for delete using (auth.uid() = user_id);
