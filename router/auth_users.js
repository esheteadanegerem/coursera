const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const UserModel = require("./users.js");
let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json("User with that username is not registered yet");
    }

    // If the user is found, store the username in the session
    req.session.username = username;

    return res.status(200).json("User authenticated and username stored in session.");
  } catch (error) {
    return res.status(500).json("Error occurred during login: " + error);
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.body.review;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json("User not authenticated");
  }

  // Find the book by ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json("Book not found for the given ISBN.");
  }

  try {
    // Check if the user has already posted a review for this ISBN
    if (book.reviews && book.reviews[username]) {
      // Modify the existing review
      book.reviews[username] = review;
    } else {
      // Add a new review for the user
      book.reviews = book.reviews || {};
      book.reviews[username] = review;
    }

    return res.status(200).json("Review added/modified successfully.");
  } catch (error) {
    return res.status(500).json("Error occurred while updating the review: " + error);
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json("User not authenticated");
  }

  // Find the book by ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json("Book not found for the given ISBN.");
  }

  try {
    // Check if the user has posted a review for this ISBN
    if (book.reviews && book.reviews[username]) {
      // Delete the user's review for the given ISBN
      delete book.reviews[username];
      return res.status(200).json("Review deleted successfully.");
    } else {
      return res.status(404).json("User review not found for the given ISBN.");
    }
  } catch (error) {
    return res.status(500).json("Error occurred while deleting the review: " + error);
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
