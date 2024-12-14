require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const connectDB = require('./config/db');

const companiesRouter = require('./routes/companies');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(clerkMiddleware()); // Clerk middleware for authentication

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
})

// Protected routes
app.use('/api/companies', companiesRouter); // Routes for companies
app.use('/api/users', usersRouter); // Routes for users

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace
  res.status(500).json({ error: 'Internal Server Error' }); // Send 500 response
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));