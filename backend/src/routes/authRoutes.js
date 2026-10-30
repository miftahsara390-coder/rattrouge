// authRoutes.js - Définit les routes pour l'inscription et la connexion
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Route POST /register → appelle la fonction register du contrôleur
router.post("/register", register);

// Route POST /login → appelle la fonction login du contrôleur
router.post("/login", login);

module.exports = router;
