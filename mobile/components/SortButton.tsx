import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface SortButtonProps {
  sortOption: "recent" | "newest";
  setSortOption: (option: "recent" | "newest") => void;
}

export default function SortButton({ sortOption, setSortOption }: SortButtonProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const options = [
    { label: <Text style={{ fontWeight: "600" }}>Newest First</Text>, value: "recent" },
    { label: <Text style={{ fontWeight: "600" }}>Oldest First</Text>, value: "newest" },
  ];

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Pressable style={styles.sortButton} onPress={() => setModalVisible(true)}>
            <FontAwesome name="sort" size={24} color="#4c4c4c" />
        </Pressable>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.popup}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionButton,
                  sortOption === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  setSortOption(option.value as "recent" | "newest");
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: sortOption === option.value ? "#fff" : "#374151", fontWeight: "900" }}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sortButton: {
    height: '100%',
    width: 55,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ececee',
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
  },
  popup: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 90,
    gap: 2,
    padding: 5,
    width: 180,
    marginRight: 20,
    alignSelf: "flex-end",
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: '#ececee',
    borderWidth: 1,
    alignItems: "flex-end",
    overflow: "hidden",
  },
  selectedOption: {
    backgroundColor: "#00bbbb",
  },
});
