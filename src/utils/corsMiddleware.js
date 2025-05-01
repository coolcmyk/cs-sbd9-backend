const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://os.netlabdte.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

module.exports = app;
