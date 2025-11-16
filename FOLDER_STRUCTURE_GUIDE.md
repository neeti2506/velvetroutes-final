# 📁 Velvet Routes - Folder Structure Overview

## 🎯 **Main Directories**

### **📂 `/frontend/` - Client-Side Application**
```
frontend/
├── pages/                    # All HTML pages
│   ├── index.html           # Entry point
│   ├── home.html            # Landing page
│   ├── planner.html         # Travel planner
│   ├── dates_and_budget.html # Trip planning
│   ├── hotel.html           # Hotel booking
│   ├── login.html           # User login
│   ├── signup.html          # User registration
│   ├── booking-summary.html # Booking summary
│   ├── payment.html         # Payment page
│   ├── confirmation.html    # Booking confirmation
│   ├── transport.html       # Transport selection
│   ├── summary.html         # Trip summary
│   ├── AboutUS.html         # About page
│   ├── Contact.html         # Contact page
│   └── navigation-template.html # Navigation component
├── assets/
│   ├── css/                 # Stylesheets
│   │   └── global-colors.css # Color definitions
│   ├── js/                  # JavaScript files
│   │   ├── Script.js        # Main application logic
│   │   ├── hotel-search-api.js # Hotel search integration
│   │   ├── api-service.js   # API service layer
│   │   ├── api-integrations.js # API integrations
│   │   ├── real-apis.js     # Real API implementations
│   │   ├── init-database.js # Database initialization
│   │   └── eslint.config.js # ESLint configuration
│   └── images/              # Image assets (empty)
```

### **📂 `/backend/` - Server-Side Application**
```
backend/
├── server-mysql.js          # Main Express.js server
├── setup.js                 # Project setup script
├── env-mysql.example        # MySQL environment template
├── env.example              # General environment template
├── database/
│   └── init-mysql-database.js # Database initialization
├── api/                     # API endpoints (empty)
└── middleware/              # Middleware functions (empty)
```

### **📂 `/docs/` - Documentation**
```
docs/
├── setup/                   # Setup guides (empty)
├── guides/                  # User and developer guides
│   ├── README.md            # Main documentation
│   ├── API_README.md        # API documentation
│   ├── COMPLETE_SETUP_GUIDE.md # Complete setup guide
│   ├── MYSQL_SETUP_GUIDE.md # MySQL setup guide
│   ├── MYSQL_COMMANDS.md    # MySQL commands
│   ├── DYNAMIC_LOCATION_SYSTEM_GUIDE.md # Location system guide
│   ├── TECHNICAL_FLOW_GUIDE.md # Technical flow guide
│   ├── USER_SYSTEM_GUIDE.md # User system guide
│   ├── HOW_TO_USE_COMPLETE_WEBSITE.md # Website usage guide
│   ├── PROJECT_SUMMARY.md   # Project summary
│   ├── SIMPLE_GUIDE.md      # Simple guide
│   ├── NAVIGATION_FLOW_GUIDE.md # Navigation guide
│   ├── COMMAND_GUIDE.md     # Command reference
│   ├── DATA_FLOW_DIAGRAM.md # Data flow diagram
│   └── ...                  # Other documentation files
└── api/                     # API documentation (empty)
```

## 🔧 **File Types by Purpose**

### **🌐 Frontend Files**
- **HTML Pages**: All user interface pages in `/frontend/pages/`
- **JavaScript**: Application logic in `/frontend/assets/js/`
- **CSS**: Styling in `/frontend/assets/css/`
- **Images**: Visual assets in `/frontend/assets/images/`

### **⚙️ Backend Files**
- **Server**: Main server file in `/backend/server-mysql.js`
- **Database**: Database scripts in `/backend/database/`
- **Configuration**: Environment files in `/backend/`
- **API**: API endpoints in `/backend/api/`

### **📚 Documentation Files**
- **Guides**: User and developer guides in `/docs/guides/`
- **Setup**: Installation guides in `/docs/setup/`
- **API**: API documentation in `/docs/api/`

## 🚀 **Quick Navigation**

### **To Edit Pages:**
```
frontend/pages/ → Choose your HTML file
```

### **To Edit JavaScript:**
```
frontend/assets/js/ → Choose your JS file
```

### **To Edit Backend:**
```
backend/ → server-mysql.js (main server)
backend/database/ → Database scripts
```

### **To Read Documentation:**
```
docs/guides/ → Choose your guide
```

## 📋 **File Naming Convention**

### **HTML Pages:**
- `home.html` - Main landing page
- `planner.html` - Travel planning
- `hotel.html` - Hotel booking
- `login.html` - User authentication
- `*-summary.html` - Summary pages

### **JavaScript Files:**
- `Script.js` - Main application logic
- `*-api.js` - API integration files
- `*-service.js` - Service layer files

### **Documentation:**
- `*_GUIDE.md` - User guides
- `*_README.md` - Technical documentation
- `*_COMMANDS.md` - Command references

## 🎯 **Development Workflow**

### **1. Frontend Development:**
```
Edit: frontend/pages/*.html
Edit: frontend/assets/js/*.js
Edit: frontend/assets/css/*.css
```

### **2. Backend Development:**
```
Edit: backend/server-mysql.js
Edit: backend/database/*.js
Edit: backend/api/*.js
```

### **3. Documentation:**
```
Edit: docs/guides/*.md
Edit: docs/setup/*.md
Edit: docs/api/*.md
```

## 🔍 **Finding Files**

### **By Function:**
- **Authentication**: `frontend/pages/login.html`, `frontend/pages/signup.html`
- **Travel Planning**: `frontend/pages/planner.html`, `frontend/pages/dates_and_budget.html`
- **Hotel Booking**: `frontend/pages/hotel.html`, `frontend/assets/js/hotel-search-api.js`
- **Payment**: `frontend/pages/payment.html`, `frontend/pages/confirmation.html`
- **Server**: `backend/server-mysql.js`
- **Database**: `backend/database/init-mysql-database.js`

### **By Type:**
- **HTML**: All in `frontend/pages/`
- **JavaScript**: All in `frontend/assets/js/`
- **CSS**: All in `frontend/assets/css/`
- **Server**: All in `backend/`
- **Documentation**: All in `docs/guides/`

## 📊 **Project Statistics**

- **Total HTML Pages**: 15+ pages
- **JavaScript Files**: 10+ files
- **Documentation Files**: 20+ guides
- **Backend Files**: 5+ files
- **Organized Folders**: 8 main directories

---

**Your project is now professionally organized for easy navigation and development!** 🎉📁✨
