const express = require('express');
const router = express.Router();
const { getCompanies, searchCompanies } = require('../controllers/companyController');

// Route to get companies
router.get('/', getCompanies);

module.exports = router;