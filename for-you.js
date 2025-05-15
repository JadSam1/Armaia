document.addEventListener('DOMContentLoaded', function() {
    // View mode toggle
    const gridViewBtn = document.querySelector('.grid-view');
    const phoneViewBtn = document.querySelector('.phone-view');
    const videoGrid = document.querySelector('.video-grid');
    
    gridViewBtn.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            // Switch to grid view
            this.classList.add('active');
            phoneViewBtn.classList.remove('active');
            videoGrid.classList.remove('phone-view');
            
            // Re-layout might affect video visibility, so we need to refresh observers
            videoObserver.disconnect();
            videos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    });
    
    phoneViewBtn.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            // Switch to phone view
            this.classList.add('active');
            gridViewBtn.classList.remove('active');
            videoGrid.classList.add('phone-view');
            
            // Re-layout might affect video visibility, so we need to refresh observers
            videoObserver.disconnect();
            videos.forEach(video => {
                videoObserver.observe(video);
            });
        }
    });
    
    // Dropdown menu functionality (reusing from index page)
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const menu = parent.querySelector('.dropdown-menu');
            
            // Close all other open dropdowns
            document.querySelectorAll('.dropdown-menu.active').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('active');
                }
            });
            
            // Toggle the current dropdown
            if (menu) {
                menu.classList.toggle('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
    
    // Video autoplay functionality
    const videos = document.querySelectorAll('.video-container video');
    let activeVideo = null;
    
    // Make sure videos are loaded properly
    videos.forEach(video => {
        // Set preload attribute
        video.preload = "metadata";
        
        // Force load the first frame
        video.load();
        
        // Attempt to play after user interaction
        document.addEventListener('click', function() {
            if (video.paused && isElementInViewport(video)) {
                video.play().catch(e => console.log("Autoplay prevented:", e));
            }
        }, { once: true });
    });
    
    // Create an Intersection Observer to detect when videos are in view
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            // Lazy load video when in view
            if (entry.isIntersecting) {
                // Play video when in view after a small delay to help initial loading
                setTimeout(() => {
                    // If there's an active video, pause it
                    if (activeVideo && activeVideo !== video) {
                        activeVideo.pause();
                    }
                    
                    // Play the current video
                    if (video.paused) {
                        video.play()
                          .then(() => {
                              activeVideo = video;
                          })
                          .catch(error => {
                              console.log("Autoplay prevented:", error);
                          });
                    }
                }, 100);
            } else {
                // Pause video when out of view
                if (!video.paused) {
                    video.pause();
                    if (activeVideo === video) {
                        activeVideo = null;
                    }
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // 30% of the video is visible to trigger
    });
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Observe all videos
    videos.forEach(video => {
        videoObserver.observe(video);
        
        // Add loaded class to hide spinner once video is loaded
        video.addEventListener('loadeddata', function() {
            this.parentElement.classList.add('loaded');
        });
        
        // Toggle sound on click
        video.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.muted) {
                this.muted = false;
            } else {
                this.muted = true;
            }
        });
    });
    
    // Handle like button clicks
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Update like count
            const countElement = this.querySelector('.count');
            let count = parseInt(countElement.textContent);
            
            if (this.classList.contains('active')) {
                count += 1;
            } else {
                count -= 1;
            }
            
            countElement.textContent = count;
        });
    });
    
    // Handle share button functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this ARMAIA fashion look!',
                    text: 'I found this amazing fashion look on ARMAIA.',
                    url: window.location.href
                })
                .catch(error => console.log('Error sharing:', error));
            } else {
                alert('Sharing is not supported on this browser. You can copy the URL to share.');
            }
        });
    });
    
    // Handle shop button clicks with improved touch support
    const shopButtons = document.querySelectorAll('.shop-btn');
    
    shopButtons.forEach((button, index) => {
        // Add touchstart event for better mobile response
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Shop button touched for video index:", index);
            
            try {
                // Instead of showing product modal directly, show product selection page
                showProductSelectionPage(index);
            } catch (error) {
                console.error("Error showing product selection page:", error);
                // Make sure body scroll is restored if there's an error
                document.body.style.overflow = '';
            }
        });
        
        // Keep regular click event for non-touch devices
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Shop button clicked for video index:", index);
            
            try {
                // Instead of showing product modal directly, show product selection page
                showProductSelectionPage(index);
            } catch (error) {
                console.error("Error showing product selection page:", error);
                // Make sure body scroll is restored if there's an error
                document.body.style.overflow = '';
            }
        });
    });
    
    // Function to show the product selection page
    function showProductSelectionPage(videoIndex) {
        console.log("Showing product selection page for video index:", videoIndex);
        
        try {
            // Get the current scroll position
            const scrollY = window.scrollY || window.pageYOffset;
            
            // Create data for multiple products in the video
            const videoProducts = getVideoProducts(videoIndex);
            console.log("Products found:", videoProducts.length);
            
            // Create the product selection overlay
            let selectionOverlay = document.getElementById('product-selection-overlay');
            if (!selectionOverlay) {
                selectionOverlay = document.createElement('div');
                selectionOverlay.id = 'product-selection-overlay';
                selectionOverlay.className = 'product-selection-overlay';
                document.body.appendChild(selectionOverlay);
                console.log("Created new selection overlay element");
            } else {
                console.log("Using existing selection overlay element");
            }
            
            // Create the content
            let productsHTML = '';
            videoProducts.forEach((product, idx) => {
                productsHTML += `
                    <div class="product-card" data-product-index="${idx}" data-video-index="${videoIndex}">
                        <div class="product-card-image">
                            ${product.hasImage 
                                ? `<img src="${product.image}" alt="${product.name}">` 
                                : `<div class="product-card-placeholder"></div>`
                            }
                        </div>
                        <div class="product-card-info">
                            <h3 class="product-card-name">${product.name}</h3>
                            <div class="product-card-price">${product.price}</div>
                        </div>
                    </div>
                `;
            });
            
            // Set the content
            selectionOverlay.innerHTML = `
                <div class="selection-container">
                    <div class="selection-header">
                        <h2>Shop the Look</h2>
                        <button class="close-selection">&times;</button>
                    </div>
                    <div class="selection-content">
                        <div class="products-grid">
                            ${productsHTML}
                        </div>
                    </div>
                </div>
            `;
            
            // Ensure the overlay is correctly positioned in the viewport
            selectionOverlay.style.top = "0";
            selectionOverlay.style.left = "0";
            
            // iOS Safari fix for fixed positioning
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                selectionOverlay.style.position = 'absolute';
                selectionOverlay.style.height = '100%';
                selectionOverlay.style.width = '100%';
            }
            
            // Prevent body scroll and store the current position
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            
            // Show the overlay with animation - ensure it's visible
            selectionOverlay.style.display = 'flex';
            
            // Force a reflow before adding the active class for better animation
            void selectionOverlay.offsetWidth;
            
            setTimeout(() => {
                selectionOverlay.classList.add('active');
                console.log("Selection overlay activated");
            }, 10);
            
            // Add event listeners
            const closeBtn = selectionOverlay.querySelector('.close-selection');
            closeBtn.addEventListener('click', () => {
                console.log("Close selection clicked");
                selectionOverlay.classList.remove('active');
                
                // Reset body position after animation completes
                setTimeout(() => {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    
                    // Restore scroll position
                    window.scrollTo(0, scrollY);
                }, 400);
            });
            
            // Add click event for product cards
            const productCards = selectionOverlay.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.addEventListener('click', function() {
                    const productIndex = parseInt(this.dataset.productIndex);
                    const videoIdx = parseInt(this.dataset.videoIndex);
                    console.log("Product card clicked:", productIndex, "from video:", videoIdx);
                    
                    // Get the specific product
                    const selectedProduct = getVideoProducts(videoIdx)[productIndex];
                    
                    // Hide selection overlay
                    selectionOverlay.classList.remove('active');
                    
                    // Reset body styles but save scroll position for the product modal
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    
                    // Restore scroll position
                    window.scrollTo(0, scrollY);
                    
                    // Show the detailed product modal
                    showProductModal(selectedProduct, scrollY);
                });
            });
            
            // Close overlay when clicking outside the content
            selectionOverlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    console.log("Clicked outside selection content, closing");
                    this.classList.remove('active');
                    
                    // Reset body position after animation completes
                    setTimeout(() => {
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        
                        // Restore scroll position
                        window.scrollTo(0, scrollY);
                    }, 400);
                }
            });
        } catch (error) {
            console.error("Error in showProductSelectionPage:", error);
            // Make sure body scroll is restored
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        }
    }
    
    // Function to get multiple products for each video
    function getVideoProducts(videoIndex) {
        // Define products for each video
        const productsForVideos = [
            // Video 1 products
            [
                {
                    name: "White Fluffy Cotton Jacket",
                    price: "$129.99",
                    description: "Luxurious white fluffy cotton jacket with a cozy textured finish. Features a relaxed silhouette, convenient front pockets, and premium quality cotton blend for both comfort and style. A perfect statement piece for your winter and spring wardrobe.",
                    image: "images/product-1.jpg",
                    hasImage: true,
                    productUrl: "https://www.zara.com/us/en/faux-fur-jacket-zw-collection-p04360246.html?v1=423952311&utm_source=google&utm_medium=cpc&gad_source=1&gad_campaignid=21616137796&gbraid=0AAAAADqbk7ZNs7fVZ-i0TRcnUsR_g9DVs&gclid=CjwKCAjw24vBBhABEiwANFG7yz6spdbWO9OPWIUeddzrhH-7a_Xy63w3rv_cEGeR_l57rGUUpCRNRBoCm7IQAvD_BwE"
                },
                {
                    name: "Slim-Fit Grey Jeans",
                    price: "$49.99",
                    description: "Versatile slim-fit grey jeans with stretch for exceptional comfort. Perfect for casual outings or dressed up with a blazer for a smart-casual look.",
                    image: "images/product-2.jpg",
                    hasImage: true,
                    productUrl: "https://www2.hm.com/en_us/productpage.1263923003.html"
                },
                {
                    name: "Golden Goose Superstar Sneakers",
                    price: "$495.00",
                    description: "Iconic Golden Goose Superstar sneakers featuring the signature distressed finish and star detail. Handcrafted in Italy with premium leather, these shoes offer both comfort and distinctive style for casual luxury.",
                    image: "images/product-3.jpg",
                    hasImage: true,
                    productUrl: "https://www.goldengoose.com/us/en/superstar-sneakers-in-leather-with-suede-star-GWF00102.F002143.80203.html"
                }
            ],
            // Video 2 products
            [
                {
                    name: "Office to Evening Ensemble",
                    price: "$149.99",
                    description: "Versatile outfit perfect for transitioning from work to evening events.",
                    image: "images/product-2.jpg",
                    hasImage: true,
                    productUrl: "https://www.zara.com"
                },
                {
                    name: "Structured Blazer",
                    price: "$129.99",
                    description: "Tailored blazer with subtle shoulder padding for a structured silhouette.",
                    image: "images/product-2-blazer.jpg",
                    hasImage: false,
                    productUrl: "https://www.zara.com"
                }
            ],
            // Video 3 products
            [
                {
                    name: "Seasonal Accessories Bundle",
                    price: "$89.99",
                    description: "This season's must-have accessories to complete any outfit.",
                    image: "images/product-3.jpg",
                    hasImage: false,
                    productUrl: "https://www.zara.com"
                },
                {
                    name: "Leather Tote Bag",
                    price: "$159.99",
                    description: "Spacious leather tote with interior pockets. Perfect for work or weekend outings.",
                    image: "images/product-3-bag.jpg",
                    hasImage: false,
                    productUrl: "https://www.zara.com"
                },
                {
                    name: "Gold Hoop Earrings",
                    price: "$39.99",
                    description: "Classic gold-plated hoop earrings. Lightweight and comfortable for all-day wear.",
                    image: "images/product-3-earrings.jpg",
                    hasImage: false,
                    productUrl: "https://www.zara.com"
                }
            ]
        ];
        
        return productsForVideos[videoIndex] || productsForVideos[0];
    }
    
    // Function to get product information for single product view (for backward compatibility)
    function getProductInfo(index) {
        // Return the first product from each video's collection for backward compatibility
        return getVideoProducts(index)[0];
    }
    
    // Function to display product modal
    function showProductModal(product, scrollY) {
        console.log("Showing product modal for:", product.name);
        
        try {
            // Use passed scrollY or get current scroll position
            const currentScrollY = scrollY !== undefined ? scrollY : (window.scrollY || window.pageYOffset);
            
            // Check if modal already exists
            let modal = document.getElementById('product-modal');
            
            // Create modal if it doesn't exist
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'product-modal';
                modal.className = 'product-modal';
                document.body.appendChild(modal);
                console.log("Created new product modal");
            } else {
                console.log("Using existing product modal");
            }
            
            // Prepare the image HTML based on whether the product has an image
            let imageHtml = '';
            if (product.hasImage) {
                imageHtml = `<img src="${product.image}" alt="${product.name}" class="product-image-content">`;
            } else {
                imageHtml = `<div class="product-placeholder">Product image not available</div>`;
            }
            
            // Set modal content
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${product.name}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="product-image">
                            ${imageHtml}
                        </div>
                        <div class="product-details">
                            <div class="product-price">${product.price}</div>
                            <p class="product-description">${product.description}</p>
                            <div class="product-options">
                                <div class="size-selector">
                                    <label>Size:</label>
                                    <div class="size-options">
                                        <button class="size-option">S</button>
                                        <button class="size-option">M</button>
                                        <button class="size-option">L</button>
                                        <button class="size-option">XL</button>
                                    </div>
                                </div>
                                <div class="quantity-selector">
                                    <label>Quantity:</label>
                                    <div class="quantity-controls">
                                        <button class="quantity-decrease">-</button>
                                        <span class="quantity-value">1</span>
                                        <button class="quantity-increase">+</button>
                                    </div>
                                </div>
                            </div>
                            <button class="buy-now-btn">Buy Now</button>
                            <button class="find-availability-btn">Find Nearby Availability</button>
                        </div>
                    </div>
                </div>
                <div class="availability-overlay">
                    <div class="availability-container">
                        <div class="availability-header">
                            <h3>Nearby Store Availability</h3>
                            <button class="close-availability">&times;</button>
                        </div>
                        <div class="availability-content">
                            <div class="store-list">
                                <!-- Store availability will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Ensure the modal is correctly positioned in the viewport
            modal.style.top = "0";
            modal.style.left = "0";
            
            // Prevent body scroll and store the current position
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${currentScrollY}px`;
            document.body.style.width = '100%';
            
            // Show modal - ensure it's visible
            modal.style.display = 'flex';
            
            // Force a reflow before adding the active class for better animation
            void modal.offsetWidth;
            
            modal.classList.add('active');
            console.log("Modal activated");
            
            // Store availability data - normally this would come from an API
            const storeAvailabilityData = [
                {
                    name: "Mall of the Emirates",
                    distance: "5.2 km",
                    address: "Sheikh Zayed Road, Al Barsha, Dubai, UAE",
                    availability: {
                        "S": "in_stock",
                        "M": "in_stock",
                        "L": "limited",
                        "XL": "out_of_stock"
                    }
                },
                {
                    name: "Dubai Mall",
                    distance: "12.7 km",
                    address: "Financial Centre Road, Downtown Dubai, UAE",
                    availability: {
                        "S": "limited",
                        "M": "in_stock",
                        "L": "in_stock",
                        "XL": "in_stock"
                    }
                },
                {
                    name: "City Centre Mirdif",
                    distance: "18.3 km",
                    address: "Sheikh Mohammed Bin Zayed Road, Mirdif, Dubai, UAE",
                    availability: {
                        "S": "out_of_stock",
                        "M": "limited",
                        "L": "out_of_stock",
                        "XL": "limited"
                    }
                },
                {
                    name: "Dubai Festival City Mall",
                    distance: "15.8 km",
                    address: "Dubai Festival City, Ras Al Khor, Dubai, UAE",
                    availability: {
                        "S": "in_stock",
                        "M": "out_of_stock",
                        "L": "in_stock",
                        "XL": "out_of_stock"
                    }
                }
            ];
            
            // Function to update the store list based on selected size
            function updateStoreAvailability(size) {
                const storeList = modal.querySelector('.store-list');
                storeList.innerHTML = '';
                
                storeAvailabilityData.forEach(store => {
                    const availabilityStatus = store.availability[size];
                    let statusClass = '';
                    let statusText = '';
                    
                    switch(availabilityStatus) {
                        case 'in_stock':
                            statusClass = 'status-available';
                            statusText = 'In Stock';
                            break;
                        case 'limited':
                            statusClass = 'status-limited';
                            statusText = 'Limited Stock';
                            break;
                        case 'out_of_stock':
                            statusClass = 'status-unavailable';
                            statusText = 'Unavailable';
                            break;
                        default:
                            statusClass = 'status-unavailable';
                            statusText = 'Unavailable';
                    }
                    
                    storeList.innerHTML += `
                        <div class="store-item">
                            <div class="store-details">
                                <h4 class="store-name">${store.name}</h4>
                                <p class="store-distance">${store.distance}</p>
                                <p class="store-address">${store.address}</p>
                            </div>
                            <div class="store-availability ${statusClass}">
                                <span class="availability-indicator"></span>
                                <span class="availability-text">Size ${size}: ${statusText}</span>
                            </div>
                        </div>
                    `;
                });
            }
            
            // Close modal when clicking the close button
            modal.querySelector('.close-modal').addEventListener('click', function() {
                console.log("Close modal clicked");
                modal.classList.remove('active');
                
                // Reset body position after animation completes
                setTimeout(() => {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    
                    // Restore scroll position
                    window.scrollTo(0, currentScrollY);
                }, 400); // Match the CSS transition duration
            });
            
            // Close modal when clicking outside the content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    console.log("Clicked outside modal, closing");
                    modal.classList.remove('active');
                    
                    // Reset body position after animation completes
                    setTimeout(() => {
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        
                        // Restore scroll position
                        window.scrollTo(0, currentScrollY);
                    }, 400); // Match the CSS transition duration
                }
            });
            
            // Handle Find Nearby Availability button
            modal.querySelector('.find-availability-btn').addEventListener('click', function() {
                const selectedSize = modal.querySelector('.size-option.active')?.textContent || 'M';
                updateStoreAvailability(selectedSize);
                modal.querySelector('.availability-overlay').classList.add('active');
            });
            
            // Handle close availability overlay
            modal.querySelector('.close-availability').addEventListener('click', function() {
                modal.querySelector('.availability-overlay').classList.remove('active');
            });
            
            // Close availability overlay when clicking outside the container
            modal.querySelector('.availability-overlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
            
            // Handle size selection
            const sizeButtons = modal.querySelectorAll('.size-option');
            sizeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    sizeButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // If the availability overlay is open, update it with the new size
                    if (modal.querySelector('.availability-overlay').classList.contains('active')) {
                        updateStoreAvailability(this.textContent);
                    }
                });
            });
            
            // Handle quantity increase
            modal.querySelector('.quantity-increase').addEventListener('click', function() {
                const quantityValue = modal.querySelector('.quantity-value');
                let quantity = parseInt(quantityValue.textContent);
                quantity = Math.min(quantity + 1, 10); // Max 10 items
                quantityValue.textContent = quantity;
            });
            
            // Handle quantity decrease
            modal.querySelector('.quantity-decrease').addEventListener('click', function() {
                const quantityValue = modal.querySelector('.quantity-value');
                let quantity = parseInt(quantityValue.textContent);
                quantity = Math.max(quantity - 1, 1); // Min 1 item
                quantityValue.textContent = quantity;
            });
            
            // Handle Buy Now button
            modal.querySelector('.buy-now-btn').addEventListener('click', function() {
                const size = modal.querySelector('.size-option.active')?.textContent || 'M';
                const quantity = modal.querySelector('.quantity-value').textContent;
                
                // Redirect to the product URL
                if (product.productUrl) {
                    // Open in a new tab
                    window.open(product.productUrl, '_blank');
                } else {
                    alert(`Proceeding to checkout with ${quantity} ${product.name} (Size: ${size})`);
                }
                
                modal.classList.remove('active');
                
                // Reset body position
                setTimeout(() => {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    
                    // Restore scroll position
                    window.scrollTo(0, currentScrollY);
                }, 400);
            });
            
            // Set first size option as active by default
            const firstSizeOption = modal.querySelector('.size-option');
            if (firstSizeOption) {
                firstSizeOption.classList.add('active');
            }
        } catch (error) {
            console.error("Error in showProductModal:", error);
            // Make sure body scroll is restored if there's an error
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Try to restore scroll position if we have it
            if (scrollY !== undefined) {
                window.scrollTo(0, scrollY);
            }
        }
    }
}); 