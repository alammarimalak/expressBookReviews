const express = require('express');
const axios = require('axios'); 
const public_users = express.Router();

const BOOKS_URL = "http://localhost:5000/booksdb.json"; 

public_users.get("/", async (req, res) => {
    try {
        const response = await axios.get(BOOKS_URL);
        const books = response.data;
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const response = await axios.get(BOOKS_URL);
        const book = response.data[req.params.isbn];
        if (book) return res.status(200).json(book);
        res.status(404).json({ message: "Book not found" });
    } catch (err) {
        res.status(500).json({ message: "Error fetching book" });
    }
});


public_users.get("/author/:author", async (req, res) => {
    try {
        const response = await axios.get(BOOKS_URL);
        const books = Object.values(response.data).filter(
            book => book.author.toLowerCase() === req.params.author.toLowerCase()
        );
        if (books.length > 0) return res.status(200).json(books);
        res.status(404).json({ message: "No books found for this author" });
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get("/title/:title", async (req, res) => {
    try {
        const response = await axios.get(BOOKS_URL);
        const books = Object.values(response.data).filter(
            book => book.title.toLowerCase() === req.params.title.toLowerCase()
        );
        if (books.length > 0) return res.status(200).json(books);
        res.status(404).json({ message: "No books found with this title" });
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

module.exports.general = public_users;