require('dotenv').config();
const db = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('Inicializando banco de dados...');
    
    await db.connect();
    await db.initTables();
    
    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log('📊 Tabelas criadas:');
    console.log('  - users (usuários)');
    console.log('  - webhook_logs (logs de webhooks)');
    console.log('  - sessions (sessões de usuário)');
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar se o script for chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
