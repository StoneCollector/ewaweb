const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL); // uses REDIS_URL


const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Visit tracking middleware
app.use(async (req, res, next) => {
  const key = `visits:${req.path}`;
  try {
    await redis.incr(key);
  } catch (err) {
    console.error('Redis error:', err);
  }
  next();
});

// Show visit counts
app.get('/counts', async (req, res) => {
  try {
    const keys = await redis.keys('visits:*');
    let rows = '';

    for (const key of keys) {
      const route = key.replace('visits:', '');
      const count = await redis.get(key);
      rows += `<tr><td>${route}</td><td>${count}</td></tr>`;
    }

    res.send(`<!DOCTYPE html>
      <html><head><title>Visit Counts</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 60%; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style></head>
      <body>
        <h1>📊 Page Visit Counts</h1>
        <table>
          <thead><tr><th>Page</th><th>Visits</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body></html>
    `);
  } catch (err) {
    console.error('Error fetching counts:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/info-hub', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/info.html'));
});

app.get('/recycling-guide', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/recycleguide.html'));
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
