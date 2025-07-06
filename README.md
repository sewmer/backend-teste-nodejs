# Backend de Teste - Node.js + Express

Backend simples para testes com gerenciamento de usuários, banco de dados SQLite e suporte a webhooks.

## 🚀 Funcionalidades

- ✅ **Gerenciamento de Usuários**: Registro, login, CRUD completo
- ✅ **Autenticação JWT**: Tokens seguros para rotas protegidas  
- ✅ **Banco de Dados**: SQLite com tabelas para usuários, logs e sessões
- ✅ **Webhooks**: Endpoints para receber webhooks genéricos e específicos
- ✅ **Logs**: Sistema de logs para todas as requisições e webhooks
- ✅ **Validação**: Validação robusta de dados de entrada
- ✅ **Segurança**: Helmet, CORS, Rate Limiting
- ✅ **Middlewares**: Autenticação, logging, validação

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🛠️ Instalação e Configuração

1. **Instalar dependências:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - O arquivo `.env` já está criado com valores padrão
   - **IMPORTANTE**: Altere o `JWT_SECRET` em produção!

3. **Inicializar o banco de dados:**
   ```bash
   npm run init-db
   ```

4. **Iniciar o servidor:**
   ```bash
   # Modo desenvolvimento (com nodemon)
   npm run dev
   
   # Modo produção
   npm start
   ```

## 🌐 Endpoints da API

### Status da API
- `GET /` - Health check do servidor
- `GET /api/status` - Status detalhado da API

### Usuários
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Fazer login
- `GET /api/users` - Listar usuários (🔒 requer autenticação)
- `GET /api/users/:id` - Buscar usuário por ID (🔒 requer autenticação)
- `PUT /api/users/:id` - Atualizar usuário (🔒 requer autenticação)
- `DELETE /api/users/:id` - Deletar usuário (🔒 requer autenticação)

### Webhooks
- `POST /api/webhooks/test` - Webhook de teste
- `GET /api/webhooks/test` - Webhook de teste (GET)
- `POST /api/webhooks/generic` - Webhook genérico
- `POST /api/webhooks/payment` - Webhook específico para pagamentos
- `GET /api/webhooks/logs` - Ver logs de webhooks (🔒 requer autenticação)

## 🧪 Exemplos de Uso

### 1. Registrar um usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "Test123"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123"
  }'
```

### 3. Listar usuários (com token)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Testar webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello webhook!",
    "timestamp": "2025-01-01T00:00:00Z"
  }'
```

### 5. Webhook de pagamento
```bash
curl -X POST http://localhost:3000/api/webhooks/payment \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "payment.completed",
    "data": {
      "payment_id": "pay_123",
      "amount": 100.00,
      "currency": "BRL"
    }
  }'
```

## 🔒 Autenticação

Para acessar rotas protegidas, você precisa:

1. Fazer login e obter o token JWT
2. Incluir o token no header `Authorization: Bearer TOKEN`

Exemplo de header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   └── database.js          # Configuração do banco SQLite
├── controllers/
│   ├── userController.js    # Lógica de usuários
│   └── webhookController.js # Lógica de webhooks
├── middleware/
│   ├── auth.js             # Middlewares de autenticação
│   └── validation.js       # Validações de entrada
├── routes/
│   ├── users.js            # Rotas de usuários
│   └── webhooks.js         # Rotas de webhooks
├── scripts/
│   └── initDb.js           # Script de inicialização do DB
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências e scripts
├── server.js               # Arquivo principal do servidor
└── README.md               # Esta documentação
```

## 🗄️ Banco de Dados

O projeto usa SQLite com as seguintes tabelas:

### `users`
- `id` - ID único (auto increment)
- `username` - Nome de usuário (único)
- `email` - Email (único)
- `password` - Senha hash
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### `webhook_logs`
- `id` - ID único (auto increment)
- `endpoint` - Endpoint chamado
- `method` - Método HTTP
- `headers` - Headers da requisição (JSON)
- `body` - Body da requisição (JSON)
- `timestamp` - Timestamp da requisição

### `sessions`
- `id` - ID único (auto increment)
- `user_id` - ID do usuário
- `token` - Token da sessão
- `expires_at` - Data de expiração
- `created_at` - Data de criação

## 🛡️ Segurança

- **JWT**: Tokens seguros com expiração
- **Bcrypt**: Hash das senhas com salt
- **Helmet**: Headers de segurança
- **CORS**: Configurado para origens permitidas
- **Rate Limiting**: Limitação de requisições por IP
- **Validação**: Sanitização e validação de entrada

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (nodemon)
- `npm run init-db` - Inicializa o banco de dados

## 📝 Logs

O servidor registra automaticamente:
- Todas as requisições HTTP
- Todos os webhooks recebidos
- Erros do sistema
- Operações do banco de dados

## 🐛 Solução de Problemas

### Erro "Cannot find module"
```bash
npm install
```

### Erro de banco de dados
```bash
npm run init-db
```

### Porta já em uso
Altere a porta no arquivo `.env`:
```
PORT=3001
```

## 🎯 Próximos Passos

Para usar em produção, considere:

1. **Banco de dados**: Migrar para PostgreSQL ou MySQL
2. **Cache**: Implementar Redis para sessões
3. **Logs**: Usar Winston ou similar
4. **Monitoramento**: Implementar health checks avançados
5. **Testes**: Adicionar testes unitários e de integração
6. **Docker**: Containerizar a aplicação
7. **CI/CD**: Configurar pipeline de deploy

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Verifique os logs no terminal
2. Confirme se todas as dependências estão instaladas
3. Verifique se o banco foi inicializado corretamente
