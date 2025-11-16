import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

// Database Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  searchHistory: [{ 
    destination: String, 
    details: Object, 
    timestamp: { type: Date, default: Date.now } 
  }],
  bookings: [{ 
    bookingId: String, 
    destination: String, 
    dates: Object, 
    hotel: Object, 
    totalCost: Number, 
    status: String, 
    createdAt: { type: Date, default: Date.now } 
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const travelPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: String,
  budget: String,
  departureDate: String,
  returnDate: String,
  duration: Number,
  adults: Number,
  children: Number,
  infants: Number,
  flightClass: String,
  localTransport: String,
  hotel: String,
  selectedHotel: Object,
  totalCost: Number,
  budgetRange: Object,
  transportCost: Object,
  isCurrent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: String, unique: true, required: true },
  hotelId: String,
  hotelName: String,
  destination: String,
  checkIn: String,
  checkOut: String,
  guests: Object,
  travelerInfo: Object,
  totalCost: Number,
  status: { type: String, default: 'confirmed' },
  paymentStatus: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentId: { type: String, unique: true, required: true },
  amount: Number,
  currency: { type: String, default: 'USD' },
  status: { type: String, default: 'pending' },
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// Database connection
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/velvet_routes');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
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
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    req.user = user;
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      searchHistory: [],
      bookings: []
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Don't send password back
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      searchHistory: newUser.searchHistory,
      bookings: newUser.bookings,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json({ 
      success: true, 
      user: userResponse,
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
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Don't send password back
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      searchHistory: user.searchHistory,
      bookings: user.bookings,
      createdAt: user.createdAt
    };
    
    res.json({ success: true, user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// Get current user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const userResponse = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      searchHistory: req.user.searchHistory,
      bookings: req.user.bookings,
      createdAt: req.user.createdAt
    };
    
    res.json({ success: true, user: userResponse });
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
    const planData = {
      ...req.body,
      userId: req.user._id,
      updatedAt: new Date()
    };
    
    // Check if user already has a current plan
    let existingPlan = await TravelPlan.findOne({ 
      userId: req.user._id, 
      isCurrent: true 
    });
    
    if (existingPlan) {
      // Update existing current plan
      Object.assign(existingPlan, planData);
      existingPlan.updatedAt = new Date();
      await existingPlan.save();
      res.json({ success: true, data: existingPlan });
    } else {
      // Create new current plan
      const newPlan = new TravelPlan(planData);
      await newPlan.save();
      res.status(201).json({ success: true, data: newPlan });
    }
  } catch (error) {
    console.error('Save plan error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get current travel plan
app.get('/api/plans/current', authenticateToken, async (req, res) => {
  try {
    const currentPlan = await TravelPlan.findOne({ 
      userId: req.user._id, 
      isCurrent: true 
    });
    
    res.json({ success: true, data: currentPlan });
  } catch (error) {
    console.error('Get current plan error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all user's travel plans
app.get('/api/plans', authenticateToken, async (req, res) => {
  try {
    const plans = await TravelPlan.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    
    res.json({ success: true, data: plans });
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
      timestamp: new Date()
    };
    
    req.user.searchHistory.unshift(searchEntry);
    
    // Keep only last 20 searches
    if (req.user.searchHistory.length > 20) {
      req.user.searchHistory = req.user.searchHistory.slice(0, 20);
    }
    
    await req.user.save();
    
    res.json({ success: true, searchHistory: req.user.searchHistory });
  } catch (error) {
    console.error('Add search history error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user search history
app.get('/api/users/search-history', authenticateToken, async (req, res) => {
  try {
    res.json({ success: true, searchHistory: req.user.searchHistory });
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
    
    const booking = new Booking({
      userId: req.user._id,
      bookingId,
      hotelId,
      hotelName,
      destination,
      checkIn,
      checkOut,
      guests,
      travelerInfo,
      totalCost,
      status: 'confirmed',
      paymentStatus: 'completed'
    });
    
    await booking.save();
    
    // Add to user's bookings
    req.user.bookings.push({
      bookingId,
      destination,
      dates: { checkIn, checkOut },
      hotel: { hotelId, hotelName },
      totalCost,
      status: 'confirmed',
      createdAt: new Date()
    });
    
    await req.user.save();
    
    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: bookings });
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
    
    const payment = new Payment({
      userId: req.user._id,
      paymentId,
      amount,
      currency: currency || 'USD',
      metadata,
      status: 'pending'
    });
    
    await payment.save();
    
    res.json({ 
      success: true, 
      clientSecret: `secret_demo_${Date.now()}`,
      paymentIntent: payment 
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
    
    const payment = await Payment.findOne({ 
      paymentId: paymentIntentId,
      userId: req.user._id 
    });
    
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    
    payment.status = 'succeeded';
    await payment.save();
    
    // Mark plan as paid if planId provided
    if (planId) {
      const plan = await TravelPlan.findOne({ 
        _id: planId, 
        userId: req.user._id 
      });
      if (plan) {
        plan.paymentStatus = 'completed';
        plan.paidAt = new Date();
        await plan.save();
      }
    }
    
    res.json({ success: true, payment });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Velvet Routes API is running!',
    database: 'Connected',
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
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Velvet Routes API Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔐 Authentication: JWT tokens`);
    console.log(`💾 Database: MongoDB`);
  });
}

startServer().catch(console.error);