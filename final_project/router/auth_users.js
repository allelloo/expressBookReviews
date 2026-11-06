const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const userss = () => {
  try {
    let users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
    return users;
  } catch (err) {
    console.log(err);
    return [];
  }
};


const saveJWT = (username, jwt_token) => {
  try {
    fs.writeFileSync("./data/jwt.json", JSON.stringify({ username, jwt_token }));
  } catch (err) {
    console.log(err);
  }
};

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  console.log("[LOG] authenticatedUser");
  let users = userss();

  let u = users.find((u) => u.username == username);

  console.log(u);

  if (!u) {
    return false;
  }

  console.log(u.username, " ", u.password);

  if (u.password != password) {
    console.log("wrong pass");
    return false;
  }

  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  console.log(username, " ", password);

  if (!username || !password) {
    return res.status(200).json({
      status: "fail",
      m: "please enter valid username and password",
    });
  }

  if (authenticatedUser(username, password)) {
    let secret = process.env.JWT_SECRET;
    let jwt_token = jwt.sign({ username }, secret, { expiresIn: "1h" });

    console.log(jwt_token);

    saveJWT(username, jwt_token);

    return res.status(200).json({
      status: "success",
      m: "loged in successfully",
      token: jwt_token,
    });
  }

  res.status(200).json({
    status: "fail",
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let r = req.body.review;

  let b = books[isbn];

  console.log(b);

  if (!b) {
    return res.status(404).json({
      status: "fail",
      m: "book not found",
    });
  }

  if (!r) {
    return res.status(404).json({
      status: "fail",
      m: "review not found",
    });
  }

  b.reviews[req.body.username] = r;

  fs.writeFileSync("./data/books.json", JSON.stringify(books));

  console.log(b);

  res.status(200).json({
    status: "success",
    data: {
      book: b,
    },
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.body.username;

  let b = books[isbn];

  console.log(b);

  if (!b) {
    return res.status(404).json({
      status: "fail",
      m: "book not found",
    });
  }

  delete b.reviews[username];

  fs.writeFileSync("./data/books.json", JSON.stringify(books));

  console.log(b);

  res.status(200).json({
    status: "success",
    data: {
      book: b,
    },
  });

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.userss = userss;
