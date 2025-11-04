const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
});

async function testConnection() {
    try {
        await pool.getConnection();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testConnection();

module.exports = pool;