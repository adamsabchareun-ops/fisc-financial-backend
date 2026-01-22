-- PAY PERIODS
CREATE TABLE public.pay_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- ADD MISSING FOREIGN KEYS (Circular dependencies resolution)
ALTER TABLE public.allocations
ADD CONSTRAINT fk_allocations_pay_period
FOREIGN KEY (pay_period_id) REFERENCES public.pay_periods(id) ON DELETE CASCADE;

ALTER TABLE public.allocations
ADD CONSTRAINT unique_allocation_per_period
UNIQUE (pay_period_id, category_id);

ALTER TABLE public.income_transactions
ADD CONSTRAINT fk_income_pay_period
FOREIGN KEY (pay_period_id) REFERENCES public.pay_periods(id) ON DELETE SET NULL;

-- INDEXES
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_allocations_pay_period ON public.allocations(pay_period_id);
CREATE INDEX idx_pay_periods_dates ON public.pay_periods(user_id, start_date);
