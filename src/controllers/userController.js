// src/controllers/userController.js
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    const { email, password, name } = req.query;
    
    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: "Missing email, password, or name",
            payload: null
        });
    }

    try {
        //regex email dan password di register
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
                payload: null
            });
        }
        const passRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Invalid password format",
                payload: null
            });
        }
            // (?=.*\d): Minimal 1 angka.   
            // (?=.*[\W_]): Minimal 1 karakter spesial (simbol atau underscore).
            // .{8,}: Panjang minimal 8 karakter.

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already used",
                payload: null
            });
        }
        const newUser = await userRepository.create(email, hashedPassword, name);
        res.status(201).json({
            success: true,
            message: "User registered",
            payload: newUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing email or password",
            payload: null
        });
    }
    try {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                payload: null
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                payload: null
            });
        }
        res.json({
            success: true,
            message: "Login success",
            payload: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const updateUser = async (req, res) => {
    const { id, email, password, name } = req.body;
    
    if (!id || !email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: "Missing user id, email, password, or name",
            payload: null
        });
    }

    try {
        //regex email dan password di update
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
                payload: null
            });
        }
        const passRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Invalid password format",
                payload: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await userRepository.update(id, email, hashedPassword, name);
        
        if (updatedUser) {
            res.json({
                success: true,
                message: "User updated",
                payload: updatedUser
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await userRepository.delete(id);
        
        if (deletedUser) {
            res.json({
                success: true,
                message: "User deleted",
                payload: deletedUser
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userRepository.findByEmail(email);

        if (user) {
            res.json({
                success: true,
                message: "User found",
                payload: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

const topupUser = async (req, res) => {
    const { id, amount } = req.query;

    if (!id || !amount) {
        return res.status(400).json({
            success: false,
            message: "Missing user id or amount",
            payload: null
        });
    }

    const topUpAmount = parseFloat(amount);

    if (isNaN(topUpAmount) || topUpAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be larger than 0",
            payload: null
        });
    }

    try {
        const user = await userRepository.findByID(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null
            });
        }

        const updatedBalance = user.balance + topUpAmount;
        const updatedUser = await userRepository.updateBalance(id, updatedBalance);
        
        res.json({
            success: true,
            message: "Top up successful",
            payload: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, payload: null });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    topupUser
};
