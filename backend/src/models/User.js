// User.js - Modèle Sequelize qui représente la table "users" dans PostgreSQL
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// On définit la structure de la table users
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Deux utilisateurs ne peuvent pas avoir le même email
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user", // Par défaut, tout nouvel utilisateur a le rôle "user"
  },
});

module.exports = User;
