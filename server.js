const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main endpoint: /tg?key=1month&id=USERNAME
app.get('/tg', async (req, res) => {
  const { key, id } = req.query;

  // Validate key
  if (!key || key !== '1month') {
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing API key. Use ?key=1month'
    });
  }

  // Validate id (username)
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Username (id) is required. Use ?id=username'
    });
  }

  try {
    // Clean username: remove @ if present
    const cleanUsername = id.replace('@', '');

    // Call the external API
    const apiUrl = `https://api.igfollows.site/TG/index.php?type=user&key=OGGYxKRISH&term=${encodeURIComponent(cleanUsername)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check if API returned success
    if (data.success && data.result) {
      return res.json({
        success: true,
        phone: data.result.number,
        country: data.result.country,
        country_code: data.result.country_code,
        tg_id: data.result.tg_id,
        message: 'Details fetched successfully'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: data.message || 'User not found or invalid username'
      });
    }

  } catch (error) {
    console.error('API fetch error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch data from external API'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Telegram Phone Number API',
    endpoints: {
      '/tg': 'GET - Get phone number from Telegram username (requires key & id)',
      '/health': 'GET - Health check'
    },
    example: '/tg?key=1month&id=kd_s_r',
    note: 'Key must be "1month"'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📞 Example: http://localhost:${PORT}/tg?key=1month&id=kd_s_r`);
});
