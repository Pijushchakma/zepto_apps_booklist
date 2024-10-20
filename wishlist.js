document.addEventListener("DOMContentLoaded", function () {
  let wishList = JSON.parse(localStorage.getItem("wishList")) || [];

  if (wishList.length === 0) {
    alert("Your wishlist is empty.");
    return;
  }

  let currentPage = 1;
  async function fetchWishlistBooks() {
    const bookContainer = document.getElementById("cards");
    bookContainer.innerHTML = "";
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";

    for (let i = 0; i < wishList.length; i++) {
      try {
        const bookId = wishList[i];
        const response = await fetch(`https://gutendex.com/books/${bookId}`);
        const book = await response.json();
        displayBook(book);
      } catch (error) {
        spinner.style.display = "none";
        console.error(`Failed to fetch book with ID ${wishList[i]}`, error);
      }
    }
    spinner.style.display = "none";

    if (wishList.length === 0) {
      bookContainer.innerHTML = `<p>No books found in your wishlist.</p>`;
    }
  }

  function displayBook(book) {
    const bookContainer = document.getElementById("cards");

    const bookElement = document.createElement("div");
    bookElement.classList.add("card");

    const isWishlisted = wishList.includes(book.id.toString()) ? "fas" : "far";

    bookElement.innerHTML = `
        <div class="heart-container">
          <button data-id="${book.id}" class="love-button">
            <i class="${isWishlisted} fa-heart"></i>
          </button>
        </div>
        <img src="${book.formats["image/jpeg"]}" alt="${
      book.title
    }" class="book-cover" />
        <div class="card-content">
          <p class="book-id">ID : ${book.id}</p>
          <p class="genre">${
            extractGenresFromSubjects(book.subjects)[0] || "Unknown"
          }</p>
          <h2 class="book-title">${book.title}</h2>
          <p class="author">${
            book.authors.length > 0
              ? formatName(book.authors[0].name)
              : "Unknown"
          }</p>
          <a href="book.html?id=${book.id}">View Details</a>
        </div>
      `;

    bookContainer.appendChild(bookElement);

    attachLoveButtonListeners();
  }

  function extractGenresFromSubjects(subjects) {
    return subjects.map((subject) => subject.split(" -- ")[0].trim());
  }

  function formatName(name) {
    const [lastName, firstName] = name.split(",").map((part) => part.trim());
    return `${firstName} ${lastName}`;
  }

  function attachLoveButtonListeners() {
    document.querySelectorAll(".love-button").forEach((button) => {
      button.addEventListener("click", function () {
        const icon = this.querySelector("i");
        const bookId = this.getAttribute("data-id");
        if (icon.classList.contains("far")) {
          icon.classList.remove("far");
          icon.classList.add("fas");
          wishList.push(bookId);
        } else {
          icon.classList.remove("fas");
          icon.classList.add("far");
          wishList = wishList.filter((id) => id !== bookId);
        }
        localStorage.setItem("wishList", JSON.stringify(wishList));
      });
    });
  }

  fetchWishlistBooks();
});
