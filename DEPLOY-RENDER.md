# 🚀 Deploy no Render.com - Guia Completo

## 📋 Pré-requisitos
- ✅ Conta no GitHub
- ✅ Conta no Render.com (já criada)
- ✅ Projeto preparado para deploy

## 🔧 **PASSO 1: Subir código para GitHub**

### 1.1 Inicializar Git (no diretório backend)
```bash
git init
git add .
git commit -m "Initial commit - Backend Node.js + Express + SQLite"
```

### 1.2 Criar repositório no GitHub
1. Acesse github.com
2. Clique em "New repository"
3. Nome: `backend-teste-nodejs`
4. Deixe público
5. NÃO adicione README (já temos)
6. Clique "Create repository"

### 1.3 Conectar e enviar código
```bash
git remote add origin https://github.com/SEU_USUARIO/backend-teste-nodejs.git
git branch -M main
git push -u origin main
```

## 🌐 **PASSO 2: Deploy no Render**

### 2.1 Criar Web Service
1. Acesse dashboard.render.com
2. Clique em "New +"
3. Selecione "Web Service"
4. Conecte sua conta GitHub
5. Selecione o repositório `backend-teste-nodejs`

### 2.2 Configurações do Deploy
```
Name: backend-teste-nodejs
Region: Oregon (US West) - mais próximo
Branch: main
Runtime: Node
Build Command: npm run build
Start Command: npm start
```

### 2.3 Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

```
JWT_SECRET=sua_chave_secreta_jwt_super_segura_para_producao_2707
NODE_ENV=production
```

### 2.4 Configurações Avançadas
```
Instance Type: Free (0.1 CPU, 512 MB RAM)
Auto-Deploy: Yes (deploy automático quando push no GitHub)
```

### 2.5 Finalizar Deploy
1. Clique em "Create Web Service"
2. Aguarde o build (3-5 minutos)
3. URL ficará disponível: `https://seu-app.onrender.com`

## 🧪 **PASSO 3: Testar API em Produção**

### 3.1 Health Check
```bash
curl https://seu-app.onrender.com
```

### 3.2 Registrar usuário
```bash
curl -X POST https://seu-app.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_producao",
    "email": "teste@producao.com",
    "password": "MinhaSenh@123"
  }'
```

### 3.3 Fazer login
```bash
curl -X POST https://seu-app.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_producao",
    "password": "MinhaSenh@123"
  }'
```

### 3.4 Testar webhook
```bash
curl -X POST https://seu-app.onrender.com/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Testando webhook em produção!",
    "timestamp": "2025-07-05T23:00:00Z"
  }'
```

## 📊 **Monitoramento**

### Dashboard do Render
- Logs em tempo real
- Métricas de CPU/RAM
- Status do deploy
- Configurações

### URLs importantes
- **API:** `https://seu-app.onrender.com`
- **Status:** `https://seu-app.onrender.com/api/status`
- **Logs:** Dashboard do Render

## 🔄 **Atualizações**

Para atualizar a API:
```bash
# Fazer mudanças no código
git add .
git commit -m "Descrição da mudança"
git push origin main
# Deploy automático no Render
```

## ⚡ **Limitações do Plano Gratuito**

### Render Free Tier:
- ✅ **750 horas/mês** (suficiente para testes)
- ✅ **SQLite funciona perfeitamente**
- ⚠️ **Sleep após 15min de inatividade** (demora ~30s para acordar)
- ✅ **SSL/HTTPS automático**
- ✅ **Domínio .onrender.com**

### Para produção real:
- **Starter Plan:** $7/mês (sem sleep, mais recursos)

## 🐛 **Solução de Problemas**

### Build falha:
```bash
# Verificar logs no dashboard
# Conferir package.json
# Verificar versão do Node.js
```

### App não inicia:
```bash
# Verificar variáveis de ambiente
# Conferir comando start
# Ver logs de erro
```

### Banco não funciona:
```bash
# SQLite deve estar no .gitignore comentado
# Verificar se init-db está no build
```

## 🎯 **Próximos Passos**

### 1. Domínio personalizado:
- Conectar seu próprio domínio
- SSL automático

### 2. Monitoramento:
- Uptime monitoring
- Alertas por email

### 3. Backup:
- Sistema de backup do SQLite
- Restore automático

## 📞 **Suporte**

- **Render Docs:** https://render.com/docs
- **Status:** https://status.render.com
- **Community:** https://community.render.com

---

🎉 **Seu backend estará rodando em produção em poucos minutos!**
