const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // lista de usuarios registrados

// Verifica si un username es válido (no existe ya)
const isValid = (username) => {
    return !users.some(user => user.username === username);
};

// Autentica usuario por username y password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// ============================
// TAREA 6: REGISTRAR USUARIO
// ============================
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (!isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// ============================
// TAREA 7: LOGIN DE USUARIO
// ============================
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Crear token JWT
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    // Guardar en sesión
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// ============================
// TAREA 8: AGREGAR/MODIFICAR RESEÑA
// ============================
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!req.user) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Agregar o modificar reseña
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: books[isbn].reviews
    });
});

// ============================
// TAREA 9: ELIMINAR RESEÑA PROPIA
// ============================
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!req.user) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.user;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Review by this user not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
