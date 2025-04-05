const express = require('express');
const { kv } = require('@vercel/kv');
const path = require('path');
const serverless = require('serverless-http');
const app = express();


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Count visits for each route
app.use(async (req, res, next) => {
  const key = `visits:${req.path}`;
  await kv.incr(key); // increment visit count
  next();
});

// HTML page to show counts
app.get('/counts', async (req, res) => {
  const keys = await kv.keys('visits:*');

  let tableRows = '';
  for (const key of keys) {
    const path = key.replace('visits:', '');
    const count = await kv.get(key);
    tableRows += `<tr><td>${path}</td><td>${count}</td></tr>`;
  }

  res.send(`
    <html>
      <head>
        <title>Visit Counts</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 60%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>📊 Page Visit Counts</h1>
        <table>
          <thead><tr><th>Page</th><th>Visits</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `);
});


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
