// authController.js - Gère l'inscription et la connexion des utilisateurs
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /register - Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérification que tous les champs sont remplis
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérification que l'email n'est pas déjà utilisé
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hashage du mot de passe avec bcryptjs (10 = niveau de sécurité)
    // On ne stocke jamais un mot de passe en clair dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur en base de données
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // On retourne un message de succès sans exposer le mot de passe
    return res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// POST /login - Connexion d'un utilisateur existant
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification que les champs sont remplis
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe obligatoires." });
    }

    // Recherche de l'utilisateur par son email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    // Comparaison du mot de passe fourni avec le hash stocké
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    // Génération du token JWT avec l'id et le rôle de l'utilisateur
    // Le token expire dans 24 heures
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // On retourne le token et les infos de l'utilisateur (sans mot de passe)
    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { register, login };
