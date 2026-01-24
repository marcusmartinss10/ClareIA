
-- Migration: Implement Plans and Subscriptions
-- Created at: 2026-01-24

-- Update plans table
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS price_monthly NUMERIC,
ADD COLUMN IF NOT EXISTS price_yearly NUMERIC,
ADD COLUMN IF NOT EXISTS max_dentists INTEGER,
ADD COLUMN IF NOT EXISTS max_clinics INTEGER;

-- Relax specific constraints if necessary (handled in execution)
-- ALTER TABLE plans ALTER COLUMN price DROP NOT NULL;
-- ALTER TABLE plans ALTER COLUMN max_users DROP NOT NULL;

-- Update subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS cycle TEXT CHECK (cycle IN ('monthly', 'yearly')) DEFAULT 'monthly';

-- Create addons_usage table
CREATE TABLE IF NOT EXISTS addons_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  quantity_used INTEGER DEFAULT 0,
  cycle_start DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Note: Data seeding was performed directly via MCP tool.
