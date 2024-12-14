const Company = require('../models/CompanyModel');
const { safeLog } = require('../utils/logger');

// Controller to get companies with pagination and filters
const getCompanies = async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query; // Extract query parameters
    const startTime = Date.now(); // Record start time for execution time calculation

    // Build query filters from request query parameters
    const queryFilters = {};
    for (const key in filters) {
        if (filters[key]) {
            queryFilters[key] = filters[key];
        }
    }

    try {
        // Fetch companies and total count in parallel
        const [companies, total] = await Promise.all([
            Company.find(queryFilters)
                .populate('employees', 'name email role') // Populate employee details
                .skip((page - 1) * limit) // Skip documents for pagination
                .limit(Number(limit)) // Limit number of documents per page
                .lean(), // Convert documents to plain JavaScript objects
            Company.countDocuments(queryFilters) // Count total number of documents matching filters
        ]);

        const executionTime = Date.now() - startTime; // Calculate execution time

        // Log success
        await safeLog([{
            message: 'Companies retrieved',
            executionTime,
            filters: queryFilters,
            timestamp: new Date(),
            type: 'info',
            total,
            page
        }]);

        // Send response with companies data and pagination info
        res.json({
            data: companies,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limit) || 1
            },
            executionTime
        });
    } catch (err) {
        // Log error
        await safeLog([{
            message: 'Error retrieving companies',
            error: err.message,
            timestamp: new Date(),
            type: 'error'
        }]);
        res.status(500).json({ error: 'Internal Server Error' }); // Send 500 response
    }
};

module.exports = {
    getCompanies
};