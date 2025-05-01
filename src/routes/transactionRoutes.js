// src/routes/transactionRoutes.js
const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// POST /transaction/create
router.post('/create', transactionController.createTransaction);

// POST /transaction/pay
router.post('/pay/:id', transactionController.payTransaction);

//DELETE /transaction/:id
router.delete('/:id', transactionController.deleteTransactionByID);

// GET /transaction/user/:user_id 
router.get('/user/:user_id', transactionController.getTransactionsByUserId);

module.exports = router;
