import express from 'express';
import fetch from 'node-fetch';
import faq from '../data/faq.js';

const router = express.Router();
const TOKEN = process.env.TOKEN;

// Telegram API URL
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Webhook endpoint
router.post(`/webhook/${TOKEN}`, async (req, res) => {
  const { message } = req.body;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text.toLowerCase();

    console.log('Received message from chatId:', chatId, 'with text:', text);

    let replyText;
    if (faq[text]) {
      replyText = faq[text];
    } else {
      replyText =
        "Sorry, I don't understand that question. Please ask something related to logistics.";
    }

    await sendMessage(chatId, replyText);
  }

  res.sendStatus(200);
});

// Function to send message
async function sendMessage(chatId, text) {
  const url = `${TELEGRAM_API}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
    const data = await response.json();
    console.log('Sent message response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { ok: false, error };
  }
}

export default router;
