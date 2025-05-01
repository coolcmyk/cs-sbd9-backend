// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// POST /user/register
router.post('/register', userController.registerUser);

// POST /user/login
router.post('/login', userController.loginUser);

// GET /user/:email
router.get('/:email', userController.getUserByEmail);

// PUT /user
router.put('/', userController.updateUser);

// DELETE /user/:id
router.delete('/:id', userController.deleteUser);

// POST /user/topup
router.post('/topup', userController.topupUser);

module.exports = router;
