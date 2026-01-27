-- 1. Add the missing "is_current" column
ALTER TABLE pay_periods 
ADD COLUMN is_current BOOLEAN DEFAULT FALSE;

-- 2. Force the most recent week to be the "Active" one
UPDATE pay_periods 
SET is_current = TRUE 
WHERE id = (
  SELECT id FROM pay_periods 
  ORDER BY start_date DESC 
  LIMIT 1
);