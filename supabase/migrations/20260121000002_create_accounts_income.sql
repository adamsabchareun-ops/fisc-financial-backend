-- ENUMS
CREATE TYPE account_type AS ENUM ('checking', 'savings', 'credit_card', 'cash');

-- ACCOUNTS
CREATE TABLE public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type account_type NOT NULL,
  current_balance_cents BIGINT DEFAULT 0,
  is_liability BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INCOME SOURCES
CREATE TABLE public.income_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  default_amount_cents BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INCOME TRANSACTIONS
CREATE TABLE public.income_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.income_sources(id) ON DELETE SET NULL,
  pay_period_id UUID, -- Will add FK constraint in later migration
  amount_cents BIGINT NOT NULL,
  received_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
