// src/controllers/storeController.js
const storeRepository = require('../repositories/storeRepository');

const getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.findAll();
        res.json({
            success: true,
            message: "Stores found",
            payload: stores
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const getStoreById = async (req, res) => {
    try {
        const id = req.params.id;
        const store = await storeRepository.findById(id);
        
        if (store) {
            res.json({
                success: true,
                message: "Store found",
                payload: store
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Store not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const createStore = async (req, res) => {
    const { id, name, address } = req.body;
    
    if (!id || !name || !address) {
        return res.status(400).json({
            success: false,
            message: "Missing store id, name, or address",
            payload: null
        });
    }

    try {
        const newStore = await storeRepository.create(id, name, address);
        res.status(201).json({
            success: true,
            message: "Store created",
            payload: newStore
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const updateStore = async (req, res) => {
    const { id, name, address } = req.body;
    
    if (!id || !name || !address) {
        return res.status(400).json({
            success: false,
            message: "Missing store id, name, or address",
            payload: null
        });
    }

    try {
        const updatedStore = await storeRepository.update(id, name, address);
        
        if (updatedStore) {
            res.json({
                success: true,
                message: "Store updated",
                payload: updatedStore
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Store not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const deleteStore = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedStore = await storeRepository.delete(id);
        
        if (deletedStore) {
            res.json({
                success: true,
                message: "Store deleted",
                payload: deletedStore
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Store not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore
};
