# 🚀 Velvet Routes - Travel Booking Platform

## 📁 **Project Structure**

This project is organized into a clean, professional folder structure for easy navigation and maintenance.

```
Velvet-Routes/
├── 📁 frontend/                    # Frontend application
│   ├── 📁 pages/                  # HTML pages
│   │   ├── index.html             # Main entry point
│   │   ├── home.html              # Landing page
│   │   ├── planner.html           # Travel planner
│   │   ├── dates_and_budget.html  # Trip planning
│   │   ├── hotel.html             # Hotel booking
│   │   ├── login.html             # User login
│   │   ├── signup.html            # User registration
│   │   └── ...                    # Other pages
│   └── 📁 assets/                 # Static assets
│       ├── 📁 css/                # Stylesheets
│       │   └── global-colors.css  # Color definitions
│       ├── 📁 js/                 # JavaScript files
│       │   ├── Script.js          # Main application logic
│       │   ├── hotel-search-api.js # Hotel search integration
│       │   ├── api-service.js     # API service layer
│       │   └── ...                # Other JS files
│       └── 📁 images/             # Image assets
├── 📁 backend/                    # Backend application
│   ├── server-mysql.js           # Main server file
│   ├── setup.js                  # Setup script
│   ├── 📁 database/              # Database files
│   │   └── init-mysql-database.js # Database initialization
│   ├── 📁 api/                   # API endpoints
│   └── 📁 middleware/            # Middleware functions
├── 📁 docs/                      # Documentation
│   ├── 📁 setup/                 # Setup guides
│   ├── 📁 guides/                # User guides
│   └── 📁 api/                   # API documentation
├── 📁 data/                      # Data files
├── 📁 public/                    # Public assets
├── 📁 src/                       # Source files
├── package.json                  # Dependencies
├── package-lock.json            # Lock file
└── index.html                   # Main entry point
```

## 🎯 **Quick Start**

### **1. Navigate to Project**
```bash
cd "2nd year project final/Velvet-Routes"
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup Database**
```bash
# Copy environment file
copy backend\env-mysql.example .env

# Edit .env with your MySQL credentials
# Then initialize database
npm run init-db
```

### **4. Start Application**
```bash
# Start backend server
npm run server

# Start frontend (new terminal)
npm run dev
```

### **5. Access Application**
- **Main Entry**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api

## 📂 **Folder Descriptions**

### **Frontend (`/frontend/`)**
Contains all client-side code and assets.

- **`/pages/`** - All HTML pages
  - `home.html` - Main landing page
  - `planner.html` - Destination search and planning
  - `hotel.html` - Hotel booking interface
  - `login.html` / `signup.html` - Authentication
  - Other pages for complete booking flow

- **`/assets/css/`** - Stylesheets
  - `global-colors.css` - Color definitions and themes

- **`/assets/js/`** - JavaScript files
  - `Script.js` - Main application logic
  - `hotel-search-api.js` - Hotel search integration
  - `api-service.js` - API communication
  - Other utility and integration files

### **Backend (`/backend/`)**
Contains all server-side code and configuration.

- **`server-mysql.js`** - Main Express.js server
- **`setup.js`** - Project setup script
- **`/database/`** - Database-related files
  - `init-mysql-database.js` - Database initialization
- **`/api/`** - API endpoint definitions
- **`/middleware/`** - Custom middleware functions

### **Documentation (`/docs/`)**
All project documentation organized by category.

- **`/setup/`** - Setup and installation guides
- **`/guides/`** - User and developer guides
- **`/api/`** - API documentation

## 🔧 **Key Features**

### **Dynamic Location System**
- Search any destination worldwide
- Real-time country data from REST Countries API
- Location persistence across pages

### **Hotel Integration**
- Multiple booking site integration (Hotels.com, Booking.com, Agoda)
- Real-time hotel data and pricing
- External booking links

### **Database Integration**
- MySQL database with proper relationships
- User authentication and data storage
- Travel plans and booking history

### **Modern UI/UX**
- Responsive design for all devices
- Glass morphism effects
- Smooth animations and transitions

## 📋 **Available Commands**

```bash
# Development
npm run dev          # Start frontend development server
npm run server       # Start backend server
npm run start        # Start production server

# Database
npm run init-db      # Initialize MySQL database
npm run setup        # Run setup script

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Utilities
npm run lint         # Run code linting
npm run test         # Run tests
```

## 🌍 **Supported Destinations**

- **Any Country**: Japan, France, USA, UAE, India, etc.
- **Any City**: Tokyo, Paris, New York, Dubai, Mumbai, etc.
- **Real Data**: Live information from multiple APIs

## 🔐 **Authentication**

- User registration and login
- JWT token-based authentication
- Secure password hashing
- Session management

## 💾 **Data Storage**

- **localStorage**: Client-side data persistence
- **MySQL Database**: Server-side data storage
- **Search History**: User search tracking
- **Travel Plans**: Saved trip information

## 🚀 **Production Ready**

- Professional folder structure
- Scalable architecture
- Error handling
- Security measures
- Documentation

## 📞 **Support**

For questions or issues:
1. Check the documentation in `/docs/`
2. Review the setup guides
3. Check the API documentation

---

**Your Velvet Routes travel booking platform is now professionally organized and ready for development!** 🎉✈️🌍
