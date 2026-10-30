// LoginScreen.js - Écran de connexion
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";
import useAuthStore from "../store/authStore";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // On récupère l'action setAuth depuis le store Zustand
  const setAuth = useAuthStore((state) => state.setAuth);

  // Fonction appelée quand on appuie sur le bouton Login
  const handleLogin = async () => {
    try {
      // Appel POST /login avec Axios
      const response = await api.post("/login", { email, password });

      const { token, user } = response.data;

      // On sauvegarde le token dans SecureStore (stockage sécurisé du téléphone)
      // SecureStore est utilisé car il chiffre les données (contrairement à AsyncStorage)
      await SecureStore.setItemAsync("token", token);

      // On met à jour le store Zustand avec les infos de l'utilisateur et le token
      setAuth(user, token);

      // La navigation vers UsersScreen se fait automatiquement grâce à la logique dans App.js
    } catch (error) {
      const message =
        error.response?.data?.message || "Une erreur s'est produite.";
      Alert.alert("Erreur", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#28a745",
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;
