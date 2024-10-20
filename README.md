# Book Listing App - README

## Project Overview

This project is a book listing web application that fetches data from the public GutenDex API and displays books in a user-friendly format. The application allows users to browse, search, and filter books based on different genres or topics, and manage a wishlist that is stored in the browser's local storage. The user interface is responsive and works well on both desktop and mobile devices.

## Features

### 1. Book List Display

- The app fetches a list of books from the GutenDex API.
- Each book displays:
  - Title
  - Author name(s)
  - Cover image
  - Genre/Topic (if available)
  - Book ID

### 2. Search Functionality

- A search bar is provided to filter books by title in real-time.
- The search functionality is case-insensitive and works as the user types.

### 3. Genre Filter

- A dropdown filter is available to filter books by genre or topic.
- Users can select a genre from the dropdown to filter the displayed books.

### 4. Wishlist

- Users can add books to a wishlist by clicking on a heart/love icon next to each book.
- The wishlist is stored in the browser's local storage, allowing the user to preserve their selected books even after the page refreshes or reopens.
- Users can also remove books from the wishlist by clicking on the heart icon again.

### 5. Pagination

- The book list is paginated to improve user experience and navigation.
- Pagination controls (e.g., "Next Page," "Previous Page," or numbered pages) are available to navigate through the list of books.

### 6. Responsive Design

- The application is fully responsive and adapts well to different screen sizes (desktop, tablet, and mobile).
- The layout is styled using vanilla CSS for complete customization, though Bootstrap or Tailwind CSS could also be used.

### 7. Pages

- **Homepage**: Displays the paginated list of books with search and filter functionality.
- **Wishlist Page**: Displays a list of books that the user has added to the wishlist.
- **Book Detail Page**: Displays detailed information for each book, including the title, author(s), and any other available details from the API.

## How to Run the Project

### steps

1. Clone the repository to your local machine

```bash
git clone https://github.com/Pijushchakma/zepto_apps_booklist

```

2. Navigate to the project directory
3. Open the index.html file in your web browser

```bash
open index.html
```

## Acknowledgements

GutenDex API for providing a rich collection of books for this project.
