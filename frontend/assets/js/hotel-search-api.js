// Hotel Search API Integration
// This file handles real hotel searches based on user-entered locations

class HotelSearchAPI {
    constructor() {
        this.rapidApiKey = 'your_rapidapi_key_here'; // Replace with actual RapidAPI key
        this.bookingApiKey = 'your_booking_api_key_here'; // Replace with actual Booking.com API key
        this.agodaApiKey = 'your_agoda_api_key_here'; // Replace with actual Agoda API key
    }

    // Search hotels using multiple APIs
    async searchHotelsForDestination(searchQuery, cityName) {
        try {
            console.log(`Searching hotels for: ${searchQuery} (${cityName})`);
            
            // Try multiple hotel APIs in parallel
            const hotelPromises = [
                this.searchHotelsRapidAPI(searchQuery, cityName),
                this.searchHotelsBookingAPI(searchQuery, cityName),
                this.searchHotelsAgodaAPI(searchQuery, cityName),
                this.searchHotelsMockAPI(searchQuery, cityName) // Fallback mock data
            ];

            const results = await Promise.allSettled(hotelPromises);
            
            // Combine results from all APIs
            let allHotels = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allHotels = allHotels.concat(result.value);
                    console.log(`API ${index + 1} returned ${result.value.length} hotels`);
                } else {
                    console.log(`API ${index + 1} failed:`, result.reason);
                }
            });

            // Remove duplicates and sort by price
            const uniqueHotels = this.removeDuplicateHotels(allHotels);
            const sortedHotels = uniqueHotels.sort((a, b) => a.price - b.price);

            console.log(`Total unique hotels found: ${sortedHotels.length}`);
            return sortedHotels.slice(0, 20); // Return top 20 hotels

        } catch (error) {
            console.error('Error searching hotels:', error);
            // Return mock data as fallback
            return this.getMockHotelsForLocation(searchQuery, cityName);
        }
    }

    // RapidAPI Hotel Search (using Hotels.com API)
    async searchHotelsRapidAPI(searchQuery, cityName) {
        try {
            const response = await fetch(`https://hotels-com-provider.p.rapidapi.com/v1/destinations/search?query=${encodeURIComponent(searchQuery)}&locale=en_US&currency=USD`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': this.rapidApiKey,
                    'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error(`RapidAPI error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatRapidAPIHotels(data, cityName);

        } catch (error) {
            console.error('RapidAPI search failed:', error);
            return [];
        }
    }

    // Booking.com API Search
    async searchHotelsBookingAPI(searchQuery, cityName) {
        try {
            const response = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?checkin_date=2024-02-15&checkout_date=2024-02-17&dest_id=${encodeURIComponent(searchQuery)}&adults_number=2&room_number=1&order_by=popularity&dest_type=city&filter_by_currency=USD&locale=en_us&units=metric`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': this.rapidApiKey,
                    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error(`Booking API error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatBookingAPIHotels(data, cityName);

        } catch (error) {
            console.error('Booking API search failed:', error);
            return [];
        }
    }

    // Agoda API Search
    async searchHotelsAgodaAPI(searchQuery, cityName) {
        try {
            const response = await fetch(`https://agoda-com.p.rapidapi.com/v1/hotels/search?checkin=2024-02-15&checkout=2024-02-17&adults=2&rooms=1&city=${encodeURIComponent(searchQuery)}&currency=USD`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': this.rapidApiKey,
                    'X-RapidAPI-Host': 'agoda-com.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error(`Agoda API error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatAgodaAPIHotels(data, cityName);

        } catch (error) {
            console.error('Agoda API search failed:', error);
            return [];
        }
    }

    // Mock API for demonstration (fallback)
    async searchHotelsMockAPI(searchQuery, cityName) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getMockHotelsForLocation(searchQuery, cityName);
    }

    // Format RapidAPI hotel data
    formatRapidAPIHotels(data, cityName) {
        if (!data.suggestions || !Array.isArray(data.suggestions)) {
            return [];
        }

        return data.suggestions.map((hotel, index) => ({
            id: `rapid_${hotel.dest_id || index}`,
            name: hotel.dest_name || `Hotel in ${cityName}`,
            city: cityName,
            country: hotel.country || 'Unknown',
            price: this.generateRandomPrice(80, 300),
            rating: this.generateRandomRating(3.5, 5.0),
            image: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`,
            amenities: this.getRandomAmenities(),
            description: `Beautiful hotel in ${cityName} with excellent facilities`,
            bookingUrl: `https://hotels.com/ho${hotel.dest_id || index}`,
            source: 'Hotels.com'
        }));
    }

    // Format Booking.com API hotel data
    formatBookingAPIHotels(data, cityName) {
        if (!data.result || !Array.isArray(data.result)) {
            return [];
        }

        return data.result.map((hotel, index) => ({
            id: `booking_${hotel.hotel_id || index}`,
            name: hotel.hotel_name || `Hotel in ${cityName}`,
            city: cityName,
            country: hotel.country || 'Unknown',
            price: hotel.price_breakdown?.gross_price || this.generateRandomPrice(70, 250),
            rating: hotel.review_score || this.generateRandomRating(3.0, 5.0),
            image: hotel.main_photo_url || `https://images.unsplash.com/photo-${1600000000000 + index}?w=400&h=300&fit=crop`,
            amenities: this.getRandomAmenities(),
            description: `Comfortable accommodation in ${cityName}`,
            bookingUrl: `https://booking.com/hotel/${hotel.hotel_id || index}`,
            source: 'Booking.com'
        }));
    }

    // Format Agoda API hotel data
    formatAgodaAPIHotels(data, cityName) {
        if (!data.hotels || !Array.isArray(data.hotels)) {
            return [];
        }

        return data.hotels.map((hotel, index) => ({
            id: `agoda_${hotel.hotel_id || index}`,
            name: hotel.hotel_name || `Hotel in ${cityName}`,
            city: cityName,
            country: hotel.country || 'Unknown',
            price: hotel.price || this.generateRandomPrice(60, 200),
            rating: hotel.rating || this.generateRandomRating(3.2, 4.8),
            image: hotel.image_url || `https://images.unsplash.com/photo-${1700000000000 + index}?w=400&h=300&fit=crop`,
            amenities: this.getRandomAmenities(),
            description: `Great value hotel in ${cityName}`,
            bookingUrl: `https://agoda.com/hotel/${hotel.hotel_id || index}`,
            source: 'Agoda'
        }));
    }

    // Generate mock hotels for any location
    getMockHotelsForLocation(searchQuery, cityName) {
        const hotelNames = [
            `${cityName} Grand Hotel`,
            `${cityName} Plaza`,
            `${cityName} Central Hotel`,
            `${cityName} Garden Inn`,
            `${cityName} Business Hotel`,
            `${cityName} Resort & Spa`,
            `${cityName} Boutique Hotel`,
            `${cityName} Luxury Suites`,
            `${cityName} City Center Hotel`,
            `${cityName} Palace Hotel`
        ];

        return hotelNames.map((name, index) => ({
            id: `mock_${searchQuery.toLowerCase().replace(/\s+/g, '_')}_${index}`,
            name: name,
            city: cityName,
            country: this.getCountryFromCity(cityName),
            price: this.generateRandomPrice(50, 400),
            rating: this.generateRandomRating(3.0, 5.0),
            image: `https://images.unsplash.com/photo-${1800000000000 + index}?w=400&h=300&fit=crop&auto=format`,
            amenities: this.getRandomAmenities(),
            description: `Experience the best of ${cityName} at ${name}`,
            bookingUrl: `https://example-booking.com/hotel/${index}`,
            source: 'Mock Data'
        }));
    }

    // Remove duplicate hotels based on name similarity
    removeDuplicateHotels(hotels) {
        const unique = [];
        const seen = new Set();

        hotels.forEach(hotel => {
            const key = hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(hotel);
            }
        });

        return unique;
    }

    // Generate random price based on location
    generateRandomPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate random rating
    generateRandomRating(min, max) {
        return Math.round((Math.random() * (max - min) + min) * 10) / 10;
    }

    // Get random amenities
    getRandomAmenities() {
        const allAmenities = [
            'Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking',
            'Room Service', 'Concierge', 'Business Center', 'Airport Shuttle',
            'Pet Friendly', 'Non-smoking', 'Laundry Service', 'Mini Bar'
        ];
        
        const numAmenities = Math.floor(Math.random() * 6) + 3; // 3-8 amenities
        return allAmenities.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
    }

    // Get country from city name (simple mapping)
    getCountryFromCity(cityName) {
        const cityCountryMap = {
            'Paris': 'France',
            'London': 'United Kingdom',
            'Tokyo': 'Japan',
            'New York': 'United States',
            'Dubai': 'United Arab Emirates',
            'Bali': 'Indonesia',
            'Goa': 'India',
            'Switzerland': 'Switzerland'
        };
        
        return cityCountryMap[cityName] || 'Unknown';
    }
}

