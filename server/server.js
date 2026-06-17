import express from 'express';
import cors from 'cors';
import pool from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allows your frontend to securely fetch data from the server
app.use(express.json());

// ROUTE 1: Get all items (Includes Stretch Feature: Search query parameter)
app.get('/api/games', async (req, res) => {
    const { search } = req.query;
    try {
        let queryText = 'SELECT * FROM arcade_games ORDER BY title ASC';
        let queryParams = [];

        // Stretch Goal: If a user types a search value, filter by genre or title
        if (search) {
            queryText = 'SELECT * FROM arcade_games WHERE title ILIKE $1 OR genre ILIKE $1 ORDER BY title ASC';
            queryParams = [`%${search}%`];
        }

        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server database error' });
    }
});

// ROUTE 2: Get a single item detailed breakdown
app.get('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM arcade_games WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game cabinet not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server database error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Database server actively listening on port ${PORT}`);
});