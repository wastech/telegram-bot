import express from 'express';
import fetch from 'node-fetch';
import faq from '../data/faq.js';

const router = express.Router();
const TOKEN = process.env.TOKEN;
const THREAD_ID = process.env.THREAD_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Telegram API URL
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Function to call OpenAI API
export async function callOpenAI(userText) {
  const url = 'https://api.openai.com/v1/chat/completions';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userText },
        ],
      }),
    });
    const data = await response.json();
    console.log('OpenAI API response:', data);
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    return "I'm sorry, I couldn't find an answer to your question.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm sorry, something went wrong while fetching the answer.";
  }
}

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
      replyText = "I'm sorry, I couldn't find an answer to your question."; // await callOpenAI(text);
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
