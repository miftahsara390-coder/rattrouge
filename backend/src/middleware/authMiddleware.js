// authMiddleware.js - Middleware qui vérifie le token JWT avant d'accéder à certaines routes
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Ce middleware est exécuté avant le contrôleur sur les routes protégées
const authMiddleware = (req, res, next) => {
  // On récupère le header Authorization (ex: "Bearer eyJhbGci...")
  const authHeader = req.headers["authorization"];

  // Si le header est absent, on refuse l'accès
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant." });
  }

  // Le format attendu est "Bearer TOKEN" → on extrait juste le token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    // On vérifie que le token est valide et non expiré avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On stocke les infos décodées dans req.user pour les utiliser dans le contrôleur
    req.user = decoded;

    // next() permet de passer à la fonction suivante (le contrôleur)
    next();
  } catch (error) {
    // Si le token est invalide ou expiré
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
