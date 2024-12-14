require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');
const User = require('./models/User');
const connectDB = require('./config/db');

// Sample data arrays
const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education'];
const locations = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Boston', 'Seattle'];
const roles = ['Developer', 'Analyst', 'Manager', 'Designer', 'Engineer', 'Consultant'];
const companyNames = [
  'Tech Solutions', 'Digital Dynamics', 'Future Systems', 'Smart Corp', 'Innovation Labs',
  'Data Metrics', 'Cloud Nine', 'Cyber Security Co', 'AI Solutions', 'Web Works',
  'Mobile Masters', 'Software Specialists', 'Tech Giants', 'Digital Dreams', 'Code Crafters',
  'Beta Solutions', 'Alpha Systems', 'Next Level Tech', 'Future Force', 'Digital Dash',
  'Tech Titans', 'Innovate Inc', 'Smart Systems', 'Digital Depot', 'Tech Track',
  'Code Quest', 'Binary Solutions', 'Data Drive', 'Tech Time', 'Digital Domain'
];

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Company.deleteMany({});
  await User.deleteMany({});

  // Create 30 companies
  const companies = await Company.create(
    companyNames.map(name => ({
      name,
      industry: industries[Math.floor(Math.random() * industries.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    }))
  );

  // Create 60 users (2 per company)
  const users = [];
  for (let i = 0; i < 60; i++) {
    const companyIndex = Math.floor(i / 2); // Assigns 2 users per company
    const company = companies[companyIndex];
    const firstName = `User${i + 1}`;
    const lastName = `LastName${i + 1}`;
    
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      company: company._id
    });
    users.push(user);
  }

  // Update companies with employee references
  await Promise.all(companies.map(async (company, index) => {
    company.employees.push(users[index * 2]._id, users[index * 2 + 1]._id);
    await company.save();
  }));

  console.log('Data seeded successfully');
  process.exit();
};

seedData().catch(err => {
  console.error('Error seeding data:', err);
  process.exit(1);
});