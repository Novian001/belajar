const books = [];

function addBookToShelf(bookshelfId, title, author, year) {
  const book = {
    id: Date.now().toString(),
    title: title,
    author: author,
    year: year,
  };

  books.push(book);
  saveBooksToStorage();

  const bookshelf = document.getElementById(`list-${bookshelfId}`);
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${book.title} - ${book.author} (${book.year})</span>
    <button onclick="removeBook('${book.id}')">Hapus</button>
    <button onclick="moveBook('${book.id}')">Pindahkan</button>
  `;
  bookshelf.appendChild(li);
}

function removeBook(bookId) {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    saveBooksToStorage();
    const bookElement = document.querySelector('li[data-id="${bookId}"]');
    bookElement.remove();
  }
}

function moveBook(bookId) {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const book = books[index];
    const newBookshelfId = book.bookshelf === "1" ? "2" : "1";
    book.bookshelf = newBookshelfId;
    saveBooksToStorage();
    const bookElement = document.querySelector('li[data-id="${bookId}"]');
    const newBookshelf = document.getElementById("list-${newBookshelfId}");
    newBookshelf.appendChild(bookElement);
  }
}

function saveBooksToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooksFromStorage() {
  const savedBooks = localStorage.getItem("books");
  if (savedBooks) {
    books.push(...JSON.parse(savedBooks));
    for (const book of books) {
      const bookshelf = document.getElementById("list-${book.bookshelf}");
      const li = document.createElement("li");
      li.dataset.id = book.id;
      li.innerHTML = `<span>${book.title} - ${book.author} (${book.year})</span> <button onclick="removeBook('${book.id}')">Hapus</button>  <button onclick="moveBook('${book.id}')">Pindahkan</button>`;
      bookshelf.appendChild(li);
    }
  }
}

loadBooksFromStorage();
