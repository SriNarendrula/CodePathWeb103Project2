import pg from 'pg';
import dotenv from 'dotenv';

// This initializes the environmental variable injection from your .env file
dotenv.config();

const pool = new pg.Pool({
    // Node reads the value from your hidden .env file automatically
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;