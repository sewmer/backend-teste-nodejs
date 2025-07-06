# 🎯 PRÓXIMOS PASSOS PARA DEPLOY NO RENDER

## ✅ **Já fizemos:**
1. ✅ Projeto preparado para deploy
2. ✅ Git inicializado e commit feito
3. ✅ Arquivos de configuração criados
4. ✅ Conta no Render.com criada

## 🚀 **AGORA VOCÊ PRECISA FAZER:**

### **1. Criar repositório no GitHub (2 minutos)**
1. Acesse: https://github.com/new
2. Nome: `backend-teste-nodejs`
3. Deixe **Público**
4. **NÃO** marque "Add README" (já temos)
5. Clique "Create repository"

### **2. Conectar seu projeto ao GitHub**
Copie e cole estes comandos no terminal (UM POR VEZ):

```bash
git remote add origin https://github.com/sewmer/backend-teste-nodejs.git
git branch -M main  
git push -u origin main
```

*Substitua SEU_USUARIO_GITHUB pelo seu username do GitHub*

### **3. Deploy no Render (3 minutos)**
1. Acesse: https://dashboard.render.com
2. Clique "New +" → "Web Service"
3. Conecte sua conta GitHub
4. Selecione o repositório `backend-teste-nodejs`
5. Configure:
   ```
   Name: backend-teste-api
   Region: Oregon (US West)
   Branch: main
   Runtime: Node
   Build Command: npm run build
   Start Command: npm start
   ```

6. **Variáveis de Ambiente** (IMPORTANTE):
   ```
   JWT_SECRET = sua_chave_jwt_super_secreta_para_producao_2707
   NODE_ENV = production
   ```

7. Clique "Create Web Service"

### **4. Aguardar Deploy (3-5 minutos)**
- Acompanhe os logs no dashboard
- URL ficará: `https://backend-teste-api.onrender.com`

### **5. Testar API em Produção**
```bash
# Health check
curl https://SEU_APP.onrender.com

# Registrar usuário
curl -X POST https://SEU_APP.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "email": "teste@email.com", "password": "Test123@"}'
```

## 🎉 **Resultado:**
- ✅ API funcionando 24/7 na nuvem
- ✅ HTTPS automático
- ✅ Deploy automático quando fizer push
- ✅ 750 horas grátis por mês

## 📞 **Se precisar de ajuda:**
- Documentação completa: `DEPLOY-RENDER.md`
- Comandos de teste: `COMANDOS-RAPIDOS.md`

---
**Tempo total estimado: 10 minutos** ⏱️
