const router = require('express').Router();
const { query } = require('../db');

// POST /api/products — add new product
router.post('/', async (req, res) => {
  try {
    const { shopId, name, unit, currentQty, minQtyAlert, sellPrice } = req.body;

    if (!shopId || !name) {
      return res.status(400).json({
        error: 'shopId and name are required'
      });
    }

    const result = await query(`
      INSERT INTO products
        (shop_id, name, unit, current_qty, min_qty_alert, sell_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, unit, current_qty, min_qty_alert, sell_price
    `, [
      shopId,
      name,
      unit || 'pcs',
      currentQty || 0,
      minQtyAlert || 0,
      sellPrice || null
    ]);

    res.status(201).json({
      success: true,
      product: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products?shopId=xxx — get all products
router.get('/', async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }

    const result = await query(`
      SELECT
        id, name, unit,
        current_qty, min_qty_alert, sell_price,
        CASE WHEN current_qty <= min_qty_alert
          THEN true ELSE false
        END AS is_low_stock
      FROM products
      WHERE shop_id = $1
        AND is_active = true
      ORDER BY name ASC
    `, [shopId]);

    const lowStockCount = result.rows.filter(p => p.is_low_stock).length;

    res.json({
      products: result.rows,
      total: result.rows.length,
      lowStockCount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/low-stock?shopId=xxx — get only low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }

    const result = await query(`
      SELECT id, name, unit, current_qty, min_qty_alert, sell_price
      FROM products
      WHERE shop_id = $1
        AND is_active = true
        AND current_qty <= min_qty_alert
      ORDER BY current_qty ASC
    `, [shopId]);

    res.json({
      lowStockProducts: result.rows,
      count: result.rows.length,
      message: result.rows.length > 0
        ? `${result.rows.length} items need restocking!`
        : 'All items are well stocked!'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/stock — add or remove stock
router.post('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, qty, note } = req.body;

    if (!type || !qty) {
      return res.status(400).json({
        error: 'type and qty are required'
      });
    }

    if (!['in', 'out'].includes(type)) {
      return res.status(400).json({
        error: 'type must be in or out'
      });
    }

    if (qty <= 0) {
      return res.status(400).json({
        error: 'qty must be greater than 0'
      });
    }

    // Get current stock
    const productResult = await query(
      'SELECT id, name, current_qty, min_qty_alert FROM products WHERE id = $1',
      [id]
    );

    if (!productResult.rows[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    const currentQty = parseFloat(product.current_qty);

    // Check if enough stock for 'out'
    if (type === 'out' && qty > currentQty) {
      return res.status(400).json({
        error: `Not enough stock. Current: ${currentQty}, Requested: ${qty}`
      });
    }

    // Calculate new quantity
    const newQty = type === 'in'
      ? currentQty + parseFloat(qty)
      : currentQty - parseFloat(qty);

    // Update product quantity
    await query(
      'UPDATE products SET current_qty = $1 WHERE id = $2',
      [newQty, id]
    );

    // Check if now low stock
    const isLowStock = newQty <= parseFloat(product.min_qty_alert);

    res.json({
      success: true,
      product: product.name,
      type,
      qty,
      previousQty: currentQty,
      newQty,
      isLowStock,
      alert: isLowStock
        ? `⚠️ Low stock alert! Only ${newQty} left!`
        : null
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;