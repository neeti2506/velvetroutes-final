# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Velvet Routes -- Travel Itinerary Generator

A web-based application that generates personalized travel itineraries for users based on their preferences, budget, and duration of stay. The project is built with React + Vite for the frontend, C++ (OOP + DSA) for backend logic, and DBMS for efficient data storage.

# Tech Stack

Frontend: React + Vite, CSS, HTML, JavaScript
Backend: Node.js + Express.js (REST API)
Database: JSON-based storage (can be migrated to SQL/MongoDB)
Version Control: Git & GitHub

**NEW:** Full backend API integration with Express.js for data persistence!

# Features

User Preference Input: Users can enter trip details such as destination, budget, trip duration, travel dates, and personal interests (adventure, culture, relaxation, food, etc.).

Smart Itinerary Generation: The system automatically creates a day-wise travel plan that includes sightseeing spots, activities, meals, and relaxation time.

Budget Optimization: Suggestions are made according to the user’s budget, balancing between luxury and affordable options.

Accommodation Planning: Recommends hotels/hostels within the chosen budget and close to planned attractions.

Transport Options: Provides choices for local transport (taxis, public transport, rentals) depending on availability and cost efficiency.

Database Storage: All itineraries are stored in the database via REST API, allowing users to review, update, or reuse their past trips. Multiple users can access their personalized travel plans.

Responsive UI: Clean and modern web interface built with CSS, ensuring compatibility with mobile, tablet, and desktop devices.

Scalable Backend: Optimized C++ backend ensures fast itinerary generation using efficient algorithms and data structures.

Reusability & Modularity: The project is designed with modular components (both in frontend and backend), making it easy to extend with new features in the future.

Cross-Platform Accessibility: Being web-based, users can access the application from anywhere without installation.

# 🆕 Recent Updates

## Backend API Integration

The application now includes a full backend API built with Node.js and Express.js!

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the API server:**
   ```bash
   npm run server
   ```

3. **Start the frontend (optional):**
   ```bash
   npm run dev
   ```

### What's New

- ✅ RESTful API with Express.js
- ✅ Automatic data syncing (API + localStorage)
- ✅ Multi-user support
- ✅ Travel plan CRUD operations
- ✅ Backward compatibility maintained

### Documentation

- **Quick Start:** See `QUICK_START.md`
- **API Docs:** See `API_README.md`
- **Setup Guide:** See `SETUP_INSTRUCTIONS.md`
- **Changes:** See `CHANGES_SUMMARY.md`

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan
- `POST /api/plans/save-current` - Save user's current plan
- `GET /api/plans/user/:userId` - Get user's plans
