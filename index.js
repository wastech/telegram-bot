import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import webhookRoutes from './routes/webhook.js';
import setWebhook from './utils/setWebhook.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', webhookRoutes);

// Set the webhook
setWebhook();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
