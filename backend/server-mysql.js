import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MySQL Database Configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'velvet_routes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Database initialization
async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Create tables
    await createTables();
    console.log('✅ MySQL database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Create database tables
async function createTables() {
  const connection = await pool.getConnection();
  
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        search_history JSON,
        bookings JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Travel plans table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS travel_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        destination VARCHAR(255),
        budget VARCHAR(100),
        departure_date DATE,
        return_date DATE,
        duration INT,
        adults INT DEFAULT 2,
        children INT DEFAULT 0,
        infants INT DEFAULT 0,
        flight_class VARCHAR(100),
        local_transport VARCHAR(100),
        hotel VARCHAR(255),
        selected_hotel JSON,
        total_cost DECIMAL(10,2),
        budget_range JSON,
        transport_cost JSON,
        is_current BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_id VARCHAR(100) UNIQUE NOT NULL,
        hotel_id VARCHAR(100),
        hotel_name VARCHAR(255),
        destination VARCHAR(255),
        check_in DATE,
        check_out DATE,
        guests JSON,
        traveler_info JSON,
        total_cost DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'confirmed',
        payment_status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        payment_id VARCHAR(100) UNIQUE NOT NULL,
        amount DECIMAL(10,2),
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id)`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)`);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Database connection test
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Connected to MySQL database');
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
}

