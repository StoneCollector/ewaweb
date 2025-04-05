const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for different pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"views" ,'index.html'));
});

app.get('/info-hub', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'info.html'));
});

app.get('/recycling-guide', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'recycleguide.html'));
});

app.get('/calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calculator.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`E-Waste Awareness website server running at http://localhost:${port}`);
});