-- Enable Row Level Security
ALTER TABLE allocation_buckets ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Users can view their own buckets
CREATE POLICY "Users can view own buckets" 
ON allocation_buckets 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Policy: Users can insert their own buckets
CREATE POLICY "Users can insert own buckets" 
ON allocation_buckets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Policy: Users can update their own buckets
CREATE POLICY "Users can update own buckets" 
ON allocation_buckets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Policy: Users can delete their own buckets
CREATE POLICY "Users can delete own buckets" 
ON allocation_buckets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add color_hex column if it doesn't exist
ALTER TABLE allocation_buckets ADD COLUMN IF NOT EXISTS color_hex TEXT;
