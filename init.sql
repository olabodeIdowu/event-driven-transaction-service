CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(64) PRIMARY KEY,
  merchant_id VARCHAR(64) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  type ENUM('payment', 'refund', 'payout') NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'completed',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_merchant_created (merchant_id, created_at),
  INDEX idx_status (status)
);