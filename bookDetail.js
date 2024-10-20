document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("book.html")) {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    fetchBookDetail(bookId);
  }

  async function fetchBookDetail(bookId) {
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";
    const response = await fetch(`https://gutendex.com/books/${bookId}`);

    spinner.style.display = "none";
    const book = await response.json();
    const bookDetail = document.getElementById("bookDetail");

    const authors = book.authors
      .map(
        (author) =>
          `${author.name} (${author.birth_year} - ${author.death_year})`
      )
      .join(", ");

    const subjects = book.subjects.join(", ");

    const downloadLinks = `
            <a href="${book.formats["text/html"]}" target="_blank">Read Online</a><br>
            <a href="${book.formats["application/epub+zip"]}" download>Download EPUB</a><br>
            <a href="${book.formats["application/x-mobipocket-ebook"]}" download>Download MOBI</a><br>
            <a href="${book.formats["text/plain; charset=us-ascii"]}" download>Download Plain Text</a>
        `;

    bookDetail.innerHTML = `
            
            <img src="${book.formats["image/jpeg"]}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p><strong>Authors:</strong> ${authors}</p>
            <p><strong>Subjects:</strong> ${subjects}</p>
            <p><strong>Download Links:</strong><br> ${downloadLinks}</p>
            <p><strong>Download Count:</strong> ${book.download_count}</p>
        `;
  }
});
