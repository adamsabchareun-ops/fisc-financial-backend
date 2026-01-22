-- ALLOCATION CATEGORIES
CREATE TABLE public.allocation_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount_cents BIGINT DEFAULT 0,
  is_fixed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALLOCATIONS (Table structure only, FK to pay_periods added next)
CREATE TABLE public.allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.allocation_categories(id) ON DELETE CASCADE,
  allocated_amount_cents BIGINT DEFAULT 0,
  spent_amount_cents BIGINT DEFAULT 0,
  pay_period_id UUID NOT NULL, -- FK added in next step
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  allocation_id UUID REFERENCES public.allocations(id) ON DELETE SET NULL,
  amount_cents BIGINT NOT NULL,
  description TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
