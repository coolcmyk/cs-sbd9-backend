// src/repositories/storeRepository.js
const { getPool } = require('../database');

const findAll = async () => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM stores ORDER BY created_at DESC');
    return result.rows;
};

const findById = async (id) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    return result.rows[0] || null;
};

const create = async (id, name, address) => {
    const pool = getPool();
    const result = await pool.query(
        'INSERT INTO stores (id, name, address) VALUES ($1, $2, $3) RETURNING *',
        [id, name, address]
    );
    return result.rows[0];
};

const update = async (id, name, address) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE stores SET name = $2, address = $3 WHERE id = $1 RETURNING *',
        [id, name, address]
    );
    return result.rows[0] || null;
};

const deleteStore = async (id) => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: deleteStore
};
