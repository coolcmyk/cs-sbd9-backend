const { getPool } = require('../database');

const create = async (user_id, item_id, quantity, total) => {
    const pool = getPool();
    const result = await pool.query(
        'INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, item_id, quantity, total, 'pending']
    );
    return result.rows[0];
};

const findById = async (id) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0] || null;
};

const updateStatus = async (id, status) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE transactions SET status = $2 WHERE id = $1 RETURNING *',
        [id, status]
    );
    return result.rows[0];
};

const deleteById = async (id) => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};

/**
 * Find all transactions by user ID
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} - Array of transactions
 */
const findByUserId = async (userId) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT t.*, i.name as item_name, i.image_url as item_image_url 
             FROM transactions t
             JOIN items i ON t.item_id = i.id
             WHERE t.user_id = $1
             ORDER BY t.created_at DESC`,
            [userId]
        );
        return result.rows;
    } finally {
        client.release();
    }
};

module.exports = {
    create,
    findById,
    updateStatus,
    deleteById,
    findByUserId
};