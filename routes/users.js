const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateUserUpdate, 
  validateUserId 
} = require('../middleware/validation');

// Rotas públicas
router.post('/register', validateUserRegistration, userController.register);
router.post('/login', validateUserLogin, userController.login);

// Rotas protegidas (requerem autenticação)
router.get('/', authenticateToken, userController.getUsers);
router.get('/:id', authenticateToken, validateUserId, userController.getUserById);
router.put('/:id', authenticateToken, validateUserUpdate, userController.updateUser);
router.delete('/:id', authenticateToken, validateUserId, userController.deleteUser);

module.exports = router;
