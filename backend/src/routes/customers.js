const router = require('express').Router();
const { query } = require('../db');

// POST /api/customers — add new customer
router.post('/', async (req, res) => {
  try {
    const { shopId, name, phone, address } = req.body;

    if (!shopId || !name) {
      return res.status(400).json({
        error: 'shopId and name are required'
      });
    }

    const result = await query(`
      INSERT INTO customers (shop_id, name, phone, address)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, phone, address, created_at
    `, [shopId, name, phone || null, address || null]);

    res.status(201).json({
      success: true,
      customer: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers?shopId=xxx — get all customers of a shop
router.get('/', async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }

    const result = await query(`
      SELECT
        c.id,
        c.name,
        c.phone,
        c.address,
        COALESCE(
          SUM(CASE WHEN t.type = 'credit'  THEN t.amount ELSE 0 END) -
          SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END),
          0
        ) AS balance
      FROM customers c
      LEFT JOIN transactions t
        ON t.customer_id = c.id
        AND t.deleted_at IS NULL
      WHERE c.shop_id = $1
        AND c.is_active = true
      GROUP BY c.id, c.name, c.phone, c.address
      ORDER BY balance DESC
    `, [shopId]);

    const totalUdhar = result.rows.reduce(
      (sum, r) => sum + parseFloat(r.balance), 0
    );

    res.json({
      customers: result.rows,
      totalUdhar: totalUdhar.toFixed(2),
      count: result.rows.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id — get one customer with balance
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get customer info + balance
    const customerResult = await query(`
      SELECT
        c.id,
        c.name,
        c.phone,
        c.address,
        COALESCE(
          SUM(CASE WHEN t.type = 'credit'  THEN t.amount ELSE 0 END) -
          SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END),
          0
        ) AS balance
      FROM customers c
      LEFT JOIN transactions t
        ON t.customer_id = c.id
        AND t.deleted_at IS NULL
      WHERE c.id = $1
        AND c.is_active = true
      GROUP BY c.id, c.name, c.phone, c.address
    `, [id]);

    if (!customerResult.rows[0]) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get transaction history
    const txResult = await query(`
      SELECT id, type, amount, note, payment_method, created_at
      FROM transactions
      WHERE customer_id = $1
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `, [id]);

    res.json({
      customer: customerResult.rows[0],
      transactions: txResult.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;