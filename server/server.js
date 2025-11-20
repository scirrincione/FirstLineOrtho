import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
    console.log('New request', data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  // Serve static files from /FirstLineOrtho
  app.use('/FirstLineOrtho', express.static(path.join(__dirname, 'build'), {
    setHeaders: (res, filepath) => {
      if (filepath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filepath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
  
  // SPA fallback for /FirstLineOrtho routes
  app.get('/FirstLineOrtho/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  
  // Redirect root to /FirstLineOrtho
  app.get('/', (req, res) => {
    res.redirect('/FirstLineOrtho');
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
