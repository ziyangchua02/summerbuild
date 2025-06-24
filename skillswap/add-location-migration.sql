-- Migration script to add location field to existing profiles table
-- Run this in Supabase SQL Editor if you already have a profiles table

-- Add location column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Singapore';

-- Update existing records to have Singapore as default location if they don't have one
UPDATE profiles 
SET location = 'Singapore' 
WHERE location IS NULL OR location = '';

-- Verify the changes
SELECT id, full_name, email, location, created_at 
FROM profiles 
LIMIT 5;
