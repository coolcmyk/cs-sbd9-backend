// src/routes/itemRoutes.js
const express = require('express');
const itemController = require('../controllers/itemController');
const upload = require('../utils/uploadMiddleware');


const router = express.Router();

// GET /item
router.get('/', itemController.getAllItems);

// GET /item/byId/:id
router.get('/byId/:id', itemController.getItemById);

// GET /item/byStoreId/:store_id
router.get('/byStoreId/:store_id', itemController.getItemsByStoreId);

// POST /item/create
// router.post('/create', itemController.createItem); ini versi tanpa uploader
router.post('/create', upload.single('image'), itemController.createItem); //dengan uploader

// PUT /item
router.put('/', itemController.updateItem);

// DELETE /item/:id
router.delete('/:id', itemController.deleteItem);

module.exports = router;