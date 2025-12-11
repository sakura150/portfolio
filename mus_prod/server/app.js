const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 5000;


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'auth',
  password: 'pol987vc',
  port: 5432,
});


app.use(cors({
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/auth', require('./routes/auth'));


app.get('/api/random-tracks', async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        track_len, 
        link, 
        artists,
        CASE WHEN RANDOM() < 0.5 THEN 'listened' ELSE 'recommended' END as category
      FROM tracks
      ORDER BY RANDOM()
      LIMIT 8
    `);

    const tracks = {
      listened: result.rows.filter(track => track.category === 'listened'),
      recommended: result.rows.filter(track => track.category === 'recommended')
    };

    res.json(tracks);
  } catch (err) {
    console.error('Error fetching random tracks:', err);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});


app.post('/api/tracks', async (req, res) => {
  try {
    const { name, track_len, link, artists } = req.body;
    
    const result = await pool.query(
      `INSERT INTO tracks (name, track_len, link, artists) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, track_len, link, artists]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding track:', err);
    res.status(500).json({ error: 'Failed to add track' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


(async () => {
  try {
    
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
    

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS enabled for: http://localhost:5000`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
})();