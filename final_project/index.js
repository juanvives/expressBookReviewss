const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configuración de sesión
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Middleware para rutas autenticadas con JWT
app.use("/customer/auth/*", (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ message: "User not logged in" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    try {
        const payload = jwt.verify(token, "access");
        req.user = payload.username;
        next();
    } catch {
        return res.status(403).json({ message: "Invalid token" });
    }
});

const PORT = 5000;

// Rutas
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
