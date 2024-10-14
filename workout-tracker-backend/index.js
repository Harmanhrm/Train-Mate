const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
app.use(bodyParser.json()); 
app.use (cors());
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'workout',
  password: 'Test1234',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
});

app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/workout', async (req, res) => {
  const { userId, categoryId, typeId, details } = req.body;
  console.log('Received workout data:', req.body);
  try {
    const result = await pool.query(
      'INSERT INTO workout (user_id, category_id, type_id, details, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, categoryId, typeId, details]
    );
    console.log('Workout added:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ error: 'Failed to add workout' });
  }
});

app.get('/workout', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workout ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/users', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const { username, password } = req.body;
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    console.log('User added:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});