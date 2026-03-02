require('dotenv').config(); // 👈 Load environment variables from .env file FIRST

const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // pool.promise()

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const advisoryRoutes = require('./routes/advisoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection (promise style)
db.getConnection()
  .then(conn => {
    console.log('✅ Database connected');
    conn.release(); // always release the connection!
  })
  .catch(err => {
    console.error('❌ DB connection error:', err.message);
    console.error('   Please make sure your .env file contains the correct database credentials.');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/advisory', advisoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));