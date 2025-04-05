const express = require('express');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Other routes...
app.get('/info-hub', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/info.html'));
});

app.get('/recycling-guide', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/recycleguide.html'));
});

// app.get('/calculator', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/calculator.html'));
// });

// app.get('/blog', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/blog.html'));
// });

// app.get('/contact', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/contact.html'));
// });

// Export the app for local testing
module.exports = app;

// Export for Vercel serverless
module.exports.handler = serverless(app);
