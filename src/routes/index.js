// src/routes/index.js
const storeRoutes = require('./storeRoutes');
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const transactionRoutes = require('./transactionRoutes');
const setupRoutes = (app) => {
    app.use('/store', storeRoutes);
    app.use('/user', userRoutes);
    app.use('/item', itemRoutes);
    app.use('/transaction', transactionRoutes);
};

module.exports = {
    setupRoutes
};
