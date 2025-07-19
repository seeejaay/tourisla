// @/components/registration/RegisFloatingSelector.tsx

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  onClose: () => void;
}

const RegisFloatingSelector: React.FC<Props> = ({ onClose }) => {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    onClose();
    requestAnimationFrame(() => {
      router.push(screen);
    });
  };

  return (
<Modal transparent animationType="fade" visible onRequestClose={onClose}>
  <TouchableWithoutFeedback onPress={onClose}>
    <View style={styles.backdrop}>
      {/* This second wrapper prevents touch bubbling */}
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.container}>
          <Text style={styles.title}>Registration Options</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              handleNavigate("/tourist/regis/island_registration/island_registration")
            }
          >
            <Ionicons name="earth" size={24} color="#31808f" style={styles.icon} />
            <Text style={styles.optionText}>Island Entry Registration</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              handleNavigate("/tourist/regis/visitor_registration/visitor_registration")
            }
          >
            <MaterialIcons
              name="person-add-alt-1"
              size={24}
              color="#31808f"
              style={styles.icon}
            />
            <Text style={styles.optionText}>Visitor Registration</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>


  );
};

export default RegisFloatingSelector;

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // ensure it's above everything
      },
      container: {
        width: "90%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 16,
        elevation: 10,
        position: "absolute",
        bottom: 100, // position it above the tab bar
      },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2c3e50",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: {
    color: "#777",
    fontSize: 16,
  },
});
