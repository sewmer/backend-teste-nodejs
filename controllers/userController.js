const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');

class UserController {
  // Registrar novo usuário
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Verificar se usuário já existe
      const existingUser = await db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ 
          message: 'Usuário já existe com este username ou email' 
        });
      }

      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Inserir usuário no banco
      const result = await db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        userId: result.id
      });

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Login do usuário
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Buscar usuário
      const users = await db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const user = users[0];

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Listar todos os usuários (rota protegida)
  async getUsers(req, res) {
    try {
      const users = await db.query(
        'SELECT id, username, email, created_at FROM users'
      );

      res.json({
        message: 'Usuários encontrados',
        users
      });

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Buscar usuário por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const users = await db.query(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({
        message: 'Usuário encontrado',
        user: users[0]
      });

    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Atualizar usuário
  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { username, email } = req.body;

      // Verificar se o usuário existe
      const existingUsers = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (existingUsers.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Atualizar usuário
      await db.run(
        'UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [username, email, id]
      );

      res.json({ message: 'Usuário atualizado com sucesso' });

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Deletar usuário
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const result = await db.run('DELETE FROM users WHERE id = ?', [id]);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({ message: 'Usuário deletado com sucesso' });

    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

module.exports = new UserController();
