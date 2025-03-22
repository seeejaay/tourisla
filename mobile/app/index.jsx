import { StyleSheet, Text, View } from "react-native";
import React from "react";
import "../global.css";
const index = () => {
  return (
    <View className="flex items-center justify-center h-full">
      <Text className="text-3xl">Hello World</Text>
      <Text className="bg-red-400">index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
