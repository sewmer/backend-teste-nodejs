const { body, param, query } = require('express-validator');

// Validações para usuário
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username deve ter entre 3 e 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username deve conter apenas letras, números e underscore'),
  
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

const validateUserLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username ou email é obrigatório'),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

const validateUserUpdate = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID do usuário deve ser um número inteiro positivo'),
  
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username deve ter entre 3 e 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username deve conter apenas letras, números e underscore'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
];

const validateUserId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID do usuário deve ser um número inteiro positivo')
];

// Validações para webhooks
const validateWebhookLogs = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit deve ser um número entre 1 e 100'),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset deve ser um número não negativo')
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateUserId,
  validateWebhookLogs
};
