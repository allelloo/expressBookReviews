const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let userss = require("./auth_users.js").userss;


const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let users = userss();
  let username = req.body.username;
  let password = req.body.password;

  console.log(users);

  if (username && password) {
    if (!users.find(u => u.username === username)) {
      users.push({ username: username, password: password });
      fs.writeFileSync('./data/users.json', JSON.stringify(users));
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Please enter username and password" });
  }

});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  console.log('loool');

  res.status(200).json({
    status: "success",
    results: Object.keys(books).length,
    data:{
      books: books
    }
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    let bin = req.params.isbn;
    let b = books[bin];

    console.log(b);

    res.status(200).json({
      status: "success",
      data: {
        book: b,
      }
    })
 });


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  let author = req.params.author;

  let bks = Object.values(books).filter(b => b.author === author);

  console.log(bks);

  res.status(200).json({
    status: "success",
    results: Object.keys(bks).length,
    data: {
      book: bks,
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;

  let bks = Object.values(books).filter(b => b.title === title);

  console.log(bks);

  res.status(200).json({
    status: "success",
    results: Object.keys(bks).length,
    data: {
      book: bks,
    }
  })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  let b_reviews = books[isbn].reviews;

  res.status(200).json({
    status: "success",
    data: {
      reviews: b_reviews,
    }
  })
});

module.exports.general = public_users;
