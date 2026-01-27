-- 1. ADD the missing columns (target_amount, current_balance)
ALTER TABLE allocation_buckets 
ADD COLUMN IF NOT EXISTS target_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_balance NUMERIC DEFAULT 0;

-- 2. INSERT the data (using your User ID)
-- Note: We map 'allocation_percentage' to your existing 'percentage' column
INSERT INTO allocation_buckets (user_id, name, target_amount, current_balance, percentage)
VALUES 
  ('59b3c302-079f-429a-9c6f-1b609914fc9f', 'Emergency Fund', 10000, 4500, 50),
  ('59b3c302-079f-429a-9c6f-1b609914fc9f', 'Japan Trip', 3000, 1200, 30),
  ('59b3c302-079f-429a-9c6f-1b609914fc9f', 'New MacBook', 2500, 0, 20);

-- 3. ENSURE a Pay Period exists
INSERT INTO pay_periods (user_id, start_date, end_date, is_current)
SELECT '59b3c302-079f-429a-9c6f-1b609914fc9f', CURRENT_DATE, CURRENT_DATE + INTERVAL '6 days', TRUE
WHERE NOT EXISTS (SELECT 1 FROM pay_periods WHERE is_current = TRUE);