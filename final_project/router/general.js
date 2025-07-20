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

    // Check whether both username and password are provided
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
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books) {
        resolve(books);
      } else {
        reject("No books found");
      }
    }, 0);
  })
    .then((books) => {
      res.status(200).json({ books });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 0);
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      let books_by_author = Object.values(books).filter((book) => book.author === author);
      if (books_by_author.length > 0) {
        resolve(books_by_author);
      } else {
        reject("No books found by author " + author);
      }
    }, 0);
  })
    .then((books_by_author) => res.status(200).json(books_by_author))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title using Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      let books_by_title = Object.values(books).filter((book) => book.title === title);
      if (books_by_title.length > 0) {
        resolve(books_by_title);
      } else {
        reject("No books found with title " + title);
      }
    }, 0);
  })
    .then((books_by_title) => res.status(200).json(books_by_title))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book review using Promise
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn].reviews);
      } else {
        reject("Book with ISBN " + isbn + " not found");
      }
    }, 0);
  })
    .then((reviews) => res.status(200).json(reviews))
    .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
