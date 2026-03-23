const router = require('express').Router();
const { query } = require('../db');

// GET /api/reports/summary?shopId=xxx
router.get('/summary', async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }

    // Total outstanding udhar
    const udharResult = await query(`
      SELECT
        COALESCE(
          SUM(CASE WHEN t.type = 'credit'  THEN t.amount ELSE 0 END) -
          SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END),
          0
        ) AS total_udhar,
        COUNT(DISTINCT c.id) AS total_customers,
        COUNT(DISTINCT CASE
          WHEN (
            SELECT COALESCE(
              SUM(CASE WHEN t2.type = 'credit'  THEN t2.amount ELSE 0 END) -
              SUM(CASE WHEN t2.type = 'payment' THEN t2.amount ELSE 0 END),
              0
            )
            FROM transactions t2
            WHERE t2.customer_id = c.id
              AND t2.deleted_at IS NULL
          ) > 0
          THEN c.id
        END) AS debtors_count
      FROM customers c
      LEFT JOIN transactions t
        ON t.customer_id = c.id
        AND t.deleted_at IS NULL
      WHERE c.shop_id = $1
        AND c.is_active = true
    `, [shopId]);

    // This week collections
    const weekResult = await query(`
      SELECT
        COALESCE(SUM(amount), 0) AS collected_this_week
      FROM transactions
      WHERE shop_id = $1
        AND type = 'payment'
        AND deleted_at IS NULL
        AND created_at >= NOW() - INTERVAL '7 days'
    `, [shopId]);

    // Low stock count
    const stockResult = await query(`
      SELECT COUNT(*) AS low_stock_count
      FROM products
      WHERE shop_id = $1
        AND is_active = true
        AND current_qty <= min_qty_alert
    `, [shopId]);

    // Shop info
    const shopResult = await query(`
      SELECT shop_name, owner_name FROM shops WHERE id = $1
    `, [shopId]);

    const shop = shopResult.rows[0];
    const udhar = udharResult.rows[0];
    const week = weekResult.rows[0];
    const stock = stockResult.rows[0];

    // Build WhatsApp message
    const whatsappMessage =
      `📊 *${shop.shop_name} — Hapta Report*\n\n` +
      `💰 Total udhar baaki: NPR ${parseFloat(udhar.total_udhar).toFixed(2)}\n` +
      `👥 Udhar customers: ${udhar.debtors_count}\n` +
      `✅ Is hapta aako: NPR ${parseFloat(week.collected_this_week).toFixed(2)}\n` +
      `📦 Low stock items: ${stock.low_stock_count}\n\n` +
      `Subha din hos ${shop.owner_name} ji! 🙏`;

    res.json({
      success: true,
      shop: shop.shop_name,
      summary: {
        totalUdhar: parseFloat(udhar.total_udhar).toFixed(2),
        totalCustomers: parseInt(udhar.total_customers),
        debtorsCount: parseInt(udhar.debtors_count),
        collectedThisWeek: parseFloat(week.collected_this_week).toFixed(2),
        lowStockCount: parseInt(stock.low_stock_count)
      },
      whatsappMessage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;