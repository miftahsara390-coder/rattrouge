// userController.js - Gère la récupération de la liste des utilisateurs
const User = require("../models/User");

// GET /users - Retourne la liste de tous les utilisateurs (protégé par JWT)
const getUsers = async (req, res) => {
  try {
    // On récupère uniquement id, name et email (jamais le mot de passe)
    const users = await User.findAll({
      attributes: ["id", "name", "email"],
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Erreur getUsers:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getUsers };
