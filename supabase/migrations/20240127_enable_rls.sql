-- Enable Row Level Security
ALTER TABLE allocation_buckets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own buckets
CREATE POLICY "Users can view own buckets" 
ON allocation_buckets 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own buckets
CREATE POLICY "Users can insert own buckets" 
ON allocation_buckets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own buckets
CREATE POLICY "Users can update own buckets" 
ON allocation_buckets 
FOR UPDATE 
USING (auth.uid() = user_id);
