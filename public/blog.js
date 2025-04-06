// Save this as blog.js in your public/js directory

document.addEventListener('DOMContentLoaded', function() {
    // Initial load of blog posts
    fetchBlogPosts('all');
    
    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
      button.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Get filter value and fetch posts
        const filter = this.getAttribute('data-filter');
        fetchBlogPosts(filter);
      });
    });
    
    // Set up search functionality
    document.getElementById('search-btn').addEventListener('click', function() {
      const searchQuery = document.getElementById('blog-search').value.trim();
      if (searchQuery) {
        fetchBlogPosts('all', searchQuery);
      } else {
        fetchBlogPosts('all');
      }
    });
    
    // Enter key for search
    document.getElementById('blog-search').addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        document.getElementById('search-btn').click();
      }
    });
    
    // Set up pagination (simplified version)
    document.querySelectorAll('.pagination .page-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        document.querySelectorAll('.pagination .page-link').forEach(l => {
          l.classList.remove('active');
        });
        this.classList.add('active');
        
        // In a real implementation, you would pass the page number to the fetch function
        // For this demo, we'll just reload the same posts
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        fetchBlogPosts(activeFilter);
      });
    });
  });
  
  // Function to fetch blog posts from the server
  function fetchBlogPosts(filter = 'all', search = '') {
    const url = `/api/blog-posts?filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        updateBlogDisplay(data.posts);
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
        document.getElementById('blog-container').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Unable to load blog posts. Please try again later.</p>';
      });
  }
  
  // Function to update the blog display with fetched posts
  function updateBlogDisplay(posts) {
    const blogContainer = document.getElementById('blog-container');
    
    if (!posts || posts.length === 0) {
      blogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No blog posts found matching your criteria.</p>';
      return;
    }
    
    const postsHTML = posts.map(post => `
      <div class="blog-card">
        <div class="blog-image">
          <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="blog-content">
          <div class="blog-meta">
            <span><i class="fas fa-calendar"></i> ${post.date}</span>
            <span><i class="fas fa-user"></i> ${post.source}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.preview}</p>
          <div class="blog-tags">
            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
          <a href="${post.url}" class="btn" target="_blank">Read Full Article</a>
        </div>
      </div>
    `).join('');
    
    blogContainer.innerHTML = postsHTML;
  }