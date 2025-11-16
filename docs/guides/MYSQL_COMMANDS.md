# 🚀 Velvet Routes - MySQL Command Guide

## 📋 Quick Setup Commands

### 1. Install MySQL (if not already installed)

**Windows:**
- Download from: https://dev.mysql.com/downloads/mysql/
- Run installer and set root password

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Project Setup Commands

```bash
# Navigate to project directory
cd "2nd year project final/Velvet-Routes"

# Install all dependencies
npm install

# Copy MySQL environment template
cp env-mysql.example .env

# Edit .env file with your MySQL credentials
# (Change MYSQL_PASSWORD to your actual MySQL root password)

# Initialize MySQL database and tables
npm run init-db

# Start the backend server
npm run server

# In a new terminal, start the frontend
npm run dev
```

## 🔧 Environment Configuration

**Edit `.env` file:**
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=velvet_routes
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

## 📊 Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run init-db` | Initialize MySQL database and tables |
| `npm run server` | Start backend API server |
| `npm run dev` | Start frontend development server |
| `npm run build` | Build for production |
| `npm run lint` | Run code linting |
| `npm run test` | Run tests |

## 🗄️ MySQL Management Commands

### Connect to MySQL
```bash
mysql -u root -p
```

### View Database
```sql
USE velvet_routes;
SHOW TABLES;
DESCRIBE users;
```

### View Data
```sql
SELECT * FROM users;
SELECT * FROM travel_plans;
SELECT * FROM bookings;
```

### Reset Database (if needed)
```sql
DROP DATABASE velvet_routes;
CREATE DATABASE velvet_routes;
```

## 🚀 Testing Commands

### Check if services are running
```bash
# Check MySQL
sudo systemctl status mysql

# Check if port 3000 is in use
netstat -an | grep 3000

# Check if port 5173 is in use (Vite dev server)
netstat -an | grep 5173
```

### Test API endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Test registration
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔍 Troubleshooting Commands

### Kill processes on ports
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Restart MySQL
```bash
# Windows
net stop mysql
net start mysql

# macOS
brew services restart mysql

# Linux
sudo systemctl restart mysql
```

### Check MySQL logs
```bash
# View MySQL error log
sudo tail -f /var/log/mysql/error.log

# Or on macOS with Homebrew
tail -f /usr/local/var/mysql/*.err
```

## 📱 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| API Server | http://localhost:3000 | Backend API |
| Frontend | http://localhost:5173 | Development server |
| Home Page | http://localhost:3000/home.html | Main website |
| Sign Up | http://localhost:3000/signup.html | User registration |
| Login | http://localhost:3000/login.html | User login |
| Planner | http://localhost:3000/planner.html | Travel planning |
| API Health | http://localhost:3000/api/health | Server status |

## 🎯 Complete Setup Sequence

```bash
# 1. Install MySQL and start it
sudo systemctl start mysql

# 2. Navigate to project
cd "2nd year project final/Velvet-Routes"

# 3. Install dependencies
npm install

# 4. Setup environment
cp env-mysql.example .env
# Edit .env with your MySQL password

# 5. Initialize database
npm run init-db

# 6. Start backend (Terminal 1)
npm run server

# 7. Start frontend (Terminal 2)
npm run dev

# 8. Open browser
# Go to: http://localhost:3000/home.html
```

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file configured (`.env`)
- [ ] Database initialized (`npm run init-db`)
- [ ] Backend server running (`npm run server`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Can access http://localhost:3000/api/health
- [ ] Can register a new user
- [ ] Can login with test account
- [ ] Can search for destinations
- [ ] Can plan a trip
- [ ] Can book a hotel

## 🎉 Success!

Once all commands complete successfully, your Velvet Routes travel booking platform will be fully functional with MySQL database!

**Test Accounts:**
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`
