const twilio = require('twilio');
let client = null; // Initialize client to null

if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SID.startsWith('AC')) { // Check if client was successfully initialized
  client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendWhatsApp(to, body) {
  if (!client || !process.env.TWILIO_WHATSAPP_FROM) { // Check if client was successfully initialized
    console.log('[sendWhatsApp] Twilio not configured or number missing. Message would be:', body);
    return null;
  }
  
  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to,
      body
    });
    return msg;
  } catch (err) {
    console.error('WhatsApp send error', err.message || err);
    throw err;
  }
}

module.exports = sendWhatsApp;
