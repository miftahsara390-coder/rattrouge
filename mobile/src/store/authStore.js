// authStore.js - Store Zustand pour gérer l'état global de l'authentification
// Zustand est utilisé pour partager les données de l'utilisateur entre les écrans
// sans devoir passer des props de parent en enfant
import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Données stockées globalement
  user: null,       // Infos de l'utilisateur connecté (id, name, email, role)
  token: null,      // Token JWT pour les requêtes protégées
  isLoading: true,  // Vrai pendant la vérification du token au démarrage

  // Action : enregistrer l'utilisateur et le token après le login
  setAuth: (user, token) => set({ user, token, isLoading: false }),

  // Action : effacer les données lors du logout
  clearAuth: () => set({ user: null, token: null, isLoading: false }),

  // Action : mettre à jour manuellement l'état de chargement
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
