const express = require('express');
const {
  createTicket,
  updateTicket,
  deleteTicket,
  getTickets,
} = require('../controllers/ticketController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

// router
//   .route('/')
//   .post(protect, role(['customer', 'support', 'admin']), createTicket)
//   .get(protect, role(['support', 'admin']), getTickets);
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

router
  .route('/:id')
  .put(protect, role(['support', 'admin']), updateTicket)
  .delete(protect, role(['admin']), deleteTicket);

module.exports = router;
