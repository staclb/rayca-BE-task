const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

router.route('/').get(protect, role(['admin']), getUsers);

router.route('/:id').put(protect, role(['admin']), updateUserRole);

module.exports = router;
