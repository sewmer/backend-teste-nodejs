const db = require('../config/database');

class WebhookController {
  // Webhook genérico que aceita qualquer payload
  async handleWebhook(req, res) {
    try {
      const endpoint = req.originalUrl;
      const method = req.method;
      const headers = JSON.stringify(req.headers);
      const body = JSON.stringify(req.body);

      // Salvar log do webhook no banco
      await db.run(
        'INSERT INTO webhook_logs (endpoint, method, headers, body) VALUES (?, ?, ?, ?)',
        [endpoint, method, headers, body]
      );

      console.log('Webhook recebido:', {
        endpoint,
        method,
        headers: req.headers,
        body: req.body
      });

      // Resposta de sucesso
      res.status(200).json({
        message: 'Webhook recebido com sucesso',
        timestamp: new Date().toISOString(),
        endpoint,
        method
      });

    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({ 
        message: 'Erro ao processar webhook',
        error: error.message 
      });
    }
  }

  // Webhook específico para exemplo (ex: pagamentos)
  async handlePaymentWebhook(req, res) {
    try {
      const { event_type, data } = req.body;

      console.log('Webhook de pagamento recebido:', {
        event_type,
        data
      });

      // Processar diferentes tipos de eventos
      switch(event_type) {
        case 'payment.completed':
          console.log('Pagamento concluído:', data);
          break;
        case 'payment.failed':
          console.log('Pagamento falhou:', data);
          break;
        case 'payment.refunded':
          console.log('Pagamento reembolsado:', data);
          break;
        default:
          console.log('Tipo de evento desconhecido:', event_type);
      }

      // Salvar no banco
      await db.run(
        'INSERT INTO webhook_logs (endpoint, method, headers, body) VALUES (?, ?, ?, ?)',
        ['/webhook/payment', req.method, JSON.stringify(req.headers), JSON.stringify(req.body)]
      );

      res.status(200).json({
        message: 'Webhook de pagamento processado',
        event_type,
        processed_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Erro ao processar webhook de pagamento:', error);
      res.status(500).json({ 
        message: 'Erro ao processar webhook de pagamento',
        error: error.message 
      });
    }
  }

  // Listar logs de webhooks (rota protegida)
  async getWebhookLogs(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const logs = await db.query(
        'SELECT * FROM webhook_logs ORDER BY timestamp DESC LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
      );

      const total = await db.query('SELECT COUNT(*) as count FROM webhook_logs');

      res.json({
        message: 'Logs de webhook encontrados',
        logs: logs.map(log => ({
          ...log,
          headers: JSON.parse(log.headers),
          body: JSON.parse(log.body)
        })),
        pagination: {
          total: total[0].count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });

    } catch (error) {
      console.error('Erro ao buscar logs de webhook:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Webhook de teste para simulações
  async testWebhook(req, res) {
    try {
      console.log('Webhook de teste acionado:', req.body);

      res.json({
        message: 'Webhook de teste recebido!',
        received_data: req.body,
        timestamp: new Date().toISOString(),
        success: true
      });

    } catch (error) {
      console.error('Erro no webhook de teste:', error);
      res.status(500).json({ 
        message: 'Erro no webhook de teste',
        error: error.message 
      });
    }
  }
}

module.exports = new WebhookController();
