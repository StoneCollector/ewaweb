const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const fs = require('fs');
const visitFile = 'visits.json';
let visitCounts = {};
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


//Bound => visits section


// Load existing counts on startup
if (fs.existsSync(visitFile)) {
  const raw = fs.readFileSync(visitFile);
  visitCounts = JSON.parse(raw);
}

app.use((req, res, next) => {
  const path = req.path;
  visitCounts[path] = (visitCounts[path] || 0) + 1;

  // Save to file (sync or async — here's sync for simplicity)
  fs.writeFileSync(visitFile, JSON.stringify(visitCounts, null, 2));

  console.log(`📊 ${path} has been visited ${visitCounts[path]} times`);
  next();
});


app.get('/counts', (req, res) => {
  let tableRows = '';
  for (const path in visitCounts) {
    tableRows += `<tr><td>${path}</td><td>${visitCounts[path]}</td></tr>`;
  }

  res.send(`
    <html>
      <head>
        <title>Visit Counts</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 50%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>📊 Page Visit Counts</h1>
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);
});

//Bound


// Export the app for local testing
module.exports = app;

// Export for Vercel serverless
module.exports.handler = serverless(app);
