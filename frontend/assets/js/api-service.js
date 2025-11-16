// API Service for Velvet Routes
// This file provides functions to interact with the backend API

const API_BASE_URL = 'http://localhost:3000/api';

// Utility function to get current user ID (from localStorage or generate one)
function getCurrentUserId() {
    let userId = localStorage.getItem('velvetRoutesUserId');
    if (!userId) {
        userId = 'user_' + Date.now();
        localStorage.setItem('velvetRoutesUserId', userId);
    }
    return userId;
}

// API request helper function
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// API FUNCTIONS FOR TRAVEL PLANS
// ============================================

/**
 * Save current travel data to the server
 * @param {Object} travelData - The travel data object
 * @returns {Promise<Object>} The saved plan data
 */
async function saveTravelPlan(travelData) {
    const planData = {
        userId: getCurrentUserId(),
        ...travelData,
        isCurrent: true
    };
    
    return await apiRequest('/plans/save-current', {
        method: 'POST',
        body: JSON.stringify(planData)
    });
}

/**
 * Get all travel plans
 * @returns {Promise<Array>} Array of all travel plans
 */
async function getAllTravelPlans() {
    const response = await apiRequest('/plans');
    return response.data;
}

/**
 * Get a specific travel plan by ID
 * @param {string} planId - The plan ID
 * @returns {Promise<Object>} The travel plan
 */
async function getTravelPlan(planId) {
    const response = await apiRequest(`/plans/${planId}`);
    return response.data;
}

/**
 * Update a travel plan
 * @param {string} planId - The plan ID
 * @param {Object} updatedData - The updated travel data
 * @returns {Promise<Object>} The updated plan
 */
async function updateTravelPlan(planId, updatedData) {
    return await apiRequest(`/plans/${planId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
    });
}

/**
 * Delete a travel plan
 * @param {string} planId - The plan ID
 * @returns {Promise<Object>} Success message
 */
async function deleteTravelPlan(planId) {
    return await apiRequest(`/plans/${planId}`, {
        method: 'DELETE'
    });
}

/**
 * Get all plans for the current user
 * @returns {Promise<Array>} Array of user's travel plans
 */
async function getUserPlans() {
    const userId = getCurrentUserId();
    const response = await apiRequest(`/plans/user/${userId}`);
    return response.data;
}

/**
 * Get the current travel plan for the user
 * @returns {Promise<Object|null>} The current plan or null
 */
async function getCurrentTravelPlan() {
    try {
        const plans = await getUserPlans();
        const currentPlan = plans.find(p => p.isCurrent);
        return currentPlan || null;
    } catch (error) {
        console.error('Error getting current plan:', error);
        return null;
    }
}

// ============================================
// ENHANCED SAVE FUNCTIONS
// ============================================

/**
 * Enhanced save function that syncs with both API and localStorage
 * @param {Object} travelData - The travel data to save
 * @returns {Promise<void>}
 */
async function saveTravelDataEnhanced(travelData) {
    // Save to localStorage for immediate access
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('velvetRoutesData', JSON.stringify(travelData));
    }
    
    // Try to save to API if available
    try {
        await saveTravelPlan(travelData);
    } catch (error) {
        console.warn('Could not save to API, using localStorage only:', error);
        // Continue with localStorage if API fails
    }
}

/**
 * Enhanced load function that tries API first, then localStorage
 * @returns {Promise<Object>} The loaded travel data
 */
async function loadTravelDataEnhanced() {
    // Try to load from API first
    try {
        const currentPlan = await getCurrentTravelPlan();
        if (currentPlan) {
            // Save to localStorage for offline access
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('velvetRoutesData', JSON.stringify(currentPlan));
            }
            return currentPlan;
        }
    } catch (error) {
        console.warn('Could not load from API, using localStorage:', error);
    }
    
    // Fallback to localStorage
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('velvetRoutesData');
        if (saved) {
            return JSON.parse(saved);
        }
    }
    
    // Return default travel data
    return {
        destination: '',
        budget: '',
        departureDate: '',
        returnDate: '',
        duration: 0,
        adults: 2,
        children: 0,
        infants: 0,
        flightClass: '',
        localTransport: '',
        hotel: '',
        selectedHotel: null,
        totalCost: 0
    };
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

// Make functions available globally
if (typeof window !== 'undefined') {
    window.VelvetAPI = {
        saveTravelPlan,
        getAllTravelPlans,
        getTravelPlan,
        updateTravelPlan,
        deleteTravelPlan,
        getUserPlans,
        getCurrentTravelPlan,
        saveTravelDataEnhanced,
        loadTravelDataEnhanced,
        apiRequest,
        getCurrentUserId
    };
}

// Export for Node.js environment (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveTravelPlan,
        getAllTravelPlans,
        getTravelPlan,
        updateTravelPlan,
        deleteTravelPlan,
        getUserPlans,
        getCurrentTravelPlan,
        saveTravelDataEnhanced,
        loadTravelDataEnhanced
    };
}

