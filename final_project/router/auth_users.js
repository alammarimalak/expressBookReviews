const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: username }, 'fingerprint_customer', { expiresIn: '1h' });

    return res.status(200).json({ message: "User successfully logged in", token: token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.body.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review || !username) {
        return res.status(400).json({ message: "Username and review are required" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review added/updated for ISBN ${isbn}` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: `Review deleted for ISBN ${isbn}` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
