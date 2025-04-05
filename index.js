const express = require('express');
const path = require('path');
const { join } = require('path');
const serverless = require('serverless-http');

const app = express();

// Serve static files from the public directory
app.use(express.static(join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../views/index.html'));
});

app.get('/info-hub', (req, res) => {
  res.sendFile(join(__dirname, '../views/info.html'));
});

app.get('/recycling-guide', (req, res) => {
  res.sendFile(join(__dirname, '../views/recycleguide.html'));
});

app.get('/calculator', (req, res) => {
  res.sendFile(join(__dirname, '../public/calculator.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(join(__dirname, '../public/blog.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(join(__dirname, '../public/contact.html'));
});

module.exports = app;
module.exports.handler = serverless(app);