// JWT middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, email, search_history, bookings FROM users WHERE id = ?',
      [decoded.userId]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Register new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const connection = await pool.getConnection();
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, search_history, bookings) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, JSON.stringify([]), JSON.stringify([])]
    );
    
    const userId = result.insertId;
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Get user data
    const [userRows] = await connection.execute(
      'SELECT id, name, email, search_history, bookings, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    connection.release();
    
    const user = userRows[0];
    user.search_history = JSON.parse(user.search_history);
    user.bookings = JSON.parse(user.bookings);
    
    res.status(201).json({ 
      success: true, 
      user: user,
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, email, password, search_history, bookings, created_at FROM users WHERE email = ?',
      [email]
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Parse JSON fields
    user.search_history = JSON.parse(user.search_history);
    user.bookings = JSON.parse(user.bookings);
    
    // Remove password from response
    delete user.password;
    
    res.json({ success: true, user: user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// Get current user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    user.search_history = JSON.parse(user.search_history);
    user.bookings = JSON.parse(user.bookings);
    
    res.json({ success: true, user: user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// TRAVEL PLANS ROUTES
// ============================================

// Save current travel plan
app.post('/api/plans/save-current', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Check if user already has a current plan
    const [existingPlans] = await connection.execute(
      'SELECT id FROM travel_plans WHERE user_id = ? AND is_current = TRUE',
      [req.user.id]
    );
    
    const planData = {
      user_id: req.user.id,
      destination: req.body.destination || null,
      budget: req.body.budget || null,
      departure_date: req.body.departureDate || null,
      return_date: req.body.returnDate || null,
      duration: req.body.duration || null,
      adults: req.body.adults || 2,
      children: req.body.children || 0,
      infants: req.body.infants || 0,
      flight_class: req.body.flightClass || null,
      local_transport: req.body.localTransport || null,
      hotel: req.body.hotel || null,
      selected_hotel: req.body.selectedHotel ? JSON.stringify(req.body.selectedHotel) : null,
      total_cost: req.body.totalCost || null,
      budget_range: req.body.budgetRange ? JSON.stringify(req.body.budgetRange) : null,
      transport_cost: req.body.transportCost ? JSON.stringify(req.body.transportCost) : null,
      is_current: true
    };
    
    if (existingPlans.length > 0) {
      // Update existing current plan
      const updateFields = Object.keys(planData).map(key => `${key} = ?`).join(', ');
      const updateValues = Object.values(planData);
      updateValues.push(existingPlans[0].id);
      
      await connection.execute(
        `UPDATE travel_plans SET ${updateFields} WHERE id = ?`,
        updateValues
      );
      
      const [updatedPlan] = await connection.execute(
        'SELECT * FROM travel_plans WHERE id = ?',
        [existingPlans[0].id]
      );
      
      connection.release();
      res.json({ success: true, data: updatedPlan[0] });
    } else {
      // Create new current plan
      const fields = Object.keys(planData).join(', ');
      const placeholders = Object.keys(planData).map(() => '?').join(', ');
      const values = Object.values(planData);
      
      const [result] = await connection.execute(
        `INSERT INTO travel_plans (${fields}) VALUES (${placeholders})`,
        values
      );
      
      const [newPlan] = await connection.execute(
        'SELECT * FROM travel_plans WHERE id = ?',
        [result.insertId]
      );
      
      connection.release();
      res.status(201).json({ success: true, data: newPlan[0] });
    }
  } catch (error) {
    console.error('Save plan error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get current travel plan
app.get('/api/plans/current', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM travel_plans WHERE user_id = ? AND is_current = TRUE',
      [req.user.id]
    );
    connection.release();
    
    res.json({ success: true, data: rows[0] || null });
  } catch (error) {
    console.error('Get current plan error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all user's travel plans
app.get('/api/plans', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM travel_plans WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );
    connection.release();
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// SEARCH HISTORY ROUTES
// ============================================

// Add search to history
app.post('/api/users/search-history', authenticateToken, async (req, res) => {
  try {
    const { destination, details } = req.body;
    
    const searchEntry = {
      destination,
      details,
      timestamp: new Date().toISOString()
    };
    
    const connection = await pool.getConnection();
    const [userRows] = await connection.execute(
      'SELECT search_history FROM users WHERE id = ?',
      [req.user.id]
    );
    
    let searchHistory = JSON.parse(userRows[0].search_history);
    searchHistory.unshift(searchEntry);
    
    // Keep only last 20 searches
    if (searchHistory.length > 20) {
      searchHistory = searchHistory.slice(0, 20);
    }
    
    await connection.execute(
      'UPDATE users SET search_history = ? WHERE id = ?',
      [JSON.stringify(searchHistory), req.user.id]
    );
    
    connection.release();
    
    res.json({ success: true, searchHistory: searchHistory });
  } catch (error) {
    console.error('Add search history error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user search history
app.get('/api/users/search-history', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT search_history FROM users WHERE id = ?',
      [req.user.id]
    );
    connection.release();
    
    const searchHistory = JSON.parse(rows[0].search_history);
    res.json({ success: true, searchHistory: searchHistory });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// BOOKING ROUTES
// ============================================

// Book hotel
app.post('/api/hotels/book', authenticateToken, async (req, res) => {
  try {
    const { hotelId, hotelName, destination, checkIn, checkOut, guests, travelerInfo, totalCost } = req.body;
    
    const bookingId = `VR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const connection = await pool.getConnection();
    
    // Create booking record
    await connection.execute(
      'INSERT INTO bookings (user_id, booking_id, hotel_id, hotel_name, destination, check_in, check_out, guests, traveler_info, total_cost, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, bookingId, hotelId, hotelName, destination, checkIn, checkOut, JSON.stringify(guests), JSON.stringify(travelerInfo), totalCost, 'confirmed', 'completed']
    );
    
    // Add to user's bookings
    const [userRows] = await connection.execute(
      'SELECT bookings FROM users WHERE id = ?',
      [req.user.id]
    );
    
    let bookings = JSON.parse(userRows[0].bookings);
    bookings.push({
      bookingId,
      destination,
      dates: { checkIn, checkOut },
      hotel: { hotelId, hotelName },
      totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    });
    
    await connection.execute(
      'UPDATE users SET bookings = ? WHERE id = ?',
      [JSON.stringify(bookings), req.user.id]
    );
    
    connection.release();
    
    res.json({ success: true, data: { bookingId, status: 'confirmed' } });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    connection.release();
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// PAYMENT ROUTES
// ============================================

// Create payment intent
app.post('/api/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    
    const paymentId = `pi_${Date.now()}`;
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO payments (user_id, payment_id, amount, currency, status, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, paymentId, amount, currency || 'USD', 'pending', JSON.stringify(metadata)]
    );
    connection.release();
    
    res.json({ 
      success: true, 
      clientSecret: `secret_demo_${Date.now()}`,
      paymentIntent: { paymentId, amount, currency: currency || 'USD' }
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Confirm payment
app.post('/api/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, planId } = req.body;
    
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM payments WHERE payment_id = ? AND user_id = ?',
      [paymentIntentId, req.user.id]
    );
    
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    
    await connection.execute(
      'UPDATE payments SET status = ? WHERE payment_id = ?',
      ['succeeded', paymentIntentId]
    );
    
    // Mark plan as paid if planId provided
    if (planId) {
      await connection.execute(
        'UPDATE travel_plans SET payment_status = ?, paid_at = NOW() WHERE id = ?',
        ['completed', planId]
      );
    }
    
    connection.release();
    
    res.json({ success: true, payment: { ...rows[0], status: 'succeeded' } });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// SHARING & COLLABORATION
// ============================================

// Create shareable trip link
app.post('/api/trips/share', authenticateToken, async (req, res) => {
  try {
    const { tripData } = req.body;
    const userId = req.user.id;
    
    // Generate unique share ID
    const shareId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const connection = await pool.getConnection();
    await connection.execute(
      `CREATE TABLE IF NOT EXISTS shared_trips (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT NOT NULL,
        trip_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry
    
    await connection.execute(
      'INSERT INTO shared_trips (id, user_id, trip_data, expires_at) VALUES (?, ?, ?, ?)',
      [shareId, userId, JSON.stringify(tripData), expiresAt]
    );
    
    connection.release();
    
    res.json({
      success: true,
      shareId: shareId,
      shareLink: `${req.protocol}://${req.get('host')}/pages/itinerary-planner.html?share=${shareId}`
    });
  } catch (error) {
    console.error('Share trip error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get shared trip
app.get('/api/trips/share/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT trip_data FROM shared_trips WHERE id = ? AND (expires_at IS NULL OR expires_at > NOW())',
      [shareId]
    );
    
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Trip not found or expired' });
    }
    
    res.json({
      success: true,
      tripData: JSON.parse(rows[0].trip_data)
    });
  } catch (error) {
    console.error('Get shared trip error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add comment to shared trip
app.post('/api/trips/share/:shareId/comments', authenticateToken, async (req, res) => {
  try {
    const { shareId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    
    const connection = await pool.getConnection();
    
    await connection.execute(
      `CREATE TABLE IF NOT EXISTS trip_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        share_id VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (share_id) REFERENCES shared_trips(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );
    
    await connection.execute(
      'INSERT INTO trip_comments (share_id, user_id, comment) VALUES (?, ?, ?)',
      [shareId, userId, comment]
    );
    
    connection.release();
    
    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get comments for shared trip
app.get('/api/trips/share/:shareId/comments', async (req, res) => {
  try {
    const { shareId } = req.params;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      `SELECT tc.comment, tc.created_at, u.name as user_name 
       FROM trip_comments tc 
       JOIN users u ON tc.user_id = u.id 
       WHERE tc.share_id = ? 
       ORDER BY tc.created_at DESC`,
      [shareId]
    );
    
    connection.release();
    
    res.json({ success: true, comments: rows });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({ 
    success: true, 
    message: 'Velvet Routes API is running!',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'API endpoint not found' 
  });
});

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Velvet Routes API Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔐 Authentication: JWT tokens`);
    console.log(`💾 Database: MySQL`);
  });
}

startServer().catch(console.error);