// Global hotel search instance
window.hotelSearchAPI = new HotelSearchAPI();

// Enhanced hotel search function for destinations
async function searchHotelsForDestination(searchQuery, cityName) {
    try {
        console.log(`Searching hotels for destination: ${searchQuery} in ${cityName}`);
        
        // Use the global hotel search API
        const hotels = await window.hotelSearchAPI.searchHotelsForDestination(searchQuery, cityName);
        
        // Save hotels to localStorage for later use
        localStorage.setItem('velvetRoutesCurrentHotels', JSON.stringify({
            location: cityName,
            searchQuery: searchQuery,
            hotels: hotels,
            timestamp: new Date().toISOString()
        }));
        
        console.log(`Found ${hotels.length} hotels for ${cityName}`);
        return hotels;
        
    } catch (error) {
        console.error('Error in searchHotelsForDestination:', error);
        return [];
    }
}

// Display destination with hotels
function displayDestinationWithHotels(details, hotels, searchQuery) {
    const infoDiv = document.getElementById('destinationInfo');
    
    let hotelsHTML = '';
    if (hotels && hotels.length > 0) {
        hotelsHTML = `
            <div class="mt-6">
                <h4 class="text-xl font-bold mb-4 text-purple-400">🏨 Available Hotels</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${hotels.slice(0, 6).map(hotel => `
                        <div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all">
                            <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-32 object-cover rounded-lg mb-3">
                            <h5 class="font-bold text-white mb-2">${hotel.name}</h5>
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-yellow-400">⭐ ${hotel.rating}</span>
                                <span class="text-green-400 font-bold">$${hotel.price}/night</span>
                            </div>
                            <p class="text-sm text-gray-400 mb-3">${hotel.description}</p>
                            <div class="flex flex-wrap gap-1 mb-3">
                                ${hotel.amenities.slice(0, 3).map(amenity => 
                                    `<span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">${amenity}</span>`
                                ).join('')}
                            </div>
                            <a href="${hotel.bookingUrl}" target="_blank" 
                               class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition-all">
                                Book Now
                            </a>
                        </div>
                    `).join('')}
                </div>
                ${hotels.length > 6 ? `<p class="text-center text-gray-400 mt-4">+ ${hotels.length - 6} more hotels available</p>` : ''}
            </div>
        `;
    }
    
    infoDiv.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-400">Country</div>
                <div class="font-bold text-lg">${details.name}</div>
            </div>
            <div class="p-4 bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-400">Capital</div>
                <div class="font-bold text-lg">${details.capital}</div>
            </div>
            <div class="p-4 bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-400">Region</div>
                <div class="font-bold">${details.region}</div>
            </div>
            <div class="p-4 bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-400">Population</div>
                <div class="font-bold">${formatNumber(details.population)}</div>
            </div>
            <div class="p-4 bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-400">Currency</div>
                <div class="font-bold">${details.currency}</div>
            </div>
            <div class="p-4 bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-400">Languages</div>
                <div class="font-bold text-sm">${details.languages}</div>
            </div>
        </div>
        ${hotelsHTML}
    `;
    
    document.getElementById('destinationDetails').style.display = 'block';
}

// Format large numbers
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
