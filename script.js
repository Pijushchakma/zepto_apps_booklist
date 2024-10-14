document.addEventListener("DOMContentLoaded", function () {
  async function fetchBooks(page = 1) {
    const response = await fetch(`https://gutendex.com/books?page=${page}`);
    const data = await response.json();
    return data;
  }

  function displayBooks(books) {
    const bookContainer = document.getElementById("book-list");
    bookContainer.innerHTML = "";

    books.results.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("book-item");

      bookElement.innerHTML = `
            <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>Author: ${book.authors.map((a) => a.name).join(", ")}</p>
            <p>Genre: ${book.subjects.join(", ")}</p>
            <button data-id="${book.id}" class="wishlist-btn">💖</button>
        `;
      bookContainer.appendChild(bookElement);
    });
  }
  document.getElementById("search-bar").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const books = document.querySelectorAll(".book-item");

    books.forEach((book) => {
      const title = book.querySelector("h3").innerText.toLowerCase();
      book.style.display = title.includes(searchValue) ? "block" : "none";
    });
  });

  document
    .getElementById("genre-filter")
    .addEventListener("change", function () {
      const genre = this.value;
      const books = document.querySelectorAll(".book-item");

      books.forEach((book) => {
        const bookGenres = book.querySelector("p").innerText;
        book.style.display = bookGenres.includes(genre) ? "block" : "none";
      });
    });

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("wishlist-btn")) {
      const bookId = e.target.getAttribute("data-id");
      if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter((id) => id !== bookId);
      } else {
        wishlist.push(bookId);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      e.target.classList.toggle("wishlisted");
    }
  });

  function loadWishlist() {
    const books = document.querySelectorAll(".wishlist-btn");
    books.forEach((book) => {
      const bookId = book.getAttribute("data-id");
      if (wishlist.includes(bookId)) {
        book.classList.add("wishlisted");
      }
    });
  }

  let currentPage = 1;
  alert(currentPage);
  fetchBooks(currentPage).then(displayBooks);

  document.getElementById("next-page").addEventListener("click", function () {
    currentPage++;
    fetchBooks(currentPage).then(displayBooks);
  });

  document.getElementById("prev-page").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchBooks(currentPage).then(displayBooks);
    }
  });
});
