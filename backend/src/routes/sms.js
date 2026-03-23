const router = require('express').Router();
const { query } = require('../db');
const { sendSMS, buildReminderMessage } = require('../utils/sms');

// POST /api/sms/send-reminder — manually send reminder to one customer
router.post('/send-reminder', async (req, res) => {
  try {
    const { customerId, shopId } = req.body;

    if (!customerId || !shopId) {
      return res.status(400).json({
        error: 'customerId and shopId are required'
      });
    }

    // Get customer + balance + shop name
    const result = await query(`
      SELECT
        c.name AS customer_name,
        c.phone,
        s.shop_name,
        COALESCE(
          SUM(CASE WHEN t.type = 'credit'  THEN t.amount ELSE 0 END) -
          SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END),
          0
        ) AS balance
      FROM customers c
      JOIN shops s ON s.id = c.shop_id
      LEFT JOIN transactions t
        ON t.customer_id = c.id
        AND t.deleted_at IS NULL
      WHERE c.id = $1
        AND c.shop_id = $2
        AND c.is_active = true
      GROUP BY c.name, c.phone, s.shop_name
    `, [customerId, shopId]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const { customer_name, phone, shop_name, balance } = result.rows[0];

    // Check if customer has any udhar
    if (parseFloat(balance) <= 0) {
      return res.status(400).json({
        error: 'Customer has no outstanding udhar',
        balance: balance
      });
    }

    // Check if phone number exists
    if (!phone) {
      return res.status(400).json({
        error: 'Customer has no phone number'
      });
    }

    // Build and send SMS
    const message = buildReminderMessage(customer_name, shop_name, balance);
    const smsResult = await sendSMS(phone, message);

    // Log SMS to database
    await query(`
      INSERT INTO sms_log (shop_id, customer_id, phone, message, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      shopId,
      customerId,
      phone,
      message,
      smsResult.success ? 'sent' : 'failed'
    ]);

    res.json({
      success: true,
      message: `Reminder sent to ${customer_name}`,
      sms: message,
      balance: balance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sms/send-all-reminders — send to all customers with udhar
router.post('/send-all-reminders', async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }

    // Get all customers with outstanding balance
    const result = await query(`
      SELECT
        c.id AS customer_id,
        c.name AS customer_name,
        c.phone,
        s.shop_name,
        COALESCE(
          SUM(CASE WHEN t.type = 'credit'  THEN t.amount ELSE 0 END) -
          SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END),
          0
        ) AS balance
      FROM customers c
      JOIN shops s ON s.id = c.shop_id
      LEFT JOIN transactions t
        ON t.customer_id = c.id
        AND t.deleted_at IS NULL
      WHERE c.shop_id = $1
        AND c.is_active = true
        AND c.phone IS NOT NULL
      GROUP BY c.id, c.name, c.phone, s.shop_name
      HAVING SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END) -
             SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END) > 0
    `, [shopId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'No customers with outstanding udhar',
        sent: 0
      });
    }

    // Send SMS to each customer
    let sentCount = 0;
    let failedCount = 0;

    for (const customer of result.rows) {
      const message = buildReminderMessage(
        customer.customer_name,
        customer.shop_name,
        customer.balance
      );

      const smsResult = await sendSMS(customer.phone, message);

      // Log each SMS
      await query(`
        INSERT INTO sms_log (shop_id, customer_id, phone, message, status)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        shopId,
        customer.customer_id,
        customer.phone,
        message,
        smsResult.success ? 'sent' : 'failed'
      ]);

      if (smsResult.success) sentCount++;
      else failedCount++;
    }

    res.json({
      success: true,
      message: `Reminders sent!`,
      sent: sentCount,
      failed: failedCount,
      total: result.rows.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;