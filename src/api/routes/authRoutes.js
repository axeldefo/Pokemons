const express = require('express');
const authController = require('../Controllers/authController');
const router = express.Router();

// Utiliser le contrôleur pour les routes d'authentification

/**
 * @openapi
 * 
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: user123
 *             password: password123
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request, username already exists or missing fields
 *       '500':
 *         description: Internal Server Error
 */

router.post('/register', authController.register);

/**
 * @openapi
 * 
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     description: Login user and get JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: user123
 *             password: password123
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT token
 *       '401':
 *         description: Unauthorized, invalid username or password
 *       '500':
 *         description: Internal Server Error
 */

router.post('/login', authController.login);

router.post('/refresh', authController.refresh);

module.exports = router;
