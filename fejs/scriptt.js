const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("form-data");

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putBookList(data) {
  if (checkForStorage()) {
    let bookData = [];
    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }
    bookData.unshift(data);
    if (bookData.length > 5) {
      bookData.pop();
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));

    // memindahkan buku ke rak yang sesuai
    if (submitAction.readComplete.checked) {
      moveBookToShelf(data, "read");
    } else {
      moveBookToShelf(data, "unread");
    }
  }
}

function getBookList() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
}

function renderBookList() {
  const bookData = getBookList();
  const bookListUnread = document.querySelector("#book-list-unread tbody");
  const bookListRead = document.querySelector("#book-list-read tbody");
  bookListUnread.innerHTML = "";
  bookListRead.innerHTML = "";
  for (let i = 0; i < bookData.length; i++) {
    let book = bookData[i];
    let row = document.createElement("tr");
    row.innerHTML = "<td>" + book.judul + "</td>";
    row.innerHTML += "<td>" + book.penulis + "</td>";
    row.innerHTML += "<td>" + book.tahun + "</td>";
    row.innerHTML +=
      '<td><button onclick="deleteBook(' + i + ')">Hapus</button></td>';
    if (book.read) {
      row.innerHTML +=
        '<td><button onclick="moveBookToShelf(' +
        JSON.stringify(book) +
        ", 'unread')\">Belum selesai dibaca</button></td>";
      bookListRead.appendChild(row);
    } else {
      row.innerHTML +=
        '<td><button onclick="moveBookToShelf(' +
        JSON.stringify(book) +
        ", 'read')\">Selesai dibaca</button></td>";
      bookListUnread.appendChild(row);
    }
  }
}

submitAction.addEventListener("submit", function (event) {
  const inputJudul = document.getElementById("judul").value;
  const inputPenulis = document.getElementById("penulis").value;
  const inputTahun = document.getElementById("tahun").value;
  const inputReadComplete = document.getElementById("readComplete");
  const newBookData = {
    judul: inputJudul,
    penulis: inputPenulis,
    tahun: inputTahun,
    read: inputReadComplete.checked,
  };
  putBookList(newBookData);
  renderBookList();
});

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      renderBookList();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

function deleteBook(index) {
  if (checkForStorage()) {
    let bookData = JSON.parse(localStorage.getItem(storageKey));
    bookData.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    renderBookList();
  }
}

function moveBookToShelf(book, shelf) {
  let bookData = getBookList();
  let index = bookData.findIndex((b) => b.judul === book.judul);

  if (index !== -1) {
    let movedBook = bookData[index];
    if (shelf === "read") {
      movedBook.read = true;
    } else {
      movedBook.read = false;
    }
    bookData.splice(index, 1);
    bookData.unshift(movedBook);
  } else {
    if (shelf === "read") {
      book.read = true;
    } else {
      book.read = false;
    }
    bookData.unshift(book);
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}
