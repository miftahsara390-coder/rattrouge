// app/(app)/_layout.js - Layout pour les écrans protégés
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "../../src/store/authStore";

export default function AppLayout() {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  // Si l'utilisateur n'est pas connecté, redirection vers /login
  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="users" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

