const express = require('express');
const { sendMessage } = require('../controllers/messageController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message to the ticket creator
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: The ID of the ticket
 *               message:
 *                 type: string
 *                 description: The message to send
 *     responses:
 *       201:
 *         description: The message was successfully sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the message
 *                 ticket:
 *                   type: string
 *                   description: The ID of the ticket
 *                 sender:
 *                   type: string
 *                   description: The ID of the sender
 *                 message:
 *                   type: string
 *                   description: The message content
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the message was created
 */
router.post('/', protect, role(['admin', 'support']), sendMessage);

module.exports = router;
