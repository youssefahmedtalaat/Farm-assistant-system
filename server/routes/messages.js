import express from 'express';
import pool from '../db/connection.js';
import { generateUUID } from '../db/uuid_helper.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all messages (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST a new message (Public or Authenticated)
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message, userId } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const id = generateUUID();
    const query = `
      INSERT INTO messages (id, user_id, first_name, last_name, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
    `;
    
    // Use NULL if userId is not provided
    const validUserId = userId || null;

    await pool.query(query, [id, validUserId, firstName, lastName, email, subject, message]);

    res.status(201).json({ success: true, message: 'Message sent successfully', id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PUT update message status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let query = 'UPDATE messages SET status = ? WHERE id = ?';
    let params = [status, id];

    if (status === 'replied') {
      query = 'UPDATE messages SET status = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?';
    }

    await pool.query(query, params);

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE message (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
