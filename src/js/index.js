// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class Store {
  static getBooks() {
    let books;
    
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    
    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    })

    localStorage.setItem('books', JSON.stringify(books));
  }
}


class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createAttribute('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="icon-delete">x</a></td>
    `

    list.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains('icon-delete')) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createAttribute('div');
    div.className = `alert alert-${className}`;
    
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');

    const table = document.querySelector('#book-table');

    container.insertBefore(div, table);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 1500);
  }
  
  static clearFields() {
    document.querySelector('#book-name').value = '';
    document.querySelector('#book-author').value = '';
    document.querySelector('#book-isbn').value = '';
  }
}




  // Event display books
  document.addEventListener('DOMContentLoaded', UI.displayBooks);

  // Event add book
  document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
  
  // get form values
    const name = document.querySelector('#book-name').value;
    const author = document.querySelector('#book-author').value;
    const isbn = document.querySelector('#book-isbn').value;

    if ( name === '' || author || '' || isbn === '') {
      UI.showAlert('Please  fill in all fields!', 'danger');
    } else {
      const book = new Book(name, author, isbn);
      // Add Book to UI
      UI.addBookToList(book);
      // Add book to store
      Store.addBook(book);

      UI.showAlert('Book Added!', 'success');
      // Clear fields 
      UI.clearFields();
    }
  })

  document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book removed', 'info');
  })


