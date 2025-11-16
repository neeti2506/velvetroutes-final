#!/usr/bin/env node

// Database Initialization Script for Velvet Routes
// This script initializes the database with sample data

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database Models (same as server.js)
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

const User = mongoose.model('User', userSchema);
const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/velvet_routes');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await TravelPlan.deleteMany({});
    console.log('✅ Database cleared');

    // Create sample users
    console.log('👥 Creating sample users...');
    
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        searchHistory: [
          {
            destination: 'Paris, France',
            details: {
              country: 'France',
              capital: 'Paris',
              population: 67399000,
              currency: 'Euro',
              languages: 'French'
            },
            timestamp: new Date()
          },
          {
            destination: 'Tokyo, Japan',
            details: {
              country: 'Japan',
              capital: 'Tokyo',
              population: 125800000,
              currency: 'Japanese Yen',
              languages: 'Japanese'
            },
            timestamp: new Date()
          }
        ],
        bookings: []
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        searchHistory: [
          {
            destination: 'Goa, India',
            details: {
              country: 'India',
              capital: 'New Delhi',
              population: 1380000000,
              currency: 'Indian Rupee',
              languages: 'Hindi, English'
            },
            timestamp: new Date()
          }
        ],
        bookings: []
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Create sample travel plans
    console.log('🗺️ Creating sample travel plans...');
    
    const samplePlans = [
      {
        userId: createdUsers[0]._id,
        destination: 'Paris, France',
        budget: 'comfort',
        departureDate: '2024-02-15',
        returnDate: '2024-02-22',
        duration: 7,
        adults: 2,
        children: 0,
        infants: 0,
        flightClass: 'Economy',
        localTransport: 'Public Transport',
        hotel: 'Luxury Resort',
        selectedHotel: {
          name: 'Grand Paris Hotel',
          price: 200,
          rating: 4.5
        },
        totalCost: 2500,
        budgetRange: { min: 2000, max: 3000 },
        transportCost: { min: 500, max: 800 },
        isCurrent: true
      },
      {
        userId: createdUsers[1]._id,
        destination: 'Goa, India',
        budget: 'economy',
        departureDate: '2024-03-01',
        returnDate: '2024-03-08',
        duration: 7,
        adults: 1,
        children: 0,
        infants: 0,
        flightClass: 'Economy',
        localTransport: 'Taxi',
        hotel: 'Budget Stay',
        selectedHotel: {
          name: 'Goa Beach Resort',
          price: 80,
          rating: 4.0
        },
        totalCost: 800,
        budgetRange: { min: 500, max: 1000 },
        transportCost: { min: 200, max: 400 },
        isCurrent: true
      }
    ];

    const createdPlans = await TravelPlan.insertMany(samplePlans);
    console.log(`✅ Created ${createdPlans.length} sample travel plans`);

    console.log('\n🎉 Database initialization complete!');
    console.log('=====================================');
    console.log('\nSample users created:');
    console.log('📧 john@example.com / password: password123');
    console.log('📧 jane@example.com / password: password123');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm run server');
    console.log('2. Login with sample accounts');
    console.log('3. Test the application features');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run initialization
initializeDatabase();
