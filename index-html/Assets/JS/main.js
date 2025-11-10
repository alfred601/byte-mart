document.addEventListener('DOMContentLoaded', () => {
    
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const main = document.querySelector('main');
    const searchInput = document.querySelector('.search-bar input');
    
    // --- 1. Theme Toggle Logic (Simplified) ---
    
    /**
     * Toggles the theme between 'light-mode' and 'dark-mode'.
     */
    function toggleTheme() {
        const isDarkMode = root.classList.contains('dark-mode'); 
        
        if (isDarkMode) {
            root.classList.remove('dark-mode');
            root.classList.add('light-mode');
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light-mode');
        } else {
            root.classList.remove('light-mode');
            root.classList.add('dark-mode');
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark-mode');
        }
    }

    // Attach the event listener to the toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.error("Theme toggle button not found.");
    }
    
    
    // --- 2. Dynamic Year Update ---
    
    /**
     * Updates the copyright year to the current year.
     */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // --- 3. Order Button (Modal) Logic ---
    
    /**
     * Creates and displays a custom modal message.
     */
    function showModal(title, message, whatsappLink) {
        // Ensure only one modal is active
        document.querySelector('.custom-modal-overlay')?.remove();
        
        const modalHTML = `
            <div class="custom-modal-overlay">
                <div class="custom-modal-content">
                    <h3 style="color: var(--color-primary-accent);">${title}</h3>
                    <p>${message}</p>
                    <div style="margin-top: 20px; display: flex; justify-content: space-around;">
                        <button class="modal-close-btn" style="background-color: #ccc; color: var(--color-text);">Close</button>
                        <a href="${whatsappLink}" target="_blank" class="modal-whatsapp-btn primary-btn" style="background-color: var(--color-success);">
                            <i class="fab fa-whatsapp"></i> Chat to Order
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Attach close listener
        document.querySelector('.modal-close-btn').addEventListener('click', () => {
            document.querySelector('.custom-modal-overlay').remove();
        });
        
        // Allow clicking the overlay to close
        document.querySelector('.custom-modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('custom-modal-overlay')) {
                document.querySelector('.custom-modal-overlay').remove();
            }
        });
    }

    /**
     * Attaches click listeners to all '.order-btn' elements.
     */
    function attachOrderButtonListeners() {
        document.querySelectorAll('.order-btn').forEach(button => {
            // Remove any existing listeners before adding new ones (important for search results)
            button.removeEventListener('click', handleOrderClick); 
            button.addEventListener('click', handleOrderClick);
        });
    }

    /**
     * Handle the click event for an order button.
     */
    function handleOrderClick(event) {
        event.preventDefault();
        const card = event.target.closest('.product-card');
        const productName = card?.querySelector('.product-title')?.textContent || 'Unknown Product';
        const productPrice = card?.querySelector('.product-price')?.textContent || 'Price Unknown';
        
        const message = `Hello ByteMart+! I would like to order the **${productName}** priced at ${productPrice}.`;
        
        // Pre-fill the WhatsApp message and link to the dedicated WhatsApp contact
        const whatsappLink = `https://wa.me/256779315934?text=${encodeURIComponent(message)}`;
        
        showModal(
            'Confirm Your Order',
            `You are about to place an order for the ${productName}. Click "Chat to Order" to confirm the purchase on WhatsApp.`,
            whatsappLink
        );
    }
    
    // --- 4. Product Search Logic ---
    
    const allProductCards = Array.from(document.querySelectorAll('.product-card'));
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const productSections = document.querySelectorAll('.product-container'); // All product sections to hide

    /**
     * Filters products based on search input and updates the display.
     */
    const filterProducts = () => {
        if (!searchInput) return;
        
        const query = searchInput.value.trim().toLowerCase();
        
        // Clear previous results
        searchResultsGrid.innerHTML = '';

        if (query === '') {
            // Search inactive: Show main sections
            searchResultsContainer.style.display = 'none';
            productSections.forEach(section => section.style.display = 'block');
            return;
        }

        // Search active: Hide main sections
        productSections.forEach(section => section.style.display = 'none');
        searchResultsContainer.style.display = 'block';

        const filteredCards = allProductCards.filter(card => {
            // Check the data attribute added in the HTML
            const productName = card.getAttribute('data-product-name')?.toLowerCase();
            return productName && productName.includes(query); 
        });

        if (filteredCards.length > 0) {
            // Append the found cards (clones) to the results grid
            filteredCards.forEach(card => {
                // We clone the card so the original remains in its section
                const clonedCard = card.cloneNode(true);
                searchResultsGrid.appendChild(clonedCard);
            });
            // NEW: Must re-attach listeners to the cloned cards
            attachOrderButtonListeners(); 
        } else {
            // Display a "No results" message
            searchResultsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 1.2rem; color: var(--color-text);">No products found matching "' + query + '".</p>';
        }
    };

    // Attach the filtering function to the input event
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    
    // --- Initial Load ---
    
    // Since products are in HTML, we only need to attach listeners once.
    // This handles the original product cards that are visible on load.
    attachOrderButtonListeners(); 
});