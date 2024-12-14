const User = require('../models/UserModel');
const { safeLog } = require('../utils/logger');
const { clerkClient } = require('@clerk/express');
// Controller to get users with pagination and filters
const getUsers = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query; // Extract query parameters
  const startTime = Date.now(); // Record start time for execution time calculation

  try {
    // Fetch users and total count in parallel
    const [users, total] = await Promise.all([
      User.find(filters)
        .populate('company', 'name industry location') // Populate company details
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(Number(limit)) // Limit number of documents per page
        .lean(), // Convert documents to plain JavaScript objects
      User.countDocuments(filters), // Count total number of documents matching filters
    ]);

    const executionTime = Date.now() - startTime; // Calculate execution time

    // Log success
    await safeLog([{
      message: 'Users retrieved',
      executionTime,
      filters,
      timestamp: new Date(),
      type: 'info',
      total,
      page
    }]);

    // Send response with users data and pagination info
    res.json({
      data: users,
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
      message: 'Error retrieving users',
      error: err.message,
      timestamp: new Date(),
      type: 'error'
    }]);
    
    res.status(500).json({ error: 'Internal Server Error' }); // Send 500 response
  }
};

const getClerkUsers = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const startTime = Date.now();

  try {
    const offset = (Number(page) - 1) * Number(limit);
    
    // Get users from Clerk with pagination
    const clerkResponse = await clerkClient.users.getUserList({
      limit: Number(limit),
      offset: offset
    });

    const users = clerkResponse.data || [];
    const totalUsers = clerkResponse.totalCount || 0;
    const executionTime = Date.now() - startTime;

    // Log success
    await safeLog([{
      message: 'Clerk users retrieved',
      executionTime,
      timestamp: new Date(),
      type: 'info',
      total: totalUsers,
      page
    }]);

    // Transform user data with actual fields
    const transformedUsers = users.map(user => ({
      _id: user.id, // Match MongoDB _id field format
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      email: user.emailAddresses?.[0]?.emailAddress || '',
      role: 'user', // Default role since Clerk doesn't have this
      createdAt: new Date(user.createdAt).toISOString(),
      imageUrl: user.imageUrl
    }));

    res.json({
      data: transformedUsers,
      pagination: {
        total: totalUsers,
        page: Number(page),
        totalPages: Math.ceil(totalUsers / Number(limit)) || 1
      },
      executionTime
    });

  } catch (err) {
    await safeLog([{
      message: 'Error retrieving Clerk users',
      error: err.message,
      timestamp: new Date(),
      type: 'error'
    }]);
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUsers,
  getClerkUsers
};