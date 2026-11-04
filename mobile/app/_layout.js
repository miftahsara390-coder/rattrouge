// app/_layout.js - Root Layout pour Expo Router
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import useAuthStore from "../src/store/authStore";

export default function RootLayout() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  // Au démarrage, on vérifie si un token existe dans SecureStore
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        if (savedToken) {
          // Si un token existe, on le stocke dans Zustand
          setAuth(null, savedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log("Erreur lors de la restauration de la session:", error);
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

