-- 1. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'first_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. AUTOMATIC BALANCE UPDATES
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle Insert
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.accounts
    SET current_balance_cents = current_balance_cents + NEW.amount_cents
    WHERE id = NEW.account_id;
  
  -- Handle Delete
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.accounts
    SET current_balance_cents = current_balance_cents - OLD.amount_cents
    WHERE id = OLD.account_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_balance ON public.transactions;
CREATE TRIGGER trigger_update_balance
AFTER INSERT OR DELETE ON public.transactions
FOR EACH ROW EXECUTE PROCEDURE update_account_balance();

-- 3. TIMESTAMP UPDATER (FIXED)
-- Enable the extension in the 'extensions' schema
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

DROP TRIGGER IF EXISTS handle_updated_at ON public.accounts;
CREATE TRIGGER handle_updated_at 
BEFORE UPDATE ON public.accounts 
FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime(updated_at);

-- 4. DASHBOARD VIEW
CREATE OR REPLACE VIEW view_pay_period_summary AS
SELECT 
  pp.id AS pay_period_id,
  pp.user_id,
  pp.start_date,
  pp.end_date,
  pp.is_closed,
  COALESCE((SELECT SUM(amount_cents) FROM income_transactions it WHERE it.pay_period_id = pp.id), 0) AS total_income,
  COALESCE((SELECT SUM(allocated_amount_cents) FROM allocations a WHERE a.pay_period_id = pp.id), 0) AS total_allocated,
  COALESCE((SELECT SUM(spent_amount_cents) FROM allocations a WHERE a.pay_period_id = pp.id), 0) AS total_spent
FROM public.pay_periods pp;
