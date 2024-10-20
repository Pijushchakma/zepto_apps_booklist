document.addEventListener("DOMContentLoaded", function () {
  let wishList = JSON.parse(localStorage.getItem("wishList")) || [];
  let searchPreference = localStorage.getItem("searchValue") || "";
  let selectedGenre = localStorage.getItem("selectedGenre") || "";

  let currentPage = 1;
  let totalPages = 1;

  async function fetchBooks(page = 1) {
    const bookContainer = document.getElementById("cards");
    bookContainer.innerHTML = "";
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";
    const response = await fetch(`https://gutendex.com/books?page=${page}`);
    const data = await response.json();
    spinner.style.display = "none";
    const resultsPerPage = data.results.length;
    totalPages = Math.ceil(data.count / resultsPerPage);

    updatePaginationButtons();
    return data;
  }

  function extractGenresFromSubjects(subjects) {
    return subjects.map((subject) => subject.split(" -- ")[0].trim());
  }

  function formatName(name) {
    const [lastName, firstName] = name.split(",").map((part) => part.trim());
    return `${firstName} ${lastName}`;
  }

  let allBooks = [];
  let uniqueGenres = new Set();

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

  function displayBooks(books) {
    const bookContainer = document.getElementById("cards");
    bookContainer.innerHTML = "";
    allBooks = books.results;

    allBooks.forEach((book) => {
      const genres = extractGenresFromSubjects(book.subjects);
      genres.forEach((genre) => uniqueGenres.add(genre));
    });

    const genreFilter = document.getElementById("genre-filter");
    genreFilter.innerHTML = "";
    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.textContent = "None";
    genreFilter.appendChild(noneOption);

    uniqueGenres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreFilter.appendChild(option);
    });

    genreFilter.value = selectedGenre;

    allBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("card");

      const isWishlisted = wishList.includes(book.id.toString())
        ? "fas"
        : "far";

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
          <p class="book-id"> ID : ${book.id}</p>
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
    });

    attachLoveButtonListeners();
  }

  const searchBar = document.getElementById("search-bar");
  searchBar.value = searchPreference;
  const genreFilter = document.getElementById("genre-filter");
  genreFilter.value = selectedGenre;

  function applyFilters() {
    const searchValue = searchBar.value.toLowerCase();
    const selectedGenreValue = genreFilter.value;
    const bookContainer = document.getElementById("cards");
    bookContainer.innerHTML = "";

    const filteredBooks = allBooks.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchValue);
      const matchesGenre =
        selectedGenreValue === "none" ||
        (selectedGenreValue
          ? extractGenresFromSubjects(book.subjects).includes(
              selectedGenreValue
            )
          : true);
      return matchesSearch && matchesGenre;
    });

    filteredBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("card");

      const isWishlisted = wishList.includes(book.id.toString())
        ? "fas"
        : "far";

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
          <p class="book-id"> ID : ${book.id}</p>
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
    });

    attachLoveButtonListeners();
  }

  searchBar.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    localStorage.setItem("searchValue", searchValue);
    applyFilters();
  });

  genreFilter.addEventListener("change", function () {
    const selectedGenreValue = this.value;
    localStorage.setItem("selectedGenre", selectedGenreValue);
    applyFilters();
  });

  fetchBooks(currentPage)
    .then(displayBooks)
    .then(() => {
      applyFilters();
    });
  function updatePaginationButtons(data) {
    const nextPageButton = document.getElementById("next-page");
    const prevPageButton = document.getElementById("prev-page");

    if (currentPage !== totalPages) {
      nextPageButton.disabled = false;
    } else {
      nextPageButton.disabled = true;
    }

    if (currentPage !== 1) {
      prevPageButton.disabled = false;
    } else {
      prevPageButton.disabled = true;
    }
  }

  document.getElementById("next-page").addEventListener("click", function () {
    currentPage++;
    fetchBooks(currentPage).then(displayBooks).then(applyFilters);
  });

  document.getElementById("prev-page").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchBooks(currentPage).then(displayBooks).then(applyFilters);
    }
  });
});
