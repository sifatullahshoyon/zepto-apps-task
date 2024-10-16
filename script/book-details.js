// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  

  // Fetch and display book details based on the book ID from the URL
  async function fetchBookDetails() {
    const bookId = getQueryParam('id');

    if (bookId) {
      try {
        const spinner = document.getElementById('spinner');
        spinner.style.display = 'block';

        const response = await fetch(`https://gutendex.com/books/${bookId}`);
        const data = await response.json();

        const subjectsList = data?.subjects?.map(subject => `<li>${subject}</li>`).join('');
        const formatsList = data?.subjects?.map(formats => `<li>${formats}</li>`).join('');
        const copyrightStatus = data.book?.copyright ? "Yes" : "No";
        
        spinner.style.display = 'none';

        // Display book details dynamically
        const bookDetails = document.getElementById('book-details');
        bookDetails.classList.add('cart-item');
        bookDetails.innerHTML = `
          <img src="${data?.formats['image/jpeg']}" alt="${data?.title}">
      <div class="cart-details">
        <h4>Title: ${data?.title ? data?.title : "Data Not Found"}</h4>
        <p><span>Authors Name:</span> ${data?.authors[0]?.name ? data?.authors[0]?.name : "Data Not Found"}</p>
        <p><span>Authors Birth Year:</span> ${data?.authors[0]?.birth_year ? data?.authors[0]?.birth_year : "Data Not Found"}</p>
        <p><span>Authors Death Year	:</span> ${data?.authors[0]?.death_year ? data?.authors[0]?.death_year : "Data Not Found"}</p>
        <p><span>subjects	:</span></p>
        <ul>${subjectsList ? subjectsList : "<li>Data Not Found</li>"}</ul>
        <p><span>languages	:</span> ${data?.languages[0] ? data?.languages[0] : "Data Not Found"}</p>
        <p><span>Copyright	:</span> ${copyrightStatus ? copyrightStatus : "Data Not Found"}</p>
        <p><span>Formats	:</span></p>
        <ul>${formatsList ? formatsList : "<li>Data Not Found</li>"}</ul>
        <p><span>Download Count	:</span> ${data.download_count ? data.download_count : "Data Not Found"}</p>
      </div>
        `;
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    } else {
      document.getElementById('book-details').innerHTML = '<p>Book not found.</p>';
    }
  }

  // Call the function on page load
  fetchBookDetails();