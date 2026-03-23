const router = require('express').Router();
const { query } = require('../db');

// POST /api/transactions — log credit or payment
router.post('/', async (req, res) => {
  try {
    const { shopId, customerId, type, amount, note } = req.body;

    // Validate required fields
    if (!shopId || !customerId || !type || !amount) {
      return res.status(400).json({
        error: 'shopId, customerId, type and amount are required'
      });
    }

    // type must be credit or payment
    if (!['credit', 'payment'].includes(type)) {
      return res.status(400).json({
        error: 'type must be either credit or payment'
      });
    }

    // amount must be positive number
    if (amount <= 0) {
      return res.status(400).json({
        error: 'amount must be greater than 0'
      });
    }

    // Save transaction
    const result = await query(`
      INSERT INTO transactions (shop_id, customer_id, type, amount, note)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, type, amount, note, created_at
    `, [shopId, customerId, type, amount, note || null]);

    // Get updated balance
    const balanceResult = await query(`
      SELECT
        COALESCE(
          SUM(CASE WHEN type = 'credit'  THEN amount ELSE 0 END) -
          SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END),
          0
        ) AS balance
      FROM transactions
      WHERE customer_id = $1
        AND deleted_at IS NULL
    `, [customerId]);

    res.status(201).json({
      success: true,
      transaction: result.rows[0],
      newBalance: balanceResult.rows[0].balance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;