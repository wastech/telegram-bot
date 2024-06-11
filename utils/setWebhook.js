import fetch from 'node-fetch';
import 'dotenv/config';

const TOKEN = process.env.TOKEN;
const webhookUrl = `${process.env.WEBHOOK_URL}/${TOKEN}`;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

const setWebhook = async () => {
  try {
    const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });
    const data = await response.json();
    console.log('Webhook set response:', data);
  } catch (error) {
    console.error('Failed to set webhook:', error);
  }
};

export default setWebhook;
