// API Integration for Hotels and Destinations
// This file provides real API integrations for the Velvet Routes application

const API_CONFIG = {
    AMADEUS_API_KEY: 'YOUR_AMADEUS_API_KEY', // Replace with your API key
    HOTELS_API_KEY: 'YOUR_HOTELS_API_KEY',
    REST_COUNTRIES_BASE: 'https://restcountries.com/v3.1',
    // Free alternatives
    WEATHER_API: 'https://wttr.in',
    GEONAMES_API: 'http://api.geonames.org'
};

// ============================================
// DESTINATION SEARCH API
// ============================================

/**
 * Search for destinations using REST Countries API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of destinations
 */
async function searchDestinations(query) {
    try {
        // Use REST Countries API for free destination data
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=name,capital,flags,population,region`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch destinations');
        }
        
        const countries = await response.json();
        
        // Transform data to match our format
        return countries.map(country => ({
            name: country.capital?.[0] || country.name.common,
            country: country.name.common,
            flag: country.flags?.svg,
            region: country.region,
            population: country.population,
            cost: estimateTravelCost(country.region, country.population)
        }));
    } catch (error) {
        console.error('Error searching destinations:', error);
        // Return fallback data
        return getFallbackDestinations(query);
    }
}

/**
 * Get popular destinations
 * @returns {Promise<Array>} Array of popular destinations
 */
async function getPopularDestinations() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region');
        const countries = await response.json();
        
        // Filter for countries with capitals and high population
        const destinations = countries
            .filter(c => c.capital && c.capital.length > 0)
            .sort((a, b) => b.population - a.population)
            .slice(0, 20);
        
        return destinations.map(country => ({
            name: country.capital[0],
            country: country.name.common,
            flag: country.flags.svg,
            region: country.region,
            population: country.population,
            cost: estimateTravelCost(country.region, country.population)
        }));
    } catch (error) {
        console.error('Error fetching destinations:', error);
        return getHardcodedDestinations();
    }
}

function estimateTravelCost(region, population) {
    // Simple cost estimation based on region
    const costRanges = {
        'Europe': '$800-1500',
        'Asia': '$600-1200',
        'Americas': '$700-1400',
        'Africa': '$500-1000',
        'Oceania': '$1000-2000'
    };
    
    return costRanges[region] || '$600-1500';
}

function getFallbackDestinations(query) {
    // Hardcoded destinations as fallback
    const allDestinations = [
        { name: 'Paris', country: 'France', cost: '$800-1500', region: 'Europe' },
        { name: 'Tokyo', country: 'Japan', cost: '$800-1500', region: 'Asia' },
        { name: 'New York', country: 'USA', cost: '$1000-2500', region: 'Americas' },
        { name: 'London', country: 'UK', cost: '$700-1400', region: 'Europe' },
        { name: 'Dubai', country: 'UAE', cost: '$900-2000', region: 'Asia' },
        { name: 'Sydney', country: 'Australia', cost: '$1000-2500', region: 'Oceania' },
        { name: 'Goa', country: 'India', cost: '$250-500', region: 'Asia' }
    ];
    
    return allDestinations.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase())
    );
}

function getHardcodedDestinations() {
    return [
        { name: 'Paris, France', cost: '$800-1500', emoji: '🗼', category: 'Cultural' },
        { name: 'Tokyo, Japan', cost: '$800-1500', emoji: '🏯', category: 'Adventure' },
        { name: 'Goa, India', cost: '$250-500', emoji: '🏖️', category: 'Beach' },
        { name: 'Dubai, UAE', cost: '$900-2000', emoji: '🏙️', category: 'Luxury' },
        { name: 'New York, USA', cost: '$1000-2500', emoji: '🗽', category: 'Urban' },
        { name: 'London, UK', cost: '$700-1400', emoji: '🏰', category: 'Historic' },
        { name: 'Bali, Indonesia', cost: '$600-1200', emoji: '🌺', category: 'Tropical' },
        { name: 'Switzerland', cost: '$1200-2500', emoji: '🏔️', category: 'Nature' }
    ];
}

// ============================================
// HOTEL SEARCH API (Mock with real structure)
// ============================================

/**
 * Search hotels by destination
 * @param {string} destination - Destination name
 * @param {string} checkIn - Check-in date
 * @param {string} checkOut - Check-out date
 * @param {number} guests - Number of guests
 * @returns {Promise<Array>} Array of hotels
 */
async function searchHotels(destination, checkIn, checkOut, guests) {
    try {
        // In production, connect to real hotel API like Booking.com or Amadeus
        // For now, simulate hotel search with realistic data
        
        const mockHotels = generateMockHotels(destination);
        
        // Add slight delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockHotels;
    } catch (error) {
        console.error('Error searching hotels:', error);
        return [];
    }
}

function generateMockHotels(destination) {
    const hotelTypes = [
        { type: 'Luxury Resort', stars: 5, priceRange: [200, 500], amenities: ['Spa', 'Pool', 'Gym', 'Restaurant', 'Beach Access'] },
        { type: 'Business Hotel', stars: 4, priceRange: [100, 250], amenities: ['WiFi', 'Gym', 'Restaurant', 'Conference Room'] },
        { type: 'Boutique Hotel', stars: 4, priceRange: [80, 200], amenities: ['WiFi', 'Restaurant', 'Bar', 'Parking'] },
        { type: 'Budget Stay', stars: 3, priceRange: [30, 80], amenities: ['WiFi', 'Parking', 'Basic Breakfast'] }
    ];
    
    return hotelTypes.map((hotel, index) => ({
        id: `hotel_${Date.now()}_${index}`,
        name: `${getHotelName(hotel.type, destination)}`,
        address: `${destination} City Center`,
        price: Math.floor(Math.random() * (hotel.priceRange[1] - hotel.priceRange[0]) + hotel.priceRange[0]),
        stars: hotel.stars,
        rating: (Math.random() * 2 + 3.5).toFixed(1),
        amenities: hotel.amenities,
        images: [`https://source.unsplash.com/400x300/?hotel,${destination.replace(/\s/g,',')}`],
        availability: Math.random() > 0.3, // 70% availability
        reviews: Math.floor(Math.random() * 500 + 10)
    }));
}

