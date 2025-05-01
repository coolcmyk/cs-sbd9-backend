// index.js (root file)
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const { setupRoutes } = require('./src/routes');
const { initializeDatabase } = require('./src/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Add this line
app.use(express.json());
initializeDatabase();
setupRoutes(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
