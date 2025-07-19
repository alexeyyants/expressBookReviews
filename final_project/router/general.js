const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not exist yet
        if (!doesExist(username)) {
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  // Filter books by author
  let books_by_author = Object.values(books).filter((book) => book.author === author);
  // Check if any books by the author exist
  if (books_by_author.length > 0) {
    return res.status(200).json(books_by_author);
  } else {
    return res.status(404).json({message: "No books found by author " + author});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  // Filter books by title
  let books_by_title = Object.values(books).filter((book) => book.title === title);
  // Check if any books with the title exist
  if (books_by_title.length > 0) {
    return res.status(200).json(books_by_title);
  } else {
    return res.status(404).json({message: "No books found with title " + title});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Return the reviews of the book
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book with ISBN " + {isbn} + " not found"});
  }
});

module.exports.general = public_users;
