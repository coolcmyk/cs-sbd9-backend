const itemRepository = require('../repositories/itemRepository');
const transactionRepository = require('../repositories/transactionRepository')
const userRepository = require('../repositories/userRepository');


const createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;

    if (!item_id || !quantity || !user_id) {
        return res.status(400).json({
            success: false,
            message: "Missing item_id, quantity, or user_id",
            payload: null
        });
    }

    if (quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be larger than 0",
            payload: null
        });
    }

    try {
        // Fetch item details to calculate total
        const item = await itemRepository.findById(item_id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }

        const total = item.price * quantity;

        // Create the transaction
        const transaction = await transactionRepository.create(user_id, item_id, quantity, total);

        res.status(201).json({
            success: true,
            message: "Transaction created",
            payload: transaction
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};


const payTransaction = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Transaction ID is required",
            payload: null
        });
    }

    try {
        // Fetch the transaction
        const transaction = await transactionRepository.findById(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                payload: null
            });
        }

        if (transaction.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Transaction is already paid",
                payload: null
            });
        }

        // Fetch user and item details
        const user = await userRepository.findByID(transaction.user_id);
        const item = await itemRepository.findById(transaction.item_id);

        if (!user || !item) {
            return res.status(404).json({
                success: false,
                message: "User or item not found",
                payload: null
            });
        }

        if (user.balance < transaction.total) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
                payload: null
            });
        }

        if (item.stock < transaction.quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
                payload: null
            });
        }

        // Deduct balance and reduce stock
        await userRepository.updateBalance(user.id, user.balance - transaction.total);
        await itemRepository.updateStock(
            item.id,
            item.stock - transaction.quantity
        );
        // Update transaction status
        const updatedTransaction = await transactionRepository.updateStatus(id, "paid");

        res.json({
            success: true,
            message: "Payment successful",
            payload: updatedTransaction
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};


const deleteTransactionByID = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Transaction ID is required",
            payload: null
        });
    }

    try {
        const deletedTransaction = await transactionRepository.deleteById(id);
        if (!deletedTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                payload: null
            });
        }

        res.json({
            success: true,
            message: "Transaction deleted successfully",
            payload: deletedTransaction
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const getTransactionsByUserId = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            payload: null
        });
    }

    try {
        // Use the repository pattern instead of direct pool access
        const transactions = await transactionRepository.findByUserId(user_id);
        
        // If you need item details, you could enhance the transactions with item data
        const enhancedTransactions = await Promise.all(transactions.map(async (transaction) => {
            const item = await itemRepository.findById(transaction.item_id);
            return {
                ...transaction,
                item_name: item.name,
                item_image_url: item.image_url
            };
        }));
        
        res.json({
            success: true,
            message: "Transactions found",
            payload: enhancedTransactions
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message, 
            payload: null 
        });
    }
};

module.exports = {
    createTransaction,
    payTransaction,
    deleteTransactionByID,
    getTransactionsByUserId
};