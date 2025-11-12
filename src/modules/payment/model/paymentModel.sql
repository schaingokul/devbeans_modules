
-- Create table if not exists
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  -- Weight and type
  weight_value NUMERIC(12, 3) NOT NULL,         -- e.g. 1.250 (supports mg/gm/kg)
  weight_unit VARCHAR(10) CHECK (weight_unit IN ('mg', 'gm', 'kg')), -- weight type
  variant VARCHAR(50) CHECK (weight_unit IN ('gold', 'silver', 'platinum')),-- gold, silver, platinum, etc.

  -- Pricing details
  price_per_gram NUMERIC(12, 2) NOT NULL,       -- price per gram at the time of purchase
  total_amount NUMERIC(15, 2) NOT NULL,         -- final total = converted_grams * price_per_gram
  price_wt NUMERIC(12, 3),                      -- optional, store calculated converted weight (grams)

  -- Payment & status
  payment_mode VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);