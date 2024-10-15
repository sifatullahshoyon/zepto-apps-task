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

// Function to fetch data from API or return cached data
async function fetchProductData() {
  const spinner = document.getElementById('spinner');

  // If cached data is already available, return it from cache
  if (cachedData) {
    console.log("Using cached data");
    displayProducts(cachedData); // Show data from cache
    return;
  }

  // If no cached data, show the spinner and fetch from API
  spinner.style.display = 'block';


  try {
    const response = await fetch('https://gutendex.com/books/'); 
    const data = await response.json();
    console.log(data.results)

    // Save the data in the cache variable
    cachedData = data.results;

    // Hide the spinner and display the books container once data is loaded
    spinner.style.display = 'none';
    

    displayProducts(cachedData); // Pass data to function that dynamically creates books
  } catch (error) {
    console.error("Error fetching data:", error);
    spinner.style.display = 'none';
  }
}

// Function to dynamically create product (book) elements and insert them into the DOM
function displayProducts(products) {
  const booksContainer = document.getElementById('books-container');

  // Clear existing content (optional)
  booksContainer.innerHTML = '';

  // Use map() to create a dynamic structure for each book
  products?.map(product => {
    console.log(product)
    // Product Img:
    const imageUrl = product?.formats['image/jpeg'];
    // Create dynamic HTML for each book
    const bookItem = document.createElement('div');
    bookItem.classList.add('cart-item'); // Style class for book items

    // Populate book item with product details using template literals
    bookItem.innerHTML = `
      <img src="${imageUrl ? imageUrl : "Img Not Found"}" alt="${product?.title}">
      <div class="cart-details">
        <h4>Title: ${product?.title ? product?.title.slice(0, 50) : "Data Not Found"}...</h4>
        <p><span>Authors Name:</span> ${product?.authors[0]?.name ? product?.authors[0]?.name.slice(0, 50) : "Data Not Found"}....</p>
        <div class="cart-footer">
          <button class="details-btn">View Details</button>
        </div>
      </div>
    `;

    // Append the dynamically created book item to the books container
    booksContainer.appendChild(bookItem);
  });
}

// Call the function to fetch or display cached data on page load
fetchProductData();
  

//////////////////////////////////////////// End Books code //////////////////////////////////////////