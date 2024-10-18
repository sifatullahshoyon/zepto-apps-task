// Function to show loading spinner
function showLoadingSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block'; // Display spinner
}

// Function to hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'none'; // Hide spinner
}

// Function to load wishlist products from localStorage and display them on wishlist.html
function displayWishlistProducts() {
    const wishlistContainer = document.getElementById('wishlist-container');
    const wishlist = getWishlistFromLocalStorage(); // Get wishlist products from localStorage

    // Clear existing content
    wishlistContainer.innerHTML = '';

    // Show loading spinner before loading the products
    showLoadingSpinner();

    setTimeout(() => {
        // Check if the wishlist is empty
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = "<p>Your wishlist is empty!</p>";
            hideLoadingSpinner(); // Hide spinner once data is loaded
            return;
        }

        // Display each product in the wishlist
        wishlist.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('wishlist-item'); // Add a class for styling

            productItem.innerHTML = `
                <img src="${product.formats['image/jpeg'] ? product.formats['image/jpeg'] : 'Img Not Found'}" alt="${product.title}">
                <div class="wishlist-details">
                  <h4>Title: ${product.title ? product.title.slice(0, 50) : 'Data Not Found'}...</h4>
                  <p>Author: ${product.authors[0]?.name ? product.authors[0]?.name : 'Data Not Found'}</p>
                </div>
            `;

            wishlistContainer.appendChild(productItem);
        });

        // Hide the spinner after the products are loaded
        hideLoadingSpinner();
    }, 1000); // Simulate loading time (1 second delay)
}

// Function to get wishlist from localStorage
function getWishlistFromLocalStorage() {
    const wishlist = localStorage.getItem('product');
    return wishlist ? JSON.parse(wishlist) : [];
}

// Call the function to display wishlist products on page load
displayWishlistProducts();
