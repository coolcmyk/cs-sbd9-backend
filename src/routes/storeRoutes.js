// src/routes/storeRoutes.js
const express = require('express');
const storeController = require('../controllers/storeController');

const router = express.Router();

// GET /store/getAll
router.get('/getAll', storeController.getAllStores);

// GET /store/:id
router.get('/:id', storeController.getStoreById);

// POST /store/create
router.post('/create', storeController.createStore);

// PUT /store
router.put('/', storeController.updateStore);

// DELETE /store/:id
router.delete('/:id', storeController.deleteStore);

module.exports = router;
