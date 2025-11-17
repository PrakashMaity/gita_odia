-- Migration: Add fcm_token column to devices table
-- Run this SQL in your Supabase SQL Editor

-- Add fcm_token column to devices table
ALTER TABLE devices 
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Optional: Migrate existing expo_push_token data to fcm_token
-- Uncomment the line below if you want to copy existing tokens
-- UPDATE devices SET fcm_token = expo_push_token WHERE expo_push_token IS NOT NULL AND fcm_token IS NULL;

-- Optional: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_fcm_token ON devices(fcm_token) WHERE fcm_token IS NOT NULL;

-- Optional: Add comment to document the column
COMMENT ON COLUMN devices.fcm_token IS 'Firebase Cloud Messaging (FCM) token for push notifications';

