// Global object to store all travel data
let travelData = {
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

// Utility functions
async function saveTravelData() {
    // Save to localStorage for immediate access
    localStorage.setItem('velvetRoutesData', JSON.stringify(travelData));
    
    // Try to save to API if available
    if (typeof window.VelvetAPI !== 'undefined') {
        try {
            await window.VelvetAPI.saveTravelDataEnhanced(travelData);
        } catch (error) {
            console.warn('Could not save to API:', error);
            // Continue with localStorage if API fails
        }
    }
}

async function loadTravelData() {
    // Try to load from API first if available
    if (typeof window.VelvetAPI !== 'undefined') {
        try {
            const loadedData = await window.VelvetAPI.loadTravelDataEnhanced();
            if (loadedData) {
                travelData = { ...travelData, ...loadedData };
            }
            return;
        } catch (error) {
            console.warn('Could not load from API:', error);
        }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('velvetRoutesData');
    if (saved) {
        travelData = { ...travelData, ...JSON.parse(saved) };
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            }
            .notification-info { background: #3b82f6; color: white; }
            .notification-success { background: #10b981; color: white; }
            .notification-error { background: #ef4444; color: white; }
            .notification-warning { background: #f59e0b; color: white; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 20px;
                cursor: pointer;
                margin-left: 10px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Function to handle destination selection from pre-set cards
function selectDestination(name, budget, id) {
    // Remove 'selected' class from all cards
    const allCards = document.querySelectorAll('.destination-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Find the specific card that was clicked and add the 'selected' class
    const selectedCard = document.querySelector(`.destination-card[onclick*='${id}']`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Update global data object
    travelData.destination = name;
    travelData.budget = budget;
    
    // Update the display
    const selectedDestElement = document.getElementById('selectedDestination');
    const selectedBudgetElement = document.getElementById('selectedBudget');
    
    if (selectedDestElement) {
        selectedDestElement.innerText = name;
    }
    if (selectedBudgetElement) {
        selectedBudgetElement.innerText = `Estimated Budget: ${budget}`;
    }

    // Enable the "Continue" button
    const nextButton = document.getElementById('nextToStep2');
    if (nextButton) {
        nextButton.disabled = false;
    }

    // Save data and show notification
    saveTravelData();
    showNotification(`${name} has been selected!`, 'success');
}

// Function to handle the custom destination search
function searchDestination() {
    const customInput = document.getElementById('customDestination');
    const destination = customInput.value.trim();

    if (destination) {
        const budget = 'Varies based on location';
        
        // Remove 'selected' class from all pre-set cards
        const allCards = document.querySelectorAll('.destination-card');
        allCards.forEach(card => card.classList.remove('selected'));

        // Update global data object
        travelData.destination = destination;
        travelData.budget = budget;

        // Update the display
        const selectedDestElement = document.getElementById('selectedDestination');
        const selectedBudgetElement = document.getElementById('selectedBudget');
        
        if (selectedDestElement) {
            selectedDestElement.innerText = destination;
        }
        if (selectedBudgetElement) {
            selectedBudgetElement.innerText = `Estimated Budget: ${budget}`;
        }
        
        // Enable the "Continue" button
        const nextButton = document.getElementById('nextToStep2');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        // Save data and show notification
        saveTravelData();
        showNotification(`${destination} has been selected!`, 'success');
        customInput.value = ''; // Clear the input field
    } else {
        showNotification("Please enter a destination to search.", 'warning');
    }
}

// Function to navigate to the next step
function nextStep(stepNumber) {
    // Check if a destination has been selected before proceeding
    if (!travelData.destination) {
        showNotification("Please select or search for a destination first.", 'warning');
        return;
    }

    // Redirect to the appropriate page based on the step number
    const pageMap = {
        1: 'planner.html',
        2: 'dates_and_budget.html',
        3: 'transport.html',
        4: 'hotel.html',
        5: 'summary.html'
    };

    const targetPage = pageMap[stepNumber];
    if (targetPage) {
        window.location.href = targetPage;
    }
}

// Navigation helper function
function navigateToPage(pageName) {
    const validPages = {
        'home': 'home.html',
        'planner': 'planner.html',
        'dates': 'dates_and_budget.html',
        'transport': 'transport.html',
        'hotel': 'hotel.html',
        'summary': 'summary.html',
        'login': 'login.html',
        'about': 'AboutUS.html',
        'contact': 'Contact.html'
    };

    const targetPage = validPages[pageName.toLowerCase()];
    if (targetPage) {
        window.location.href = targetPage;
    } else {
        showNotification(`Page "${pageName}" not found.`, 'error');
    }
}

// Function to load the saved destination on page load
function loadSavedDestination() {
    loadTravelData();
        
    if (travelData.destination) {
        // Update the display with saved data
        const selectedDestElement = document.getElementById('selectedDestination');
        const selectedBudgetElement = document.getElementById('selectedBudget');
        
        if (selectedDestElement) {
            selectedDestElement.innerText = travelData.destination;
        }
        if (selectedBudgetElement) {
            selectedBudgetElement.innerText = `Estimated Budget: ${travelData.budget}`;
        }
        
        // Enable the button
        const nextButton = document.getElementById('nextToStep2');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        // Find the matching card and highlight it
        const allCards = document.querySelectorAll('.destination-card');
        allCards.forEach(card => {
            if (card.textContent.includes(travelData.destination)) {
                card.classList.add('selected');
            }
        });
    }
}

// Event listener for the "Enter" key on the custom search input
document.addEventListener('DOMContentLoaded', () => {
    loadSavedDestination(); // Load saved data on page load

    const customDestinationInput = document.getElementById('customDestination');
    if (customDestinationInput) {
        customDestinationInput.addEventListener('keypress', function(event) {
            // Check if the pressed key is 'Enter' (key code 13)
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission behavior
                searchDestination();
            }
        });
    }
});

// The following functions are for the other steps (2, 3, 4, 5) of your planner.
// I have kept them here in case your other pages (dates-budget.html etc.)
// are using them. If not, they can be removed.

function calculateDuration() {
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    if (departureDate && returnDate) {
        const departure = new Date(departureDate);
        const returnD = new Date(returnDate);
        const timeDiff = returnD.getTime() - departure.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff > 0) {
            travelData.departureDate = departureDate;
            travelData.returnDate = returnDate;
            travelData.duration = dayDiff;
            
            const tripDurationElement = document.getElementById('tripDuration');
            if (tripDurationElement) {
                tripDurationElement.textContent = `${dayDiff} days`;
            }
            
            saveTravelData();
            checkStep2Complete();
        } else {
            const tripDurationElement = document.getElementById('tripDuration');
            if (tripDurationElement) {
                tripDurationElement.textContent = 'Invalid dates';
            }
            showNotification('Return date must be after departure date.', 'error');
        }
    }
}

function selectBudget(budgetType, minCost, maxCost) {
    document.querySelectorAll('.budget-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = event.target.closest('.budget-option');
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    travelData.budget = budgetType;
    travelData.budgetRange = { min: minCost, max: maxCost };
    
    saveTravelData();
    showNotification(`Budget range selected: ${budgetType}`, 'success');
    checkStep2Complete();
}

function checkStep2Complete() {
    const nextButton = document.getElementById('nextToStep3');
    if (nextButton) {
        const isComplete = travelData.departureDate && travelData.returnDate && travelData.budget;
        nextButton.disabled = !isComplete;
        
        if (isComplete) {
            nextButton.classList.remove('disabled');
            showNotification('Step 2 completed! You can proceed to transport selection.', 'success');
        }
    }
}

function selectTransport(flightClass, minCost, maxCost) {
    document.querySelectorAll('.transport-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = event.target.closest('.transport-option');
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    travelData.flightClass = flightClass;
    travelData.flightCost = { min: minCost, max: maxCost };
    
    saveTravelData();
    showNotification(`Flight class selected: ${flightClass}`, 'success');
    checkStep3Complete();
}

function selectLocalTransport(transportType, minCost, maxCost) {
    travelData.localTransport = transportType;
    travelData.localTransportCost = { min: minCost, max: maxCost };
    
    saveTravelData();
    showNotification(`Local transport selected: ${transportType}`, 'success');
    checkStep3Complete();
}

function checkStep3Complete() {
    const nextButton = document.getElementById('nextToStep4');
    if (nextButton) {
        const isComplete = travelData.flightClass && travelData.localTransport;
        nextButton.disabled = !isComplete;
        
        if (isComplete) {
            nextButton.classList.remove('disabled');
            showNotification('Step 3 completed! You can proceed to hotel selection.', 'success');
        }
    }
}

function selectAccommodation(hotelType, minCost, maxCost) {
    document.querySelectorAll('.accommodation-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = event.target.closest('.accommodation-option');
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    travelData.hotel = hotelType;
    travelData.hotelCost = { min: minCost, max: maxCost };
    
    saveTravelData();
    showNotification(`Accommodation selected: ${hotelType}`, 'success');
    checkStep4Complete();
}

function checkStep4Complete() {
    const nextButton = document.getElementById('nextToStep5');
    if (nextButton) {
        const isComplete = travelData.hotel;
        nextButton.disabled = !isComplete;
        
        if (isComplete) {
            nextButton.classList.remove('disabled');
            showNotification('Step 4 completed! You can proceed to summary.', 'success');
        }
    }
}

function generateSummary() {
    // Update summary elements if they exist
    const elements = {
        'summaryDestination': travelData.destination,
        'summaryDates': `${travelData.departureDate} to ${travelData.returnDate}`,
        'summaryTravelers': `${travelData.adults} Adults, ${travelData.children} Children, ${travelData.infants} Infants`,
        'summaryFlight': travelData.flightClass,
        'summaryHotel': travelData.hotel
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Calculate total cost
    calculateTotalCost();
}

function setDuration(days) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    const departureInput = document.getElementById('departureDate');
    const returnInput = document.getElementById('returnDate');
    
    if (departureInput && returnInput) {
        const departureDateStr = today.toISOString().split('T')[0];
        const returnDateStr = futureDate.toISOString().split('T')[0];
        
        departureInput.value = departureDateStr;
        returnInput.value = returnDateStr;
        
        calculateDuration();
    }
}

function updateTotalCost() {
    const adults = parseInt(document.getElementById('adults')?.value || 2);
    const children = parseInt(document.getElementById('children')?.value || 0);
    
    travelData.adults = adults;
    travelData.children = children;
    
    saveTravelData();
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.planner-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the selected step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update active button
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.getElementById(`step${stepNumber}-btn`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateTotalCost() {
    let totalCost = 0;
    
    // Add flight cost
    if (travelData.flightCost) {
        totalCost += (travelData.flightCost.min + travelData.flightCost.max) / 2;
    }
    
    // Add hotel cost (per night * duration)
    if (travelData.hotelCost && travelData.duration) {
        const avgHotelCost = (travelData.hotelCost.min + travelData.hotelCost.max) / 2;
        totalCost += avgHotelCost * travelData.duration;
    }
    
    // Add local transport cost
    if (travelData.localTransportCost && travelData.duration) {
        const avgTransportCost = (travelData.localTransportCost.min + travelData.localTransportCost.max) / 2;
        totalCost += avgTransportCost * travelData.duration;
    }
    
    travelData.totalCost = Math.round(totalCost);
    
    const totalCostElement = document.getElementById('totalCost');
    if (totalCostElement) {
        totalCostElement.textContent = `$${travelData.totalCost}`;
    }
}

// Hotel booking functions
function bookHotel(hotelId) {
    const hotelData = {
        id: hotelId,
        name: document.querySelector(`[onclick*="${hotelId}"] .hotel-name`)?.textContent || 'Selected Hotel',
        price: document.querySelector(`[onclick*="${hotelId}"] .price-amount`)?.textContent || '$0'
    };
    
    travelData.selectedHotel = hotelData;
    saveTravelData();
    
    showNotification(`Hotel "${hotelData.name}" has been selected for booking!`, 'success');
    
    // Simulate booking process
    setTimeout(() => {
        showNotification('Redirecting to secure checkout...', 'info');
        // Here you would redirect to a payment page
    }, 2000);
}

function toggleWishlist(button) {
    button.classList.toggle('active');
    const isActive = button.classList.contains('active');
    button.innerHTML = isActive ? '♥' : '♡';
    
    if (isActive) {
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Removed from wishlist', 'info');
    }
}

// Initialize page data when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTravelData();
    
    // Load saved destination
    loadSavedDestination();
    
    // Generate summary if on summary page
    if (document.getElementById('summaryDestination')) {
        generateSummary();
    }
    
    // Set up event listeners for custom destination search
    const customDestinationInput = document.getElementById('customDestination');
    if (customDestinationInput) {
        customDestinationInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchDestination();
            }
        });
    }
    
    // Set up date validation
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (departureDateInput) {
        departureDateInput.addEventListener('change', calculateDuration);
    }
    if (returnDateInput) {
        returnDateInput.addEventListener('change', calculateDuration);
    }
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('button[onclick*="nextStep"], button[onclick*="proceed"]').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.destination-card, .budget-option, .transport-option, .accommodation-option').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add progress tracking
    updateProgressBar();
});

// Progress tracking function
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    let completedSteps = 0;
    const totalSteps = 5;
    
    if (travelData.destination) completedSteps++;
    if (travelData.departureDate && travelData.returnDate && travelData.budget) completedSteps++;
    if (travelData.flightClass && travelData.localTransport) completedSteps++;
    if (travelData.hotel) completedSteps++;
    if (travelData.selectedHotel) completedSteps++;
    
    const progress = (completedSteps / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
    
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${completedSteps}/${totalSteps} steps completed`;
    }
}

// Export data function for sharing
function exportTravelData() {
    const dataToExport = {
        ...travelData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'velvet-routes-travel-plan.json';
    link.click();
    
    showNotification('Travel plan exported successfully!', 'success');
}

// Import data function
function importTravelData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            travelData = { ...travelData, ...importedData };
            saveTravelData();
            showNotification('Travel plan imported successfully!', 'success');
            location.reload(); // Refresh to show imported data
        } catch (error) {
            showNotification('Error importing file. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);
}
