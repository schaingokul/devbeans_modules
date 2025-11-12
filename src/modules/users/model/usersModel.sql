
-- Create table if not exists
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    address VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',-- 'user' or 'admin'
    is VARCHAR(50) DEFAULT 'active', -- 'active' or 'deactive'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
