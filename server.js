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



//Blogs
const blogPosts = [
  {
    id: 1,
    title: "The global impact of e-waste: Addressing the challenge",
    preview: "Electronic waste is a growing global problem. According to UN estimates, over 50 million tons of e-waste are generated annually, with only a small percentage being properly recycled. This article explores the environmental and social impacts.",
    date: "March 28, 2025",
    source: "Environmental Science Journal",
    image: "/api/placeholder/400/300",
    tags: ["sustainability", "global impact", "recycling"],
    url: "https://www.ilo.org/publications/global-impact-e-waste-addressing-challenge"
  },
  {
    id: 2,
    title: "From Trash to Treasure: Exploring E-Waste Recycling Technologies in India",
    preview: "New technologies are emerging to tackle the e-waste crisis. From automated sorting systems to advanced metal recovery processes, these innovations are making recycling more efficient and economically viable.",
    date: "March 15, 2025",
    source: "Tech Sustainability",
    image: "/api/placeholder/400/300",
    tags: ["innovation", "technology", "recycling"],
    url: "https://ecoverva.com/from-trash-to-treasure-exploring-e-waste-recycling-technologies-in-india"
  },
  {
    id: 3,
    title: "Embracing a Circular Economy in Electronics: The Role of E-Waste Recycling",
    preview: "The concept of a circular economy offers solutions to the e-waste problem. By designing products for durability, repairability, and eventual recycling, manufacturers can reduce the environmental impact of electronics.",
    date: "March 5, 2025",
    source: "Circular Economy Alliance",
    image: "/api/placeholder/400/300",
    tags: ["sustainability", "circular economy", "design"],
    url: "https://ecircular.com/circular-economy-in-electronics-role-e-waste-recycling"
  },
  {
    id: 4,
    title: "Predicting E-Waste Regulation Changes for 2025",
    preview: "Governments around the world are implementing stricter e-waste regulations. This article examines recent policy changes, including extended producer responsibility laws and import/export restrictions.",
    date: "February 22, 2025",
    source: "Policy Review",
    image: "/api/placeholder/400/300",
    tags: ["policy", "regulation", "government"],
    url: "https://recyc.ly/blog/itad-and-e-waste-1/predicting-e-waste-regulation-changes-for-2025-157"
  },
  {
    id: 5,
    title: "E-Waste and Human Health Hazards",
    preview: "Improper handling of e-waste poses significant health risks. Toxic substances like lead, mercury, and flame retardants can cause neurological damage, respiratory problems, and other health issues when released into the environment.",
    date: "February 12, 2025",
    source: "Environmental Health Perspectives",
    image: "/api/placeholder/400/300",
    tags: ["health", "toxics", "safety"],
    url: "https://techreset.com/itad-guides/e-waste-and-human-health-hazards"
  },
  {
    id: 6,
    title: "How To Create A Corporate E-Waste Recycling Plan?",
    preview: "Leading tech companies are implementing comprehensive e-waste management programs. This article showcases best practices in corporate sustainability, from take-back programs to eco-design initiatives.",
    date: "January 30, 2025",
    source: "Business Sustainability",
    image: "/api/placeholder/400/300",
    tags: ["corporate", "sustainability", "business"],
    url: "https://namoewaste.com/how-to-create-corporate-e-waste-recycling-plan"
  },
  {
    id: 7,
    title: "DIY Electronics Repair: Extending Product Life",
    preview: "The right-to-repair movement is gaining momentum. Learn how repairing your own electronics can extend product life, save money, and reduce environmental impact through this practical guide.",
    date: "January 18, 2025",
    source: "Sustainable Living Guide",
    image: "/api/placeholder/400/300",
    tags: ["DIY", "repair", "consumer tips"],
    url: "https://www.ifixit.com/Right-to-Repair/E-waste"
  },
  {
    id: 8,
    title: "Urban Mining: Recovering Precious Metals from E-Waste",
    preview: "E-waste contains valuable metals like gold, silver, and palladium. This article explores how 'urban mining' of electronic waste can be more lucrative than traditional mining while reducing environmental impact.",
    date: "January 5, 2025",
    source: "Resources Technology",
    image: "/api/placeholder/400/300",
    tags: ["urban mining", "recycling", "innovation"],
    url: "https://www.sciencedirect.com/science/article/pii/S2666789422000125"
  },
  {
    id: 9,
    title: "E-Waste in Developing Countries: Challenges and Solutions",
    preview: "Developing countries often bear the brunt of the global e-waste problem. This article examines the social and environmental challenges faced by these nations and presents innovative community-based solutions.",
    date: "December 20, 2024",
    source: "Global Development Review",
    image: "/api/placeholder/400/300",
    tags: ["developing countries", "social impact", "sustainability"],
    url: "https://www.unep.org/resources/report/global-e-waste-monitor-2020"
  },
  {
    id: 10,
    title: "The Future of Electronics: Biodegradable Components",
    preview: "Researchers are developing biodegradable electronic components that could revolutionize the industry. This article explores cutting-edge materials like cellulose-based circuits and biodegradable batteries.",
    date: "December 5, 2024",
    source: "Future Materials",
    image: "/api/placeholder/400/300",
    tags: ["innovation", "materials", "research"],
    url: "https://www.nature.com/subjects/biodegradable-electronics"
  },
  {
    id: 11,
    title: "E-Waste Education: Teaching Sustainability to the Next Generation",
    preview: "Educational programs focused on e-waste management are emerging in schools and universities. This article highlights successful initiatives and provides resources for educators.",
    date: "November 22, 2024",
    source: "Environmental Education Today",
    image: "/api/placeholder/400/300",
    tags: ["education", "youth", "sustainability"],
    url: "https://www.unesco.org/en/articles/e-waste-academy"
  },
  {
    id: 12,
    title: "The Economics of E-Waste: Market Trends and Opportunities",
    preview: "The e-waste recycling market is growing rapidly. This analysis examines current economic trends, investment opportunities, and the business case for sustainable electronics management.",
    date: "November 10, 2024",
    source: "Sustainable Business Quarterly",
    image: "/api/placeholder/400/300",
    tags: ["economics", "business", "market analysis"],
    url: "https://www.weforum.org/agenda/2019/01/how-a-circular-approach-can-turn-e-waste-into-a-golden-opportunity/"
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

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/contact.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/quiz.html'));
});
// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