function getHotelName(type, destination) {
    const prefixes = ['Grand', 'Royal', 'Plaza', 'Palace', 'Sunset', 'Ocean View', 'Mountain View'];
    const suffix = type.replace(' Hotel', '');
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${destination} ${suffix}`;
}

// ============================================
// WEATHER API
// ============================================

/**
 * Get weather information for a destination
 * @param {string} destination - Destination name
 * @returns {Promise<Object>} Weather data
 */
async function getWeather(destination) {
    try {
        // Using wttr.in for free weather data
        const response = await fetch(`https://wttr.in/${encodeURIComponent(destination)}?format=j1`);
        
        if (!response.ok) {
            throw new Error('Weather API not available');
        }
        
        const data = await response.json();
        
        return {
            temperature: data.current_condition[0].temp_C,
            condition: data.current_condition[0].weatherDesc[0].value,
            humidity: data.current_condition[0].humidity,
            visibility: data.current_condition[0].visibility
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return {
            temperature: 'N/A',
            condition: 'Unable to fetch',
            humidity: 'N/A',
            visibility: 'N/A'
        };
    }
}

// ============================================
// CURRENCY CONVERSION API
// ============================================

/**
 * Convert currency (mock implementation)
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency
 * @param {string} to - Target currency
 * @returns {Promise<number>} Converted amount
 */
async function convertCurrency(amount, from, to) {
    // Mock currency conversion rates
    const rates = {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'INR': 83.1,
        'JPY': 149.5,
        'AED': 3.67
    };
    
    const fromRate = rates[from.toUpperCase()] || 1;
    const toRate = rates[to.toUpperCase()] || 1;
    
    return (amount / fromRate) * toRate;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

if (typeof window !== 'undefined') {
    window.TravelAPI = {
        searchDestinations,
        getPopularDestinations,
        searchHotels,
        getWeather,
        convertCurrency,
        generateMockHotels
    };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchDestinations,
        getPopularDestinations,
        searchHotels,
        getWeather,
        convertCurrency
    };
}

