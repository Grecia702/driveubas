require('dotenv').config();
const pool = require('../db.js')

const createUser = async (name, password) => {
    const query = `
    INSERT INTO users 
    (username, password) 
    VALUES ($1, $2) 
    RETURNING id
    `;
    const { rows, rowCount } = await pool.query(query, [name, password]);
    return { rows, exists: rowCount > 0, result: rows[0] };
}

const getUser = async (name) => {
    const { rows, rowCount } = await pool.query("SELECT id, username, password FROM users WHERE username = $1", [name]);
    return { rows, exists: rowCount > 0, result: rows[0] };
}

const createRefreshToken = async (id, refreshToken, agent, userIp, expiresAt) => {
    const query = `
    INSERT INTO refresh_tokens 
    (usuario_id, token, user_agent, ip_address, expires_at) 
    VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [id, refreshToken, agent, userIp, expiresAt]);
}

const getToken = async (token, userId, userAgent, ipAddress) => {
    const query = `
    SELECT token FROM refresh_tokens 
    WHERE token = $1
    AND user_id = $2
    AND user_agent = $3
    AND ip_address = $4
    `;
    const { rows, rowCount } = await pool.query(query, [token, userId, userAgent, ipAddress])
    return { rows, exists: rowCount > 0, result: rows[0] }
}

const deleteToken = async (token) => {
    const query = `
    DELETE FROM refresh_tokens
    WHERE token = $1
    `;
    await pool.query(query, [token])
}

const accountExists = async (name) => {
    const query = `
    SELECT EXISTS (
        SELECT 1 FROM users WHERE username = $1
    )
    `;
    const exists = await pool.query(query, [name]);
    const { rows } = exists
    return rows[0].exists
}


module.exports = { createUser, getUser, createRefreshToken, getToken, deleteToken, accountExists };