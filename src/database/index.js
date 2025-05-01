// src/database/index.js
const { Pool } = require('pg');

let pool;

const initializeDatabase = () => {
    pool = new Pool({
        connectionString: process.env.PG_CONNECTION_STRING,
        ssl: { rejectUnauthorized: false }
    });
    
    console.log('Database connection initialized');
    return pool;
};

const getPool = () => {
    if (!pool) {
        throw new Error('Database connection not initialized');
    }
    return pool;
};

module.exports = {
    initializeDatabase,
    getPool
};
