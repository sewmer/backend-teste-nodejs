const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { authenticateToken, validateWebhookSignature } = require('../middleware/auth');
const { validateWebhookLogs } = require('../middleware/validation');

// Webhook genérico (aceita qualquer POST)
router.post('/generic', validateWebhookSignature, webhookController.handleWebhook);

// Webhook específico para pagamentos
router.post('/payment', validateWebhookSignature, webhookController.handlePaymentWebhook);

// Webhook de teste
router.post('/test', webhookController.testWebhook);
router.get('/test', webhookController.testWebhook); // Aceita GET também para facilitar testes

// Listar logs de webhooks (rota protegida)
router.get('/logs', authenticateToken, validateWebhookLogs, webhookController.getWebhookLogs);

module.exports = router;
