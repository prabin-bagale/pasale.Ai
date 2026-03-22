const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Creating tables...\n');

    // SHOPS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_name       VARCHAR(100) NOT NULL,
        shop_name        VARCHAR(150) NOT NULL,
        phone            VARCHAR(15) NOT NULL UNIQUE,
        city             VARCHAR(50),
        plan             VARCHAR(20) NOT NULL DEFAULT 'free',
        trial_ends_at    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
        language         VARCHAR(5) NOT NULL DEFAULT 'ne',
        is_active        BOOLEAN NOT NULL DEFAULT true,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Table created: shops');

    // CUSTOMERS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        name        VARCHAR(100) NOT NULL,
        phone       VARCHAR(15),
        address     TEXT,
        notes       TEXT,
        is_active   BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_customers_shop ON customers(shop_id);
    `);
    console.log('✅ Table created: customers');

    // TRANSACTIONS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id         UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        type            VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'payment')),
        amount          NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
        note            TEXT,
        payment_method  VARCHAR(20),
        deleted_at      TIMESTAMPTZ,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_shop_customer
        ON transactions(shop_id, customer_id)
        WHERE deleted_at IS NULL;
    `);
    console.log('✅ Table created: transactions');

    // OTP table (for phone login)
    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone       VARCHAR(15) NOT NULL,
        code        VARCHAR(6) NOT NULL,
        expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
        used_at     TIMESTAMPTZ,
        attempts    INT NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Table created: otp_codes');

    // PRODUCTS table (inventory)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id         UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        name            VARCHAR(150) NOT NULL,
        unit            VARCHAR(20) NOT NULL DEFAULT 'pcs',
        current_qty     NUMERIC(10, 2) NOT NULL DEFAULT 0,
        min_qty_alert   NUMERIC(10, 2) NOT NULL DEFAULT 0,
        sell_price      NUMERIC(10, 2),
        is_active       BOOLEAN NOT NULL DEFAULT true,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id);
    `);
    console.log('✅ Table created: products');

    // SMS LOG table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sms_log (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        customer_id   UUID REFERENCES customers(id),
        phone         VARCHAR(15) NOT NULL,
        message       TEXT NOT NULL,
        status        VARCHAR(20) NOT NULL DEFAULT 'pending',
        sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Table created: sms_log');

    // CUSTOMER BALANCES view
    await client.query(`
      CREATE OR REPLACE VIEW customer_balances AS
      SELECT
        c.id            AS customer_id,
        c.shop_id,
        c.name,
        c.phone,
        COALESCE(
          SUM(CASE WHEN t.type = 'credit'  THEN t.amount ELSE 0 END) -
          SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END),
          0
        ) AS balance
      FROM customers c
      LEFT JOIN transactions t
        ON t.customer_id = c.id
        AND t.deleted_at IS NULL
      WHERE c.is_active = true
      GROUP BY c.id, c.shop_id, c.name, c.phone;
    `);
    console.log('✅ View created: customer_balances');

    console.log('\n🎉 All tables created successfully!');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();