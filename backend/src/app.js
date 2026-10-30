// app.js - Configuration principale de l'application Express
const express = require("express");
const app = express();

// Middleware pour lire le JSON dans le body des requêtes
app.use(express.json());

// Import des routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// On branche les routes sur l'application
// POST /register et POST /login
app.use("/", authRoutes);

// GET /users (protégé)
app.use("/", userRoutes);

module.exports = app;
