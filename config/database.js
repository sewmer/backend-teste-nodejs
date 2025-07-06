const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../database.sqlite');
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Conectado ao banco de dados SQLite');
          resolve();
        }
      });
    });
  }

  async initTables() {
    return new Promise((resolve, reject) => {
      // Tabela de usuários
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Tabela de logs de webhook
      const createWebhookLogsTable = `
        CREATE TABLE IF NOT EXISTS webhook_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          endpoint TEXT NOT NULL,
          method TEXT NOT NULL,
          headers TEXT,
          body TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Tabela de sessões/tokens (opcional)
      const createSessionsTable = `
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `;

      this.db.serialize(() => {
        this.db.run(createUsersTable);
        this.db.run(createWebhookLogsTable);
        this.db.run(createSessionsTable, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Tabelas criadas com sucesso');
            resolve();
          }
        });
      });
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Conexão com banco de dados fechada');
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();
