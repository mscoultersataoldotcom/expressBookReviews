const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let okUser = require('./auth_users.js').okUser;
const public_users = express.Router();

public_users.post("/register", async (req,res) => {
   const username = req.query.username;
   const password = req.query.password;
 
   // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {       
            // Add the new user to the users array
            users.push({"username": username, "password": password});         
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

async function allBooks() {
  // Loop thru the books for better formatting
  var isbnList =  Object.keys(books);
  let bookString = '';
  for (let i = 0; i < Object.keys(books).length; i++){
    var isbn = isbnList[i];
    var entry = books[isbn.toString()];   
    bookString += "\n"  + isbn + ': ' + JSON.stringify(entry) + "<br>" ;     
  }   
  if (bookString.length > 0) return bookString
  else return "Books Not Found";    
};

async function executeallBooks() {
   try {
    const result = await allBooks();   
    return result;
  } catch (error) {
    console.log('Error getting books');
    return 'Error getting books';
  }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let thebooks = executeallBooks();
  thebooks.then (function(result){
  res.send(result);
  })
  });

async function bookDetails(isbn) {
  let book_entry = Object.entries(books).find(([key, value]) => key === isbn);
  if (book_entry) return book_entry
  else return 'Book Not Found';
  };
async function executebookDetails(isbn) {
   try {
    const result = await bookDetails(isbn);   
    return result;
  } catch (error) {
    console.log('Error getting book entry');
    return 'Error getting book entry';
  }
}

async function bookDetailsbyAuthor(author) {
  let bookString = '';
  Object.keys(books).filter(function(row) {
  if (books[row].author === author){
    var entry = books[row.toString()];   
    bookString += "\n"  + row + ': ' + JSON.stringify(entry) + "<br>" ; 
    }
  });
  if (bookString.length > 0) return bookString
  else return 'Books not found by author';
};

async function executebookDetailsbyAuthor(author) {
   try {
    const result = await bookDetailsbyAuthor(author);   
    return result;
  } catch (error) {
    console.log('Error getting book entry by author');
    return 'Error getting book entry by author';
  }
}

async function bookDetailsbyTitle(title) {
  let bookString = '';
  Object.keys(books).filter(function(row) {
  if (books[row].title === title){
    var entry = books[row.toString()];   
    bookString += "\n"  + row + ': ' + JSON.stringify(entry) + "<br>" ; 
    }
  });
  if (bookString.length > 0) return bookString
  else return 'Books not found by title';
};

async function executebookDetailsbyTitle(title) {
   try {
    const result = await bookDetailsbyTitle(title);   
    return result;
  } catch (error) {
    console.log('Error getting book entry by title');
    return 'Error getting book entry by title';
  }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let bookDetails = executebookDetails(req.params.isbn);
  bookDetails.then (function(result){
  res.send(result);
  })  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let bookDetails = executebookDetailsbyAuthor(req.params.author);
  bookDetails.then (function(result){
  res.send(result);
  }) 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let bookDetails = executebookDetailsbyTitle(req.params.title);
  bookDetails.then (function(result){
  res.send(result);
  }) ;
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get the isbn from the parm in the request URL
  const isbn = req.params.isbn;
  // Find the entry in the book object and get the reviews for that book
  let book_entry = Object.entries(books).find(([key, value]) => key === isbn);
  res.send(JSON.stringify(books[book_entry[0].toString()].reviews));
});

module.exports.general = public_users;
