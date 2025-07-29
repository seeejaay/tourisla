import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StaffHomeMobile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the
      Tourism Staff Dashboard!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1c5461",
    textAlign: "center",
  },
});
