# rattrouge

Application mobile avec authentification JWT.
Stack : Node.js + Express + PostgreSQL + Sequelize (backend) | React Native + Expo (mobile)

---

## Structure du projet

```
rattrouge/
  backend/
    src/
      config/db.js            → Connexion à PostgreSQL avec Sequelize
      models/User.js          → Modèle Sequelize (table users)
      controllers/
        authController.js     → register et login
        userController.js     → getUsers
      routes/
        authRoutes.js         → POST /register, POST /login
        userRoutes.js         → GET /users (protégé)
      middleware/
        authMiddleware.js     → Vérification du token JWT
      app.js                  → Configuration Express
      server.js               → Démarrage du serveur
    .env.example              → Variables d'environnement (modèle)
    .env                      → Variables réelles (ne pas committer)
    package.json

  mobile/
    app/
      _layout.js              → Layout racine + restauration de session
      index.js                → Point d'entrée & redirection conditionnelle
      (auth)/
        _layout.js            → Layout du groupe auth (redirige si connecté)
        login.js              → Route /login
        register.js           → Route /register
      (app)/
        _layout.js            → Layout protégé (redirige si non connecté)
        users.js              → Route /users
    src/
      api/api.js              → Instance Axios configurée
      store/authStore.js      → Store Zustand (état global auth)
      screens/
        RegisterScreen.js     → Écran d'inscription
        LoginScreen.js        → Écran de connexion
        UsersScreen.js        → Écran liste des utilisateurs
    app.json                  → Configuration Expo & Expo Router
    package.json

  README.md
  .gitignore
```

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/download/) v14+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) : `npm install -g expo-cli`
- Android Studio (émulateur Android) ou Expo Go sur téléphone physique

---

## Étape 1 — Configurer PostgreSQL

### 1.1 Créer la base de données

Ouvre pgAdmin ou psql et exécute :

```sql
CREATE DATABASE rattrouge_db;
```

### 1.2 Configurer le fichier .env du backend

Le fichier `backend/.env` existe déjà. Modifie-le avec ton mot de passe PostgreSQL :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rattrouge_db
DB_USER=postgres
DB_PASSWORD=ton_mot_de_passe_ici
JWT_SECRET=rattrouge_jwt_secret_key_2024_change_this
```

> ⚠️ Ne committe jamais le fichier `.env` sur GitHub.

---

## Étape 2 — Lancer le backend

```bash
cd backend
npm start
```

Si tout va bien, tu verras :
```
✅ Base de données synchronisée.
🚀 Serveur démarré sur le port 5000
```

Sequelize crée automatiquement la table `users` au premier démarrage.

---

## Étape 3 — Configurer l'URL de l'API mobile

Ouvre `mobile/src/api/api.js` et change `BASE_URL` selon ton environnement :

| Environnement          | URL à utiliser                      |
|------------------------|-------------------------------------|
| Android Emulator       | `http://10.0.2.2:5000` ✅ (défaut) |
| iOS Simulator          | `http://localhost:5000`             |
| Téléphone physique     | `http://192.168.X.X:5000` (ton IP locale) |

Pour trouver ton IP locale (téléphone physique) :
```bash
# Windows
ipconfig
# Cherche "Adresse IPv4" sous ta carte Wi-Fi
```

---

## Étape 4 — Lancer le mobile

```bash
cd mobile
npm start
```

Puis appuie sur :
- `a` → Android Emulator
- `i` → iOS Simulator
- Scanner le QR code → Expo Go sur téléphone

---

## Tests de l'API (avec curl ou Postman)

### POST /register
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"motdepasse123"}'
```

Réponse attendue (201) :
```json
{
  "message": "Utilisateur créé avec succès.",
  "user": { "id": 1, "name": "Alice", "email": "alice@test.com", "role": "user" }
}
```

### POST /login
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"motdepasse123"}'
```

Réponse attendue (200) :
```json
{
  "message": "Connexion réussie.",
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "Alice", "email": "alice@test.com", "role": "user" }
}
```

### GET /users (avec token)
```bash
curl http://localhost:5000/users \
  -H "Authorization: Bearer TON_TOKEN_ICI"
```

Réponse attendue (200) :
```json
{
  "users": [{ "id": 1, "name": "Alice", "email": "alice@test.com" }]
}
```

### GET /users (sans token)
```bash
curl http://localhost:5000/users
```

Réponse attendue (401) :
```json
{ "message": "Token manquant." }
```

---

## Parcours dans l'application

1. **Register** → Saisir nom, email, mot de passe → bouton Register
2. **Login** → Saisir email, mot de passe → bouton Login
3. **UsersScreen** → Voir la liste des utilisateurs → bouton Logout
4. Retour automatique à **Login**

---

## Rôle de chaque technologie

| Technologie | Rôle |
|-------------|------|
| **Express** | Créer les routes HTTP de l'API |
| **PostgreSQL** | Base de données qui stocke les utilisateurs |
| **Sequelize** | ORM : manipuler PostgreSQL avec du JavaScript |
| **bcryptjs** | Hasher les mots de passe avant stockage |
| **jsonwebtoken** | Générer et vérifier les tokens JWT |
| **dotenv** | Lire les variables d'environnement depuis .env |
| **Axios** | Envoyer des requêtes HTTP depuis le mobile vers l'API |
| **Zustand** | Partager l'état de l'utilisateur entre les écrans |
| **SecureStore** | Stocker le token JWT de façon sécurisée sur le téléphone |
| **Expo Router** | Routage basé sur les fichiers et navigation (remplace React Navigation) |
