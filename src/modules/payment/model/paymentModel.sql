
-- Create table if not exists
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT REFERENCES users(user_id),

  -- price per gram at the time of purchase
  total_amount NUMERIC(15, 2) NOT NULL,         -- final total = converted_grams * price_per_gram

  -- Payment & status
  payment_mode VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);