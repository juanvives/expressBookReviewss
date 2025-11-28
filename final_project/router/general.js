const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.get('/', async (req, res) => {
    try {
        const getAllBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };

        const allBooks = await getAllBooks();
        res.status(200).json(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) resolve(books[isbn]);
                else reject("Book not found");
            });
        };

        const book = await getBookByISBN(isbn);
        res.status(200).json(JSON.stringify(book, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const result = Object.values(books).filter(book => book.author === author);
                if (result.length > 0) resolve(result);
                else reject("Author not found");
            });
        };

        const booksByAuthor = await getBooksByAuthor(author);
        res.status(200).json(JSON.stringify(booksByAuthor, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const result = Object.values(books).filter(book => book.title === title);
                if (result.length > 0) resolve(result);
                else reject("Title not found");
            });
        };

        const booksByTitle = await getBooksByTitle(title);
        res.status(200).json(JSON.stringify(booksByTitle, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports.general = public_users;
