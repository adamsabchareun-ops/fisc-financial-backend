-- 1. Ensure the 'total_income' column exists
ALTER TABLE pay_periods 
ADD COLUMN IF NOT EXISTS total_income NUMERIC DEFAULT 0;

-- 2. Fill in '0' for any rows where it is currently empty/null
UPDATE pay_periods 
SET total_income = 0 
WHERE total_income IS NULL;