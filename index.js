document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const modal = document.getElementById('myModal');
    const cartCount = document.querySelector('.cart-count');
    const searchInput = document.querySelector('input[type="search"]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');

    // Initialize cart items from localStorage or set to 0 if not exist
    let cartItems = parseInt(localStorage.getItem('cartItems')) || 0;

    // Function to update cart count
    function updateCart() {
        cartItems++;
        localStorage.setItem('cartItems', cartItems);
        updateCartDisplay();
        openModal();
    }

    // Function to update cart count display
    function updateCartDisplay() {
        cartCount.textContent = cartItems;
    }

    // Initial update of cart display
    updateCartDisplay();

    // Add to Cart button functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor behavior
            updateCart();
            
            // Button click animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });

    // Filter products
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            productItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Toggle active class on filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        navbar.style.backgroundColor = window.scrollY > 50 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';
        navbar.style.padding = window.scrollY > 50 ? '0.5rem 1rem' : '1rem';
    });

    // Search input placeholder handling
    searchInput.addEventListener('focus', function() {
        this.placeholder = '';
    });
    
    searchInput.addEventListener('blur', function() {
        this.placeholder = 'Search';
    });

    // Open modal function
    function openModal() {
        modal.style.display = 'block';
    }

    // Close modal on clicking outside or close button
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    const closeButton = modal.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});