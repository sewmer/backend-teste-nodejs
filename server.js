require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/database');
const { requestLogger } = require('./middleware/auth');

// Definir variáveis padrão caso o .env não carregue
process.env.JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_super_segura_123456789';
process.env.PORT = process.env.PORT || '3000';

const app = express();
const PORT = process.env.PORT || 3000;

// Importar rotas
const userRoutes = require('./routes/users');
const webhookRoutes = require('./routes/webhooks');

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
  }
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger de requisições
app.use(requestLogger);

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    message: 'Backend de teste está funcionando!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.1.0' // Versão atualizada para teste de deploy
  });
});

// Rota de status da API
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    version: '1.1.0',
    endpoints: {
      users: '/api/users',
      webhooks: '/api/webhooks'
    },
    stats: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    }
  });
});

// Rota para backup/exportar dados (protegida)
app.get('/api/backup', async (req, res) => {
  try {
    // Verificar autenticação
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso requerido para backup' });
    }

    // Para simplificar, vamos exportar dados básicos
    const users = await db.query('SELECT id, username, email, created_at FROM users');
    const webhookLogs = await db.query('SELECT * FROM webhook_logs ORDER BY timestamp DESC LIMIT 100');
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.1.0',
      data: {
        users: users,
        webhook_logs: webhookLogs,
        total_users: users.length,
        total_webhook_logs: webhookLogs.length
      }
    };

    res.json({
      message: 'Backup gerado com sucesso',
      backup: backup
    });

  } catch (error) {
    console.error('Erro ao gerar backup:', error);
    res.status(500).json({ message: 'Erro ao gerar backup' });
  }
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, _next) => {
  console.error('Erro:', err);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await db.connect();
    await db.initTables();
    
    console.log('Base de dados inicializada com sucesso');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📋 Acesse: http://localhost:${PORT}`);
      console.log(`📊 Status da API: http://localhost:${PORT}/api/status`);
      console.log(`👥 Endpoints de usuários: http://localhost:${PORT}/api/users`);
      console.log(`🔗 Endpoints de webhooks: http://localhost:${PORT}/api/webhooks`);
      console.log('\n📝 Exemplos de uso:');
      console.log('• POST /api/users/register - Registrar usuário');
      console.log('• POST /api/users/login - Fazer login');
      console.log('• GET /api/users - Listar usuários (requer token)');
      console.log('• POST /api/webhooks/test - Testar webhook');
      console.log('• POST /api/webhooks/generic - Webhook genérico');
      console.log('• GET /api/webhooks/logs - Ver logs de webhooks (requer token)');
      console.log('• GET /api/backup - Exportar dados (requer token)');
    });

  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de encerramento gracioso
process.on('SIGINT', async () => {
  console.log('\nEncerrando servidor...');
  await db.close();
  process.exit(0);
});

// Iniciar o servidor
startServer();

module.exports = app;
