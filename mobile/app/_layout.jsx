import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import "../global.css";
const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
