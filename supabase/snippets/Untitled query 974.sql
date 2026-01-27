-- 1. Turn on the Security System
ALTER TABLE allocation_buckets ENABLE ROW LEVEL SECURITY;

-- 2. Create the "View" Rule: Users see ONLY their own rows
CREATE POLICY "Users can view own buckets"
ON allocation_buckets FOR SELECT
USING (auth.uid() = user_id);

-- 3. Create the "Insert" Rule: Users can create rows for themselves
CREATE POLICY "Users can insert own buckets"
ON allocation_buckets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Create the "Update" Rule: Users can edit ONLY their own rows
CREATE POLICY "Users can update own buckets"
ON allocation_buckets FOR UPDATE
USING (auth.uid() = user_id);