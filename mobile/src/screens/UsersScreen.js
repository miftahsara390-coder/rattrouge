// UsersScreen.js - Écran affichant la liste des utilisateurs (protégé)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";
import useAuthStore from "../store/authStore";

const UsersScreen = () => {
  // useState stocke la liste des utilisateurs récupérés de l'API
  const [users, setUsers] = useState([]);

  // On récupère le token et l'action clearAuth depuis le store Zustand
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // useEffect exécute fetchUsers au chargement de l'écran (le tableau vide [] = une seule fois)
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction qui appelle GET /users avec le token JWT dans le header
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`, // On envoie le token pour l'authentification
        },
      });
      // On met à jour le state avec la liste reçue
      setUsers(response.data.users);
    } catch (error) {
      const message =
        error.response?.data?.message || "Impossible de charger les utilisateurs.";
      Alert.alert("Erreur", message);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    // On supprime le token du stockage sécurisé
    await SecureStore.deleteItemAsync("token");

    // On vide le store Zustand → l'app retourne automatiquement à Login
    clearAuth();
  };

  // Fonction qui affiche un seul élément dans la FlatList
  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des utilisateurs</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        style={styles.list}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  userCard: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222222",
  },
  userEmail: {
    fontSize: 14,
    color: "#555555",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UsersScreen;
