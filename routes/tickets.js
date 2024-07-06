const express = require('express');
const {
  createTicket,
  updateTicket,
  deleteTicket,
  getTickets,
  getTicketById,
} = require('../controllers/ticketController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

// console.log('here in tickets route1');
/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Returns the list of all the tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: The list of the tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: The ticket was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router
  .route('/')
  .post(
    (req, res, next) => {
      console.log('POST /api/tickets route hit');
      next();
    },
    protect,
    role(['customer', 'support', 'admin']),
    createTicket,
  )
  .get(
    (req, res, next) => {
      console.log('GET /api/tickets route hit');
      next();
    },
    protect,
    role(['support', 'admin']),
    getTickets,
  );

// combine these like above
/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get the ticket by id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket id
 *     responses:
 *       200:
 *         description: The ticket description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: The ticket was not found
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update the ticket by the id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: The ticket was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: The ticket was not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Remove the ticket by id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket id
 *     responses:
 *       200:
 *         description: The ticket was deleted
 *       404:
 *         description: The ticket was not found
 */
router
  .route('/:id')
  .get(
    (req, res, next) => {
      console.log('GET /api/tickets/:id route hit');
      next();
    },
    protect,
    role(['support', 'admin']),
    getTicketById,
  )
  .put(
    (req, res, next) => {
      console.log('here in tickets put route1');
      next();
    },
    protect,
    role(['support', 'admin']),
    updateTicket,
  )
  .delete(protect, role(['admin']), deleteTicket);

module.exports = router;
