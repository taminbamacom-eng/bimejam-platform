import { Router } from 'express';
import { handleGoftinoWebhook, getWebhookLogs, startWebhookTest, getWebhookTestStatus, triggerE2ETest } from '../controllers/webhookController';

const router = Router();

// Public health endpoint for webhooks
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Goftino Webhook endpoint (public for Goftino callback)
router.post('/goftino', handleGoftinoWebhook);
router.get('/goftino', (req, res) => {
  res.json({ status: 'ok', message: 'Goftino webhook listener is active and publicly accessible.' });
});

// Webhook activity logs endpoint
router.get('/goftino/logs', getWebhookLogs);

// Webhook live connection test endpoints
router.post('/goftino/test-start', startWebhookTest);
router.get('/goftino/test-status', getWebhookTestStatus);
router.post('/goftino/test-e2e', triggerE2ETest);

export default router;

