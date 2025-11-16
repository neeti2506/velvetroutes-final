import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'velvet_routes'
};

async function initializeMySQLDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting MySQL database initialization...');
    
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`✅ Database '${dbConfig.database}' created/verified`);
    
    // Switch to the database
    await connection.execute(`USE ${dbConfig.database}`);
    
    // Create tables
    console.log('📊 Creating database tables...');
    
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
    console.log('✅ Users table created');
    
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
    console.log('✅ Travel plans table created');
    
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
    console.log('✅ Bookings table created');
    
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
    console.log('✅ Payments table created');
    
    // Create indexes for better performance
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id)`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`);
    await connection.execute(`CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)`);
    console.log('✅ Database indexes created');
    
    // Insert sample data
    console.log('👥 Adding sample users...');
    
    // Clear existing users
    await connection.execute('DELETE FROM users');
    
    // Create sample users with hashed passwords
    const hashedPassword1 = await bcrypt.hash('password123', 12);
    const hashedPassword2 = await bcrypt.hash('password123', 12);
    
    await connection.execute(
      'INSERT INTO users (name, email, password, search_history, bookings) VALUES (?, ?, ?, ?, ?)',
      ['John Doe', 'john@example.com', hashedPassword1, JSON.stringify([]), JSON.stringify([])]
    );
    
    await connection.execute(
      'INSERT INTO users (name, email, password, search_history, bookings) VALUES (?, ?, ?, ?, ?)',
      ['Jane Smith', 'jane@example.com', hashedPassword2, JSON.stringify([]), JSON.stringify([])]
    );
    
    console.log('✅ Sample users added');
    console.log('📧 Test accounts:');
    console.log('   Email: john@example.com, Password: password123');
    console.log('   Email: jane@example.com, Password: password123');
    
    console.log('\n🎉 MySQL database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your .env file has correct MySQL credentials');
    console.log('2. Run: npm run server');
    console.log('3. Open: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your MySQL credentials in .env file');
    console.log('3. Ensure MySQL user has CREATE DATABASE privileges');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run initialization
initializeMySQLDatabase();
