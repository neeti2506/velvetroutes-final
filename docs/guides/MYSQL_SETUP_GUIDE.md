# 🚀 Velvet Routes - MySQL Setup Guide

## 📋 Prerequisites

Before setting up your Velvet Routes project with MySQL, make sure you have:

1. **Node.js** (v16 or higher)
2. **MySQL Server** (v8.0 or higher)
3. **npm** (comes with Node.js)

## 🗄️ MySQL Installation

### Windows:
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Remember your root password!

### macOS:
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

## 🔧 Project Setup Steps

### Step 1: Install Dependencies
```bash
cd "2nd year project final/Velvet-Routes"
npm install
```

### Step 2: Configure Environment Variables
```bash
# Copy the MySQL environment template
cp env-mysql.example .env

# Edit the .env file with your MySQL credentials
```

**Edit `.env` file:**
```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=velvet_routes

# JWT Secret Key (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this

# External API Keys (optional)
UNSPLASH_ACCESS_KEY=your_unsplash_key
OPENWEATHER_API_KEY=your_openweather_key
EXCHANGERATE_API_KEY=your_exchangerate_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Step 3: Initialize MySQL Database
```bash
npm run init-db
```

This will:
- Create the `velvet_routes` database
- Create all necessary tables
- Add sample users for testing
- Set up indexes for performance

### Step 4: Start the Server
```bash
npm run server
```

### Step 5: Start the Frontend (in a new terminal)
```bash
npm run dev
```

## 🎯 Testing Your Setup

### 1. Check API Health
Open: http://localhost:3000/api/health

You should see:
```json
{
  "success": true,
  "message": "Velvet Routes API is running!",
  "database": "Connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Test User Registration
Open: http://localhost:3000/signup.html

Create a new account or use test accounts:
- **Email:** john@example.com, **Password:** password123
- **Email:** jane@example.com, **Password:** password123

### 3. Test Login
Open: http://localhost:3000/login.html

Login with your credentials.

### 4. Test Travel Planning
1. Go to: http://localhost:3000/planner.html
2. Search for a destination (e.g., "France")
3. Continue to dates and budget planning
4. Complete the booking flow

## 🗃️ Database Structure

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  search_history JSON,
  bookings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Travel Plans Table
```sql
CREATE TABLE travel_plans (
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
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
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
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  payment_id VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔍 Database Management

### Connect to MySQL
```bash
mysql -u root -p
```

### View Database
```sql
USE velvet_routes;
SHOW TABLES;
```

### View Users
```sql
SELECT id, name, email, created_at FROM users;
```

### View Travel Plans
```sql
SELECT * FROM travel_plans;
```

### View Bookings
```sql
SELECT * FROM bookings;
```

### Reset Database (if needed)
```sql
DROP DATABASE velvet_routes;
CREATE DATABASE velvet_routes;
```

Then run: `npm run init-db`

## 🚨 Troubleshooting

### Common Issues:

#### 1. MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Make sure MySQL is running
```bash
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

#### 2. Access Denied Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Check your MySQL password in `.env` file

#### 3. Database Already Exists
```
Error: Database 'velvet_routes' already exists
```
**Solution:** This is normal, the script will use the existing database

#### 4. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill the process using port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## 📊 Available Commands

```bash
# Install dependencies
npm install

# Initialize MySQL database
npm run init-db

# Start backend server
npm run server

# Start frontend development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```

## 🎉 Success!

Once everything is set up, you should have:

✅ **MySQL Database** with all tables created  
✅ **Backend API** running on http://localhost:3000  
✅ **Frontend Website** running on http://localhost:5173  
✅ **User Authentication** working  
✅ **Travel Planning** functional  
✅ **Hotel Booking** system active  
✅ **Payment Processing** ready  

## 🔗 Quick Links

- **API Health Check:** http://localhost:3000/api/health
- **Home Page:** http://localhost:3000/home.html
- **Sign Up:** http://localhost:3000/signup.html
- **Login:** http://localhost:3000/login.html
- **Travel Planner:** http://localhost:3000/planner.html

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify MySQL is running
3. Check your `.env` file configuration
4. Look at the server console for error messages
5. Ensure all dependencies are installed

**Your Velvet Routes travel booking platform is now ready with MySQL!** 🚀✈️🌍
