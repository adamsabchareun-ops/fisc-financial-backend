-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pay_periods ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES POLICIES (Users manage their own profile)
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. FINANCIAL DATA ISOLATION POLICIES
-- Pattern: Users can only interact with rows where user_id matches their Auth ID.

-- Accounts
CREATE POLICY "Users can isolate accounts" ON public.accounts
FOR ALL USING (auth.uid() = user_id);

-- Income Sources
CREATE POLICY "Users can isolate income sources" ON public.income_sources
FOR ALL USING (auth.uid() = user_id);

-- Income Transactions
CREATE POLICY "Users can isolate income transactions" ON public.income_transactions
FOR ALL USING (auth.uid() = user_id);

-- Allocation Categories
CREATE POLICY "Users can isolate categories" ON public.allocation_categories
FOR ALL USING (auth.uid() = user_id);

-- Allocations
CREATE POLICY "Users can isolate allocations" ON public.allocations
FOR ALL USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can isolate transactions" ON public.transactions
FOR ALL USING (auth.uid() = user_id);

-- Pay Periods
CREATE POLICY "Users can isolate pay periods" ON public.pay_periods
FOR ALL USING (auth.uid() = user_id);
