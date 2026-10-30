// db.js - Connexion à la base de données avec Sequelize
// On utilise SQLite : pas besoin d'installer PostgreSQL, la BDD est juste un fichier local
const { Sequelize } = require("sequelize");
const path = require("path");

// Le fichier database.sqlite sera créé automatiquement dans le dossier backend/
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../database.sqlite"),
  logging: false, // Désactive les logs SQL pour garder la console propre
});

module.exports = sequelize;
