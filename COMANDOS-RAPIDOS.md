# 🚀 COMANDOS PARA USAR O BACKEND

## Iniciar o servidor
cd backend
node server.js

## Ou em modo desenvolvimento (com auto-reload)
npm run dev

## 🧪 TESTES RÁPIDOS COM POWERSHELL

### 1. Health Check
Invoke-RestMethod -Uri "http://localhost:3000"

### 2. Status da API
Invoke-RestMethod -Uri "http://localhost:3000/api/status"

### 3. Registrar usuário
$body = '{"username": "meuusuario", "email": "meu@email.com", "password": "MinhaSenh@123"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/users/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body

### 4. Fazer login e obter token
$loginBody = '{"username": "meuusuario", "password": "MinhaSenh@123"}'
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/users/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginBody
$token = $response.token
Write-Host "Token: $token"

### 5. Listar usuários (usando o token)
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET -Headers $headers

### 6. Testar webhook
$webhookBody = '{"message": "Teste de webhook!", "data": {"evento": "teste", "timestamp": "2025-07-05T23:00:00Z"}}'
Invoke-RestMethod -Uri "http://localhost:3000/api/webhooks/test" -Method POST -Headers @{"Content-Type"="application/json"} -Body $webhookBody

### 7. Ver logs de webhooks (usando token)
Invoke-RestMethod -Uri "http://localhost:3000/api/webhooks/logs" -Method GET -Headers $headers

## 🌐 URLs para acessar no navegador
- http://localhost:3000 - Health check
- http://localhost:3000/api/status - Status da API

## 📂 ESTRUTURA DOS DADOS

### Registro de usuário
{
  "username": "nome_usuario",
  "email": "email@example.com", 
  "password": "SenhaSegura123"
}

### Login
{
  "username": "nome_usuario",
  "password": "SenhaSegura123"
}

### Webhook de teste
{
  "message": "Sua mensagem aqui",
  "data": {
    "qualquer": "dados",
    "que": "você quiser"
  }
}

### Webhook de pagamento
{
  "event_type": "payment.completed",
  "data": {
    "payment_id": "pay_123",
    "amount": 100.00,
    "currency": "BRL"
  }
}

## 🔑 AUTENTICAÇÃO
Para rotas protegidas, inclua o header:
Authorization: Bearer SEU_TOKEN_AQUI

## 📊 BANCO DE DADOS
O banco SQLite está em: ./database.sqlite
Você pode visualizar com ferramentas como DB Browser for SQLite

## 🔧 ARQUIVOS IMPORTANTES
- server.js - Servidor principal
- .env - Configurações (altere JWT_SECRET em produção!)
- README.md - Documentação completa
- exemplos-requisicoes.http - Exemplos para REST clients
