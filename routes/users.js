const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/').get(protect, role(['admin']), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update the role of a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The new role of the user
 *                 enum: [customer, support, admin]
 *     responses:
 *       200:
 *         description: The user role was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.route('/:id').put(protect, role(['admin']), updateUserRole);

module.exports = router;
