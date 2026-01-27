-- Disable Row Level Security so the dashboard can read the data without logging in
ALTER TABLE pay_periods DISABLE ROW LEVEL SECURITY;
ALTER TABLE allocation_buckets DISABLE ROW LEVEL SECURITY;