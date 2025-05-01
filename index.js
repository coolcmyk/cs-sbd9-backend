const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { setupRoutes } = require('../src/routes');
const { initializeDatabase } = require('../src/database');

const app = express();
app.use(cors());
app.use(express.json());

initializeDatabase();
setupRoutes(app);

module.exports = serverless(app);
