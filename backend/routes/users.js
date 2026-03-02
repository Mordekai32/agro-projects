const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// GET all users (SELECT the required fields)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT user_id, full_name, email, phone_number, user_type, location FROM users'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// GET a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT user_id, full_name, email, phone_number, user_type, location FROM users WHERE user_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// POST create a new user
router.post('/', async (req, res) => {
    const { full_name, email, phone_number, user_type, location, password } = req.body;
    if (!full_name || !email || !password || !user_type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (full_name, email, phone_number, user_type, location, password) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, email, phone_number, user_type, location, hashedPassword]
        );

        // Return the created user (excluding password)
        const [newUser] = await db.query(
            'SELECT user_id, full_name, email, phone_number, user_type, location FROM users WHERE user_id = ?',
            [result.insertId]
        );
        res.status(201).json(newUser[0]);
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Database error' });
    }
});

// PUT update an existing user
router.put('/:id', async (req, res) => {
    const { full_name, email, phone_number, user_type, location, password } = req.body;
    const userId = req.params.id;

    try {
        // Build dynamic update query
        let query = 'UPDATE users SET ';
        const values = [];
        const updates = [];

        if (full_name !== undefined) {
            updates.push('full_name = ?');
            values.push(full_name);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            values.push(email);
        }
        if (phone_number !== undefined) {
            updates.push('phone_number = ?');
            values.push(phone_number);
        }
        if (user_type !== undefined) {
            updates.push('user_type = ?');
            values.push(user_type);
        }
        if (location !== undefined) {
            updates.push('location = ?');
            values.push(location);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        query += updates.join(', ') + ' WHERE user_id = ?';
        values.push(userId);

        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return updated user
        const [updatedUser] = await db.query(
            'SELECT user_id, full_name, email, phone_number, user_type, location FROM users WHERE user_id = ?',
            [userId]
        );
        res.json(updatedUser[0]);
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Database error' });
    }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;