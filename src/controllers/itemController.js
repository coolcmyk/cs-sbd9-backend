// src/controllers/itemController.js
const itemRepository = require('../repositories/itemRepository');
const storeRepository = require('../repositories/storeRepository');

const getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.findAll();
        res.json({
            success: true,
            message: "Items found",
            payload: items
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const getItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await itemRepository.findById(id);
        
        if (item) {
            res.json({
                success: true,
                message: "Item found",
                payload: item
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const getItemsByStoreId = async (req, res) => {
    try {
        const storeId = req.params.store_id;
        
        // Check if store exists
        const store = await storeRepository.findById(storeId);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store doesnt exist",
                payload: null
            });
        }
        
        const items = await itemRepository.findByStoreId(storeId);
        res.json({
            success: true,
            message: "Items found",
            payload: items
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

// Create item tanpa Cloudinary
// const createItem = async (req, res) => {
//     const { id, name, price, store_id, image_url, stock } = req.body;
    
//     if (!id || !name || !price || !store_id || !stock) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing required item fields",
//             payload: null
//         });
//     }

//     try {
//         // Check if store exists
//         const store = await storeRepository.findById(store_id);
//         if (!store) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Store doesnt exist",
//                 payload: null
//             });
//         }
        
//         const newItem = await itemRepository.create(id, name, price, store_id, image_url, stock);
//         res.status(201).json({
//             success: true,
//             message: "Item created",
//             payload: newItem
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message, payload: null });
//     }
// };

const { v4: uuidv4 } = require('uuid');

const createItem = async (req, res) => {
    let { id, name, price, store_id, image_url, stock } = req.body;
    
    // Generate UUID if not provided
    if (!id) {
        id = uuidv4();
    }
    
    if (!name || !price || !store_id || stock === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required item fields",
            payload: null
        });
    }

    try {
        // Check if store exists
        const store = await storeRepository.findById(store_id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store doesnt exist",
                payload: null
            });
        }
        
        const newItem = await itemRepository.create(id, name, price, store_id, image_url, stock);
        res.status(201).json({
            success: true,
            message: "Item created",
            payload: newItem
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};


const updateItem = async (req, res) => {
    const { id, name, price, store_id, image_url, stock } = req.body;
    
    if (!id || !name || !price || !store_id || !stock) {
        return res.status(400).json({
            success: false,
            message: "Missing required item fields",
            payload: null
        });
    }

    try {
        // Check if store exists
        const store = await storeRepository.findById(store_id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store doesnt exist",
                payload: null
            });
        }
        
        const updatedItem = await itemRepository.update(id, name, price, store_id, image_url, stock);
        
        if (updatedItem) {
            res.json({
                success: true,
                message: "Item updated",
                payload: updatedItem
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await itemRepository.delete(id);
        
        if (deletedItem) {
            res.json({
                success: true,
                message: "Item deleted",
                payload: deletedItem
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    getItemsByStoreId,
    createItem,
    updateItem,
    deleteItem
};