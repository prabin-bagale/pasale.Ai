const cron = require('node-cron');
const { query } = require('../db');
const { sendSMS, buildReminderMessage } = require('../utils/sms');

function startJobs() {

  // ─── Every Sunday 10:00 AM Nepal time ───────────────
  // Cron format: second minute hour day month weekday
  // 0 10 * * 0 = at 10:00 AM every Sunday
  cron.schedule('0 10 * * 0', async () => {
    console.log('\n⏰ Running Sunday SMS reminders...');

    try {
      // Get all shops
      const shopsResult = await query(`
        SELECT id, shop_name FROM shops WHERE is_active = true
      `);

      let totalSent = 0;

      for (const shop of shopsResult.rows) {
        // Get all customers with outstanding balance
        const customersResult = await query(`
          SELECT
            c.id AS customer_id,
            c.name AS customer_name,
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
          WHERE c.shop_id = $1
            AND c.is_active = true
            AND c.phone IS NOT NULL
          GROUP BY c.id, c.name, c.phone
          HAVING SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END) -
                 SUM(CASE WHEN t.type = 'payment' THEN t.amount ELSE 0 END) > 0
        `, [shop.id]);

        for (const customer of customersResult.rows) {
          const message = buildReminderMessage(
            customer.customer_name,
            shop.shop_name,
            customer.balance
          );

          const smsResult = await sendSMS(customer.phone, message);

          // Log SMS
          await query(`
            INSERT INTO sms_log (shop_id, customer_id, phone, message, status)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            shop.id,
            customer.customer_id,
            customer.phone,
            message,
            smsResult.success ? 'sent' : 'failed'
          ]);

          if (smsResult.success) totalSent++;
        }
      }

      console.log(`✅ Sunday reminders done — ${totalSent} SMS sent\n`);

    } catch (err) {
      console.error('❌ SMS reminder job failed:', err.message);
    }

  }, {
    timezone: 'Asia/Kathmandu'
  });

  console.log('⏰ Scheduler started — SMS reminders every Sunday 10am NPT');
}

module.exports = { startJobs };