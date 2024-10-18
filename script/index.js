// Start Navbar Code
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'inline'
};
    
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
};

// End Navbar Code

//////////////////////////////////////////// Start Books code //////////////////////////////////////////

// Cache Variable to store the fetched data
let cachedData = null;
let currentPage = 1; // Current page number
const itemsPerPage = 5; // Number of items per page


// Function to fetch data from API or return cached data
async function fetchProductData() {
  const spinner = document.getElementById('spinner');

  // If cached data is already available, return it from cache
  if (cachedData) {
    console.log("Using cached data");
    displayProducts(cachedData); // Show data from cache
    return;
  }

  // Show the spinner and fetch data from API
  spinner.style.display = 'block';

  try {
    const response = await fetch('https://gutendex.com/books/');
    const data = await response.json();
    // console.log(data.results);

    // Save the data in the cache variable
    cachedData = data.results;

    // Hide the spinner and display the books container once data is loaded
    spinner.style.display = 'none';

    displayProducts(cachedData); // Pass data to function that dynamically creates books
    createPagination(cachedData.length); // Create pagination controls
  } catch (error) {
    console.error("Error fetching data:", error);
    spinner.style.display = 'none';
  }
}

// Function to dynamically create product (book) elements and insert them into the DOM
function displayProducts(products) {
  const booksContainer = document.getElementById('books-container');
  const wishlist = getWishlistFromLocalStorage();

  // Clear existing content
  booksContainer.innerHTML = '';

   // Calculate the start and end index for slicing the products array
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const paginatedProducts = products.slice(startIndex, endIndex);
  

   // Create dynamic structure for each book
  paginatedProducts?.map(product => {
    // console.log(product);
    // Product Img:
    const imageUrl = product?.formats['image/jpeg'];
    // Create dynamic HTML for each book
    const bookItem = document.createElement('div');
    bookItem.classList.add('cart-item'); // Style class for book items

     // Check if the book is in the wishlist
     const isWishlisted = wishlist.includes(product.id);

    // Populate book item with product details using template literals
    bookItem.innerHTML = `
      <div style="position : relative">
      <img src="${imageUrl ? imageUrl : "Img Not Found"}" alt="${product?.title}">
      <!-- Add Wishlist Icon -->
          <span class="wishlist-icon" data-id="${product.id}" style="cursor: pointer; color: ${isWishlisted ? 'red' : 'gray'}; position: absolute; left: 10px">
            &#x2764; <!-- Heart Icon -->
          </span>
      </div>
      <div class="cart-details">
        <h4>Title: ${product?.title ? product?.title.slice(0, 50) : "Data Not Found"}...</h4>
        <p><span>Authors Name:</span> ${product?.authors[0]?.name ? product?.authors[0]?.name.slice(0, 50) : "Data Not Found"}....</p>
        <div class="cart-footer">
          <button class="details-btn" onclick="viewDetails(${product.id})">View Details</button>
        </div>
      </div>
    `;

    // Append the dynamically created book item to the books container
    booksContainer.appendChild(bookItem);

  });

  //  // Add click event listeners to the wishlist icons
   addWishlistEventListeners();

}


/////////////////////////////////////////////// Start Pagination //////////////////////////////////////////

// Function to create pagination controls
function createPagination(totalItems) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = ''; // Clear existing pagination

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Create Previous button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1; // Disable if on first page
  prevButton.onclick = () => changePage(currentPage - 1);
  paginationContainer.appendChild(prevButton);

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.toggle('active', i === currentPage); // Highlight active page
    pageButton.onclick = () => changePage(i);
    paginationContainer.appendChild(pageButton);
  }

  // Create Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages; // Disable if on last page
  nextButton.onclick = () => changePage(currentPage + 1);
  paginationContainer.appendChild(nextButton);
}

// Function to change the current page
function changePage(page) {
  currentPage = page;
  displayProducts(cachedData); // Re-display products for the current page
  createPagination(cachedData.length); // Update pagination controls
}

/////////////////////////////////////////////// End Pagination //////////////////////////////////////////


// Function to handle click events on wishlist icons
function addWishlistEventListeners() {
  const wishlistIcons = document.querySelectorAll('.wishlist-icon');

  wishlistIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const bookId = parseInt(this.getAttribute('data-id'));
      const product = cachedData.find(item => item.id === bookId); // Find the full product by ID

      let wishlist = getWishlistFromLocalStorage();

      // Check if the book is already in the wishlist
      if (wishlist.some(item => item.id === bookId)) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== bookId);
        saveWishlistToLocalStorage(wishlist);
        this.style.color = 'gray'; // Update icon color
        alert("Your product has been removed from the wishlist!"); // Show remove alert
      } else {
        // Add to wishlist
        wishlist.push(product); // Save full product to localStorage
        saveWishlistToLocalStorage(wishlist);
        this.style.color = 'red'; // Update icon color
        alert("Your product has been added to the wishlist!"); // Show add alert
      }
    });
  });
}

// Function to get wishlist from localStorage
function getWishlistFromLocalStorage() {
  const wishlist = localStorage.getItem('product');
  return wishlist ? JSON.parse(wishlist) : [];
}

// Function to save wishlist to localStorage
function saveWishlistToLocalStorage(wishlist) {
  localStorage.setItem('product', JSON.stringify(wishlist));
}

// Function to filter books by title in real-time based on search input
function filterBooksByTitle(searchValue) {
  const filteredBooks = cachedData?.filter(book =>
    book.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Display "Sorry, this book is not available" message if no books match
  if (filteredBooks.length === 0) {
    document.getElementById('books-container').innerHTML = "<p style='color: red'>Sorry, this book is not available.</p>";
  } else {
    displayProducts(filteredBooks);
  }
}

// Function to filter books by genre
async function filterBooksByGenre(genre) {
    if (genre === 'all') {
      displayProducts(cachedData); // Show all books if "All Genres" is selected
    } else {
      // Filter books by genre
      const filteredBooks = await cachedData?.filter(book =>
        book.subjects && book.subjects.some(subject => subject.toLowerCase().includes(genre.toLowerCase()))
      );
  
      // Display a message if no books are found for the selected genre
      if (filteredBooks.length === 0) {
        document.getElementById('books-container').innerHTML = '<p>Sorry, no books found in this genre.</p>';
      } else {
        displayProducts(filteredBooks); // Show the filtered books
      }
    }
  }

// Add event listeners for search input and genre dropdown
document.getElementById('search-btn').addEventListener('click', () => {
  let searchValue = document.getElementById('search-input').value;
  filterBooksByTitle(searchValue);
   // After search, clear the search input field
   document.getElementById('search-input').value = '';

});

document.getElementById('genre-dropdown').addEventListener('change', (event) => {
  const selectedGenre = event.target.value;
  filterBooksByGenre(selectedGenre);
});

// Call the function to fetch or display cached data on page load
fetchProductData();


// Function to redirect to book details page  by using id
function viewDetails(bookId) {
  console.log(bookId);
  // Redirect to the details page with the book ID in the URL
  window.location.href = `book-details.html?id=${bookId}`;
}

//////////////////////////////////////////// End Books code //////////////////////////////////////////


