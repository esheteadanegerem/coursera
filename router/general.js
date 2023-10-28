const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const bookList = Object.values(books).map((bookDetails, index) => ({
    number: index + 1,
    ...bookDetails,
  }));

  // Check if there are any books available
  if (bookList.length === 0) {
    return res.status(404).json({ message: "No books available." });
  }

  // Create an object where book numbers are keys and book details are values
  const booksObject = bookList.reduce((acc, book) => {
    acc[book.number] = { ...book };
    delete acc[book.number].number; // Remove the 'number' key from the book details
    return acc;
  }, {});
  res.json(booksObject); // comment here to get the booklist without axios
  // return res.status(200).json(booksObject);    //un commment here to get the booklist
});

public_users.get("/axi", function (req, res) {
  axios
    .get("http://localhost:5000")
    .then((response) => {
      const bookList = response.data;

      if (bookList.length === 0) {
        return res.status(404).json({ message: "No books available." });
      }

      return res.status(200).json(bookList);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error fetching book list: " + error.message });
    });
});

// Get book details based on ISBN

public_users.get("/isbn/:isbn", function (req, res) {
  const requestedISBN = req.params.isbn;

  // Find the book that matches the provided ISBN
  const book = Object.values(books).find((book) => book.isbn === requestedISBN);

  if (book) {
    return res.status(200).json(book);
  } else {
    // If the book is not found locally, fetch it using Axios
    axios
      .get(`http://localhost:5000/isbn/${requestedISBN}`)
      .then((response) => {
        const bookDetails = response.data;
        if (!bookDetails) {
          return res
            .status(404)
            .json({ message: "Book not found for the given ISBN." });
        }
        return res.status(200).json(bookDetails);
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: "Error fetching book details: " + error.message });
      });
  }
});
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const requestedAuthor = req.params.author;

  // Filter the books by the provided author
  const authorBooks = Object.values(books).filter(
    (book) => book.author === requestedAuthor
  );

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the given author." });
  }
});
public_users.get("/author/:author", function (req, res) {
  const requestedAuthor = req.params.author;
  // based on axios
  axios
    .get(`http://localhost:5000/author/${requestedAuthor}`)
    .then((response) => {
      const authorBooks = response.data;

      if (authorBooks.length === 0) {
        return res
          .status(404)
          .json({ message: "No books found for the given author." });
      }

      return res.status(200).json(authorBooks);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({
          message: "Error fetching book details by author: " + error.message,
        });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.title;
  const authorBooks = Object.values(books).filter(
    (book) => book.title === requestedAuthor
  );
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the given author." });
  }
});
public_users.get("/title/axi:title", function (req, res) {
  const requestedTitle = req.params.title;

  axios
    .get(`http://localhost:5000/title/${requestedTitle}`)
    .then((response) => {
      const titleBooks = response.data;

      if (titleBooks.length === 0) {
        return res
          .status(404)
          .json({ message: "No books found for the given title." });
      }

      return res.status(200).json(titleBooks);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({
          message: "Error fetching book details by title: " + error.message,
        });
    });
});
public_users.get("/review/:isbn", function (req, res) {
  const requestedISBN = req.params.isbn;

  // Find the book that matches the provided ISBN
  const book = Object.values(books).find((book) => book.isbn === requestedISBN);

  if (book) {
    if (book.reviews && Object.keys(book.reviews).length > 0) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({});
    }
  } else {
    return res
      .status(404)
      .json({ message: "Book not found for the given ISBN." });
  }
});

module.exports.general = public_users;
