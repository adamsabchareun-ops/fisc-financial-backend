-- 1. Create a Fake User (For local dev only - Auth usually requires real signup)
-- Note: In Supabase, linking to auth.users in seed is tricky. 
-- We will seed generic data that isn't strictly bound to a user ID if possible, 
-- or we assume the developer will create a user with a specific UUID.

-- For this MVP, we will rely on the developer creating a user via the UI first.
-- But we can seed some "System Default" categories if we had a system_config table.

-- Since all our tables require a user_id, we will provide a template 
-- that the developer can run manually in the SQL Editor after signing up.

-- EXAMPLE SEED SCRIPT (Copy/Run this in SQL Editor after signing up)
/*
INSERT INTO public.accounts (user_id, name, type, current_balance_cents)
VALUES 
  ('REPLACE_WITH_YOUR_USER_ID', 'Main Checking', 'checking', 150000), -- $1,500
  ('REPLACE_WITH_YOUR_USER_ID', 'Emergency Fund', 'savings', 500000); -- $5,000

INSERT INTO public.allocation_categories (user_id, name, is_fixed, target_amount_cents)
VALUES 
  ('REPLACE_WITH_YOUR_USER_ID', 'Rent', true, 120000), -- $1,200
  ('REPLACE_WITH_YOUR_USER_ID', 'Groceries', false, 40000), -- $400
  ('REPLACE_WITH_YOUR_USER_ID', 'Fun Money', false, 20000); -- $200

INSERT INTO public.income_sources (user_id, name, default_amount_cents)
VALUES 
  ('REPLACE_WITH_YOUR_USER_ID', 'Primary Paycheck', 250000); -- $2,500
*/
