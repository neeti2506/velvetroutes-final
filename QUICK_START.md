# Velvet Routes - Quick Start Guide

## 🚀 One-Click Startup (Recommended)

### For Windows Users:
1. **Double-click `start-all.bat`** - This will start both backend and frontend servers automatically
2. **Or use individual scripts:**
   - `start-server.bat` - Backend API server only
   - `start-frontend.bat` - Frontend development server only

### For Mac/Linux Users:
1. **Run `./start-all.sh`** - This will start both backend and frontend servers automatically
2. **Or use individual scripts:**
   - `./start-server.sh` - Backend API server only
   - `./start-frontend.sh` - Frontend development server only

## 📋 Manual Setup (If needed)

### Prerequisites:
- Node.js (v16 or higher)
- MySQL Server
- Git

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=velvet_routes
JWT_SECRET=velvet_routes_super_secret_key_2025
```

### Step 3: Initialize Database
```bash
npm run init-db
```

### Step 4: Start Servers

**Option A: Start Both Servers (Recommended)**
```bash
# Windows
start-all.bat

# Mac/Linux
./start-all.sh
```

**Option B: Start Servers Separately**
```bash
# Terminal 1 - Backend API
npm run server

# Terminal 2 - Frontend
npm run dev
```

## 🌐 Access Points

Once started, you can access:
- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/health

## 🔧 Troubleshooting

### Common Issues:

1. **Port Already in Use**
   - Backend (3000): Change PORT in .env file
   - Frontend (5173): Vite will automatically find next available port

2. **MySQL Connection Issues**
   - Ensure MySQL server is running
   - Check credentials in .env file
   - Run `npm run init-db` to create database

3. **Dependencies Issues**
   - Delete `node_modules` folder
   - Run `npm install` again

4. **Permission Issues (Mac/Linux)**
   - Make scripts executable: `chmod +x *.sh`

## 📱 Features Available

- ✅ User Authentication (Login/Signup)
- ✅ Travel Planning with AI Recommendations
- ✅ Hotel Search and Booking
- ✅ Real-time Location Services
- ✅ Budget Planning and Management
- ✅ Interactive UI with Modern Design

## 🎯 For Evaluation

The application is now ready for evaluation with:
- Permanent startup scripts for easy demonstration
- All features working and integrated
- Modern, responsive UI design
- Complete booking flow
- Real API integrations

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Ensure all prerequisites are installed
3. Verify MySQL server is running
4. Check firewall settings for port access

---

**Happy Travel Planning! ✈️**
