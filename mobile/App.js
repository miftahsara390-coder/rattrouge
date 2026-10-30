// App.js - Point d'entrée de l'application mobile
// Gère la navigation et la restauration de la session au démarrage
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import UsersScreen from "./src/screens/UsersScreen";
import useAuthStore from "./src/store/authStore";

const Stack = createNativeStackNavigator();

function App() {
  // isLoading : vrai pendant qu'on vérifie le token au démarrage
  const [isLoading, setIsLoading] = useState(true);

  // On récupère l'état et les actions du store Zustand
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Au démarrage, on vérifie si un token existe dans SecureStore
  // Cela permet de restaurer la session si l'utilisateur avait déjà été connecté
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        if (savedToken) {
          // Si un token existe, on le met dans le store
          setAuth(null, savedToken);
        }
      } catch (error) {
        console.log("Erreur lors de la restauration de la session:", error);
      } finally {
        // On arrête le chargement dans tous les cas
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Pendant la vérification du token, on affiche un indicateur de chargement
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          // Si on a un token → l'utilisateur est connecté → on affiche UsersScreen
          <Stack.Screen name="Users" component={UsersScreen} />
        ) : (
          // Sinon → on affiche les écrans de connexion/inscription
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// On enregistre le composant manuellement — nécessaire avec Hermes/Expo
AppRegistry.registerComponent("main", () => App);

export default App;
