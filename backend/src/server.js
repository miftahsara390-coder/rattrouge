// server.js - Point d'entrée du serveur : connexion à la BDD et démarrage
require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 5000;

// On synchronise Sequelize avec PostgreSQL (crée la table users si elle n'existe pas)
// { alter: true } met à jour la table si le modèle a changé, sans supprimer les données
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée.");

    // On démarre le serveur seulement après la connexion à la BDD
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion à la base de données:", error);
  });
