const express = require('express');
const router = express.Router();
const { getUsers, getClerkUsers } = require('../controllers/userController');

// Route to get MongoDB users
router.get('/', getUsers);

// Route to get Clerk users 
router.get('/clerk', getClerkUsers);

module.exports = router;