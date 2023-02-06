class Book{
  constructor(title, author, dateStarted){
    this.title = title;
    this.author = author;
    this.dateStarted = dateStarted;
  }
}

class UI{
  addBookToList(book){
    const list = document.getElementById('book-list');

    // create row
    const row = document.createElement('tr');
    
    // insert cols into row
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.dateStarted}</td>
    <td><a href="#" class="delete">X</a></td>`;

    list.appendChild(row);

  }

  showAlert(message, className){
    //create div 
    const div = document.createElement('div');
    // add classes (success or error)
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('.container');
    // get form
    const form = document.querySelector('#book-form');
    // insert alert before form 
    container.insertBefore(div,form);

    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 4000);
  }

  deleteBookFromList(target){
    // target is the a tag wrapping the X 
    if (target.className === 'delete'){
      // removes entire row
      target.parentElement.parentElement.remove();
    }
  }

  clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('dateStarted').value = '';
  }
}

// Event listener for add book (when form is submitted)
document.getElementById('book-form').addEventListener('submit', addBook);

function addBook(e){
  // get form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const dateStarted = document.getElementById('dateStarted').value;

  // instantiate book
  const book = new Book(title, author, dateStarted);

  // instantiate UI
  const ui = new UI();


  // validate, then show error message or add book to list
  if(title === '' || author === '' || dateStarted === ''){
    ui.showAlert('Please fill in all fields', 'error');
  }else if(!validateDate(dateStarted)){
    ui.showAlert('Invalid date', 'error');
  }else{
    ui.addBookToList(book);

    // add to local storage
    Store.addBook(book);

    // show success alert
    ui.showAlert('Book added!', 'success');

    // clear fields
    ui.clearFields();
  }

  // prevent form from actually submitting
  e.preventDefault();
}

// validates the date
function validateDate(strDate){
  if(strDate.toString() == parseInt(strDate).toString()) return false; 
  var tryDate = new Date(strDate);
  return (tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date");  
}


// Event Listener for delete book
document.getElementById('book-list').addEventListener('click', deleteBook);

function deleteBook(e){
  const ui = new UI();

  ui.deleteBookFromList(e.target);

  // remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

  ui.showAlert('Book removed!', 'success');

  e.preventDefault();
}

class Store{
  static getBooks(){
    let books;
    if (localStorage.getItem('books') === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks(){
    const books = Store.getBooks();
    books.forEach(function(book){
      const ui = new UI;
      ui.addBookToList(book);
    });
  }

  static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(title){
    const books = Store.getBooks();
    books.forEach(function(book,index){
      if(book.title === title){
        books.splice(index,1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);