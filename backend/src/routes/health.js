const router = require('express').Router();
const { query } = require('../db');

// GET /api/health
router.get('/', async (req, res) => {
  try {
    // Test database connection
    const result = await query('SELECT NOW() as time');
    
    res.json({
      status: 'ok',
      message: 'Pasale AI is running!',
      database: 'connected',
      time: result.rows[0].time
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database not connected',
      error: err.message
    });
  }
});

module.exports = router;