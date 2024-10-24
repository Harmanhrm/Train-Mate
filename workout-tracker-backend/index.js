const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
  const { username } = req.query;
  try {
    let query = 'SELECT * FROM users';
    let params = [];
    if (username) {
      query += ' WHERE username = $1';
      params = [username];
    }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const { username, password, email } = req.body;

    // Validate input fields
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, password, email]
    );

    // Generate a token (for simplicity, using a placeholder value)
    const token = jwt.sign({ userId: result.rows[0].id }, 'your_jwt_secret');

    console.log('User added:', result.rows[0]);
    res.json({ ...result.rows[0], token });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Endpoint to fetch user details
app.get('/user-details', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Endpoint to add a workout and its corresponding details
app.post('/workout', async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, categoryId, typeId, userId, date, cardioDetails, strengthDetails } = req.body;

    console.log('Received workout data:', { name, categoryId, typeId, userId, date, cardioDetails, strengthDetails });

    await client.query('BEGIN');

    const workoutResult = await client.query(
      'INSERT INTO workout (name, category_id, type_id, user_id, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, categoryId, typeId, userId, date]
    );

    const workoutId = workoutResult.rows[0].id;
    console.log('Inserted workout with ID:', workoutId);

    if (typeId === 2 && cardioDetails) { // Assuming typeId 2 is for cardio
      const { distance, calories, speed, time } = cardioDetails;
      console.log('Inserting cardio details:', { workoutId, distance, calories, speed, time });
      await client.query(
        'INSERT INTO cardio_workout (workout_id, distance, calories, speed, time) VALUES ($1, $2, $3, $4, $5)',
        [workoutId, distance, calories, speed, time]
      );
    } else if (typeId === 1 && strengthDetails) { // Assuming typeId 1 is for strength
      for (const set of strengthDetails) {
        const { set_number, reps, weight, rpe, hold_time } = set;
        console.log('Inserting strength set:', { workoutId, set_number, reps, weight, rpe, hold_time });
        await client.query(
          'INSERT INTO strength_workout (workout_id, set_number, reps, weight, rpe, hold_time) VALUES ($1, $2, $3, $4, $5, $6)',
          [workoutId, set_number, reps, weight, rpe, hold_time]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Workout added successfully');
    res.json(workoutResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding workout:', error);
    res.status(500).json({ error: 'Failed to add workout' });
  } finally {
    client.release();
  }
});
app.get('/categories/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const { rows } = await pool.query('SELECT id, name FROM category WHERE user_id = $1', [user_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
app.get('/search-workouts', async (req, res) => {
  const { name } = req.query;
  try {
    const { rows } = await pool.query('SELECT id, name FROM workout WHERE name ILIKE $1', [`%${name}%`]);
    res.json(rows);
  } catch (error) {
    console.error('Error searching workouts:', error);
    res.status(500).json({ error: 'Failed to search workouts' });
  }
});
app.get('/user-workouts', async (req, res) => {
  const { userId } = req.query;
  try {
    const { rows: workouts } = await pool.query('SELECT * FROM workout WHERE user_id = $1', [userId]);

    const workoutIds = workouts.map(workout => workout.id);
    const strengthQuery = pool.query('SELECT * FROM strength_workout WHERE workout_id = ANY($1)', [workoutIds]);
    const cardioQuery = pool.query('SELECT * FROM cardio_workout WHERE workout_id = ANY($1)', [workoutIds]);

    const [strengthWorkouts, cardioWorkouts] = await Promise.all([strengthQuery, cardioQuery]);

    const result = workouts.map(workout => ({
      ...workout,
      strength_workouts: strengthWorkouts.rows.filter(sw => sw.workout_id === workout.id),
      cardio_workouts: cardioWorkouts.rows.filter(cw => cw.workout_id === workout.id)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching user workouts:', error);
    res.status(500).json({ error: 'Failed to fetch user workouts' });
  }
});
app.post('/categories', async (req, res) => {
  const { name, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO category (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, user_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});// Statistic Tab Endpoints

app.get('/api/workout/consistency', async (req, res) => {
  const { userId } = req.query;
  try {
    console.log('Fetching workout consistency for user:', userId);
    const result = await pool.query(
      `SELECT date 
       FROM workout 
       WHERE user_id = $1 
       AND date_trunc('day', date) = date_trunc('day', CURRENT_DATE)`,
      [userId]
    );
    console.log('Workout consistency result:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout consistency:', error);
    res.status(500).json({ error: 'Failed to fetch workout consistency' });
  }
});
app.get('/api/sets/all-time', async (req, res) => {
  const { userId } = req.query;
  try {
    console.log('Fetching all-time sets for user:', userId);
    const result = await pool.query(
      `SELECT COUNT(*) 
       FROM strength_workout 
       WHERE workout_id IN (SELECT id FROM workout WHERE user_id = $1)`,
      [userId]
    );
    console.log('All-time sets result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching all-time sets:', error);
    res.status(500).json({ error: 'Failed to fetch all-time sets' });
  }
});

app.get('/api/sets/day', async (req, res) => {
  const { userId } = req.query;
  try {
    console.log('Fetching daily sets for user:', userId);
    const result = await pool.query(
      `SELECT COUNT(*) 
       FROM strength_workout 
       WHERE workout_id IN (
         SELECT id 
         FROM workout 
         WHERE user_id = $1 
         AND date_trunc('day', date) = date_trunc('day', CURRENT_DATE)
       )`,
      [userId]
    );
    console.log('Daily sets result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching daily sets:', error);
    res.status(500).json({ error: 'Failed to fetch daily sets' });
  }
});

app.get('/api/sets/week', async (req, res) => {
  const { userId } = req.query;
  try {
    console.log('Fetching weekly sets for user:', userId);
    const result = await pool.query(
      `SELECT COUNT(*) 
       FROM strength_workout 
       WHERE workout_id IN (
         SELECT id 
         FROM workout 
         WHERE user_id = $1 
         AND date_trunc('week', date) = date_trunc('week', CURRENT_DATE)
       )`,
      [userId]
    );
    console.log('Weekly sets result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching weekly sets:', error);
    res.status(500).json({ error: 'Failed to fetch weekly sets' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});