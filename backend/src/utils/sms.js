const axios = require('axios');
require('dotenv').config();

/**
 * Send SMS via Sparrow SMS Nepal
 * @param {string} phone - Nepal phone number (e.g. 9841234567)
 * @param {string} message - SMS text to send
 */
async function sendSMS(phone, message) {
  try {
    // In development — just log the SMS, don't actually send
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📱 SMS (DEV MODE — not actually sent)');
      console.log(`   To: ${phone}`);
      console.log(`   Message: ${message}\n`);
      return { success: true, devMode: true };
    }

    // In production — send via Sparrow SMS
    const response = await axios.post(
      'http://api.sparrowsms.com/v2/sms/',
      {
        token: process.env.SPARROW_SMS_TOKEN,
        from: process.env.SPARROW_SMS_FROM,
        to: phone,
        text: message
      }
    );

    return { success: true, response: response.data };

  } catch (err) {
    console.error('SMS sending failed:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Build udhar reminder message in Nepali
 * @param {string} customerName
 * @param {string} shopName
 * @param {number} balance
 */
function buildReminderMessage(customerName, shopName, balance) {
  return (
    `Namaste ${customerName} ji! ` +
    `${shopName} ma tapaileko ` +
    `NPR ${balance} udhar baaki chha. ` +
    `Dhanyabad! 🙏`
  );
}

module.exports = { sendSMS, buildReminderMessage };