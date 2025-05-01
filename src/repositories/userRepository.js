// src/repositories/userRepository.js
const { getPool } = require('../database');

const findByEmail = async (email) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

const findByEmailAndPassword = async (email, password) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    return result.rows[0] || null;
};

const create = async (email, password, name) => {
    const pool = getPool();
    const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
        [email, password, name]
    );
    return result.rows[0];
};

const update = async (id, email, password, name) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE users SET email = $2, password = $3, name = $4 WHERE id = $1 RETURNING *',
        [id, email, password, name]
    );
    return result.rows[0] || null;
};

const deleteUser = async (id) => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};

const findByID = async (id) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
};

const updateBalance = async (id, balance) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE users SET balance = $2 WHERE id = $1 RETURNING *',
        [id, balance]
    );
    return result.rows[0] || null;
};


module.exports = {
    findByEmail,
    findByID,
    findByEmailAndPassword,
    create,
    update,
    delete: deleteUser,
    updateBalance
};
