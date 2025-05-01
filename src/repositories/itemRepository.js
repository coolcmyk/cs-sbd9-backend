// src/repositories/itemRepository.js
const { getPool } = require('../database');

const findAll = async () => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    return result.rows;
};

const findById = async (id) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0] || null;
};

const findByStoreId = async (storeId) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM items WHERE store_id = $1 ORDER BY created_at DESC', [storeId]);
    return result.rows;
};

const create = async (id, name, price, store_id, image_url, stock) => {
    const pool = getPool();
    const result = await pool.query(
        'INSERT INTO items (id, name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, name, price, store_id, image_url, stock]
    );
    return result.rows[0];
};

const update = async (id, name, price, store_id, image_url, stock) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE items SET name = $2, price = $3, store_id = $4, image_url = $5, stock = $6 WHERE id = $1 RETURNING *',
        [id, name, price, store_id, image_url, stock]
    );
    return result.rows[0] || null;
};

const deleteItem = async (id) => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};

const updateStock = async (id, newStock) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE items SET stock = $2 WHERE id = $1 RETURNING *',
        [id, newStock]
    );
    return result.rows[0] || null;
};

module.exports = {
    findAll,
    findById,
    findByStoreId,
    create,
    update,
    delete: deleteItem,
    updateStock
};