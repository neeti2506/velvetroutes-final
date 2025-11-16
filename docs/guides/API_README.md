# Velvet Routes API Documentation

This document provides information about the API integration for the Velvet Routes travel planning application.

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Install the required dependencies:
```bash
npm install
```

This will install:
- `express` - Web framework for Node.js
- `cors` - Enable Cross-Origin Resource Sharing

### Running the API Server

To start the backend API server:

```bash
npm run server
```

The API server will start on `http://localhost:3000`

### Running Both Frontend and Backend Together

To run both the Vite dev server and the API server simultaneously, you'll need to install `concurrently`:

```bash
npm install -D concurrently
```

Then update the `package.json` scripts to include:

```json
"dev:all": "concurrently \"npm run server\" \"npm run dev\""
```

## 📡 API Endpoints

### Health Check

**GET** `/api/health`

Check if the API server is running.

**Response:**
```json
{
  "success": true,
  "message": "Velvet Routes API is running!"
}
```

### Travel Plans

#### Get All Travel Plans

**GET** `/api/plans`

Retrieve all travel plans in the system.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "userId": "user_1234567890",
      "destination": "Paris, France",
      "departureDate": "2025-06-01",
      "returnDate": "2025-06-07",
      "budget": "comfort",
      "adults": 2,
      "children": 0,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Specific Travel Plan

**GET** `/api/plans/:id`

Retrieve a specific travel plan by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "userId": "user_1234567890",
    "destination": "Paris, France",
    ...
  }
}
```

#### Create New Travel Plan

**POST** `/api/plans`

Create a new travel plan.

**Request Body:**
```json
{
  "destination": "Tokyo, Japan",
  "departureDate": "2025-07-01",
  "returnDate": "2025-07-15",
  "budget": "luxury",
  "adults": 2,
  "children": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "destination": "Tokyo, Japan",
    "createdAt": "2025-01-15T10:30:00.000Z",
    ...
  }
}
```

#### Update Travel Plan

**PUT** `/api/plans/:id`

Update an existing travel plan.

**Request Body:**
```json
{
  "destination": "Updated Destination",
  "budget": "economy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "destination": "Updated Destination",
    "updatedAt": "2025-01-15T11:00:00.000Z",
    ...
  }
}
```

#### Delete Travel Plan

**DELETE** `/api/plans/:id`

Delete a travel plan.

**Response:**
```json
{
  "success": true,
  "message": "Travel plan deleted successfully"
}
```

#### Save Current User's Travel Data

**POST** `/api/plans/save-current`

Save or update the current user's travel data. This automatically handles creating a new plan or updating an existing one for the user.

**Request Body:**
```json
{
  "userId": "user_1234567890",
  "destination": "Paris, France",
  "departureDate": "2025-06-01",
  "returnDate": "2025-06-07",
  "budget": "comfort",
  "adults": 2,
  "children": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "userId": "user_1234567890",
    "isCurrent": true,
    "destination": "Paris, France",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Get User's Travel Plans

**GET** `/api/plans/user/:userId`

Get all travel plans for a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "userId": "user_1234567890",
      "destination": "Paris, France",
      ...
    },
    {
      "id": "1234567891",
      "userId": "user_1234567890",
      "destination": "Tokyo, Japan",
      ...
    }
  ]
}
```

## 💻 Frontend API Usage

### Initialization

Include the API service in your HTML files:

```html
<script src="api-service.js"></script>
<script src="Script.js"></script>
```

### Using the API

The `Script.js` file has been updated to automatically use the API when available. The functions in `Script.js` now:

1. **Save to localStorage** for immediate access
2. **Try to save to API** if the server is available
3. **Load from API first**, fall back to localStorage if API fails

### Manual API Calls

You can also call the API functions directly from JavaScript:

```javascript
// Save travel data
await window.VelvetAPI.saveTravelDataEnhanced(travelData);

// Load travel data
const data = await window.VelvetAPI.loadTravelDataEnhanced();

// Get all plans
const allPlans = await window.VelvetAPI.getAllTravelPlans();

// Get current user's plans
const userPlans = await window.VelvetAPI.getUserPlans();

// Delete a plan
await window.VelvetAPI.deleteTravelPlan(planId);
```

## 📁 Data Storage

The API stores travel plans in a JSON file located at:
- **File:** `data/travelplans.json`
- **Note:** This file is automatically created when the server starts
- **Backup:** The data directory is excluded from git (see `.gitignore`)

## 🔧 Configuration

### Change API Port

Edit `server.js` or set the `PORT` environment variable:

```bash
PORT=4000 node server.js
```

### Change API Base URL

Edit `api-service.js` to change the base URL:

```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

### Enable/Disable API

The application works with or without the API:
- **With API:** Data is synced to the server
- **Without API:** Falls back to localStorage only

## 🧪 Testing the API

You can test the API endpoints using tools like:
- [Postman](https://www.postman.com/)
- [curl](https://curl.se/)
- Browser's Network tab

Example with curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Get all plans
curl http://localhost:3000/api/plans

# Create a new plan
curl -X POST http://localhost:3000/api/plans \
  -H "Content-Type: application/json" \
  -d '{"destination":"Paris, France","budget":"comfort"}'
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
PORT=4000 npm run server
```

### CORS Issues

CORS is already configured in the server. If you encounter issues, check:
1. API server is running
2. Correct API URL in `api-service.js`
3. Browser console for error messages

### Data Not Persisting

Check:
1. `data/travelplans.json` exists and is writable
2. Server has proper permissions
3. API requests are successful (check browser Network tab)

## 📝 Notes

- The API uses JSON file storage for simplicity
- For production use, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)
- User sessions are managed via localStorage (userId)
- All dates use ISO 8601 format
- The API automatically generates IDs using timestamps

## 🔐 Security Considerations

For production deployment:
- Add authentication (JWT tokens)
- Implement rate limiting
- Add request validation
- Use HTTPS
- Sanitize user inputs
- Consider migrating to a proper database

## 📄 License

This API is part of the Velvet Routes project.

