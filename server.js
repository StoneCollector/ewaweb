const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL); // uses REDIS_URL
// const port = process.env.PORT || 3000;


const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

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



//Blogs
const blogPosts = [
  {
    id: 1,
    title: "The global impact of e-waste: Addressing the challenge",
    preview: "Electronic waste is a growing global problem. According to UN estimates, over 50 million tons of e-waste are generated annually, with only a small percentage being properly recycled. This article explores the environmental and social impacts.",
    date: "March 28, 2025",
    source: "Environmental Science Journal",
    image: "images/Screen Shot 2023-10-31 at 8.30.56 PM.png",
    tags: ["sustainability", "global impact", "recycling"],
    url: "https://www.ilo.org/publications/global-impact-e-waste-addressing-challenge"
  },
  {
    id: 2,
    title: "From Trash to Treasure: Exploring E-Waste Recycling Technologies in India",
    preview: "New technologies are emerging to tackle the e-waste crisis. From automated sorting systems to advanced metal recovery processes, these innovations are making recycling more efficient and economically viable.",
    date: "March 15, 2025",
    source: "Tech Sustainability",
    image: "images/1200px-Heap_metal.webp",
    tags: ["innovation", "technology", "recycling"],
    url: "https://ecoverva.com/from-trash-to-treasure-exploring-e-waste-recycling-technologies-in-india"
  },
  {
    id: 3,
    title: "Embracing a Circular Economy in Electronics: The Role of E-Waste Recycling",
    preview: "The concept of a circular economy offers solutions to the e-waste problem. By designing products for durability, repairability, and eventual recycling, manufacturers can reduce the environmental impact of electronics.",
    date: "March 5, 2025",
    source: "Circular Economy Alliance",
    image: "images/thisisengineering-raeng-32PpagSzeGs-unsplash.webp",
    tags: ["sustainability", "circular economy", "design"],
    url: "https://ecircular.com/circular-economy-in-electronics-role-e-waste-recycling"
  },
  {
    id: 4,
    title: "Predicting E-Waste Regulation Changes for 2025",
    preview: "Governments around the world are implementing stricter e-waste regulations. This article examines recent policy changes, including extended producer responsibility laws and import/export restrictions.",
    date: "February 22, 2025",
    source: "Policy Review",
    image: "images/download (1).jpeg",
    tags: ["policy", "regulation", "government"],
    url: "https://recyc.ly/blog/itad-and-e-waste-1/predicting-e-waste-regulation-changes-for-2025-157"
  },
  {
    id: 5,
    title: "E-Waste and Human Health Hazards",
    preview: "Improper handling of e-waste poses significant health risks. Toxic substances like lead, mercury, and flame retardants can cause neurological damage, respiratory problems, and other health issues when released into the environment.",
    date: "February 12, 2025",
    source: "Environmental Health Perspectives",
    image: "images/dump-full-of-old-computers-and-gadgets-picture-id172777435.jpg",
    tags: ["health", "toxics", "safety"],
    url: "https://techreset.com/itad-guides/e-waste-and-human-health-hazards"
  },
  {
    id: 6,
    title: "How To Create A Corporate E-Waste Recycling Plan?",
    preview: "Leading tech companies are implementing comprehensive e-waste management programs. This article showcases best practices in corporate sustainability, from take-back programs to eco-design initiatives.",
    date: "January 30, 2025",
    source: "Business Sustainability",
    image: "images/Untitled-design-2.webp",
    tags: ["corporate", "sustainability", "business"],
    url: "https://namoewaste.com/how-to-create-corporate-e-waste-recycling-plan"
  }
];

// API endpoint to serve blog posts
app.get('/api/blog-posts', (req, res) => {
  try {
    // Get filter and search parameters
    const filter = req.query.filter || 'all';
    const search = req.query.search || '';
    
    // Apply filters and search
    let filteredPosts = [...blogPosts];
    
    // Filter by category if not 'all'
    if (filter !== 'all') {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      );
    }
    
    // Apply search if provided
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) || 
        post.preview.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // For pagination (simplified)
    // In a real app, you would implement proper pagination here
    // This is just a basic example
    const page = parseInt(req.query.page) || 1;
    const perPage = 6; // Posts per page
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    // Slice the array for pagination
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Return the posts
    res.json({
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / perPage)
    });
  } catch (error) {
    console.error('Error processing blog posts request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blog-posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = blogPosts.find(p => p.id === postId);
  
  if (post) {
    res.json({ post });
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});
//--Blogs



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

app.get('/calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/calculator.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/blog.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/aboutus.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/quiz.html'));
});
// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);



// Start the server
// app.listen(port, () => {
//   console.log(`E-Waste Awareness website server running at http://localhost:${port}`);
// });