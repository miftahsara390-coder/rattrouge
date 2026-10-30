// userRoutes.js - Définit la route protégée pour récupérer les utilisateurs
const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Route GET /users → le middleware authMiddleware vérifie le token AVANT d'appeler getUsers
router.get("/users", authMiddleware, getUsers);

module.exports = router;
