const jwt = require('jsonwebtoken');

// Middleware para verificar autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

// Middleware para log de requisições (versão melhorada)
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - Agent: ${userAgent.substring(0, 50)}...`);
  
  // Adicionar tempo de resposta
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] ${method} ${url} - Completed in ${duration}ms - Status: ${res.statusCode}`);
  });
  
  next();
};

// Middleware para validar webhook signature (exemplo)
const validateWebhookSignature = (req, res, next) => {
  // Em produção, você validaria a assinatura do webhook aqui
  // Por exemplo, verificando um header HMAC
  
  const signature = req.headers['x-webhook-signature'];
  
  // Para este exemplo, vamos apenas logar
  if (signature) {
    console.log('Webhook signature recebida:', signature);
  }
  
  // Continue sempre (em produção você faria a validação real)
  next();
};

// Middleware para parsing de webhook (raw body)
const webhookRawBody = (req, res, next) => {
  // Para webhooks, às vezes precisamos do body raw
  // Este middleware pode ser usado quando necessário
  req.rawBody = '';
  req.on('data', chunk => {
    req.rawBody += chunk;
  });
  req.on('end', () => {
    next();
  });
};

module.exports = {
  authenticateToken,
  requestLogger,
  validateWebhookSignature,
  webhookRawBody
};
