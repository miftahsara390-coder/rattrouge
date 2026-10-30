// api.js - Configuration d'Axios pour communiquer avec le backend
import axios from "axios";

// URL de base de l'API selon l'environnement :
// - Android Emulator : http://10.0.2.2:5000
// - iOS Simulator    : http://localhost:5000
// - Téléphone physique : http://TON_IP_LOCAL:5000 (ex: http://192.168.1.10:5000)
const BASE_URL = "http://10.0.2.2:5000";

// On crée une instance Axios avec l'URL de base configurée
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
