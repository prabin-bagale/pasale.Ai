const router = require('express').Router();
const { query } = require('../db');
require('dotenv').config();

// Generate 6 digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !/^9[78]\d{8}$/.test(phone)) {
      return res.status(400).json({
        error: 'Invalid phone number. Must be a valid Nepal number starting with 97 or 98.'
      });
    }

    // Generate OTP
    const code = generateOTP();

    // Save OTP to database
    await query(`
      INSERT INTO otp_codes (phone, code)
      VALUES ($1, $2)
    `, [phone, code]);

    // In development - just show OTP in response
    // In production - send via Sparrow SMS
    console.log(`OTP for ${phone}: ${code}`);

    res.json({
      success: true,
      message: `OTP sent to ${phone}`,
      // Remove this in production!
      devOtp: code
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;

    // Find valid OTP
    const result = await query(`
      SELECT id FROM otp_codes
      WHERE phone = $1
        AND code = $2
        AND used_at IS NULL
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `, [phone, code]);

    if (!result.rows[0]) {
      return res.status(400).json({
        error: 'OTP galat cha ya expire bhayo'
      });
    }

    // Mark OTP as used
    await query(`
      UPDATE otp_codes SET used_at = NOW() WHERE id = $1
    `, [result.rows[0].id]);

    // Check if shop exists
    const shopResult = await query(
      'SELECT id, owner_name, shop_name FROM shops WHERE phone = $1',
      [phone]
    );

    const isNewUser = !shopResult.rows[0];

    res.json({
      success: true,
      isNewUser,
      message: isNewUser ? 'New user - please register' : 'Login successful',
      shop: shopResult.rows[0] || null
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { phone, ownerName, shopName, city } = req.body;

    // Validate required fields
    if (!phone || !ownerName || !shopName) {
      return res.status(400).json({
        error: 'Phone, owner name and shop name are required'
      });
    }

    // Check if shop already exists
    const existing = await query(
      'SELECT id FROM shops WHERE phone = $1',
      [phone]
    );

    if (existing.rows[0]) {
      return res.status(400).json({
        error: 'Shop already exists with this phone number'
      });
    }

    // Create the shop
    const result = await query(`
      INSERT INTO shops (owner_name, shop_name, phone, city)
      VALUES ($1, $2, $3, $4)
      RETURNING id, owner_name, shop_name, phone, city, plan, trial_ends_at
    `, [ownerName, shopName, phone, city || null]);

    const shop = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Shop registered successfully!',
      shop: {
        id: shop.id,
        ownerName: shop.owner_name,
        shopName: shop.shop_name,
        phone: shop.phone,
        city: shop.city,
        plan: shop.plan,
        trialEndsAt: shop.trial_ends_at
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;