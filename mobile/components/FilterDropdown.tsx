import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  findNodeHandle,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toTitleCase } from "@/lib/utils/textFormat";

type FilterDropdownProps = {
  label?: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
}: FilterDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTop, setModalTop] = useState<number | null>(null);
  const iconRef = useRef<View>(null);

  const handleOpenModal = () => {
    const nodeHandle = findNodeHandle(iconRef.current);
    if (nodeHandle) {
      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        setModalTop(pageY + 23 ); // 20px below the icon
        setModalVisible(true);
      });
    }
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <View ref={iconRef}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleOpenModal}
      >
        <Ionicons name="filter" size={20} color="#1c5461" />
      </TouchableOpacity>

      {modalVisible && (
        <Modal transparent animationType="fade">
          <SafeAreaView style={styles.modalOverlay}>
            <View style={[styles.modalContainer, modalTop !== null && { top: modalTop }]}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => handleSelect("")}>
                <Text style={styles.optionText}>All</Text>
              </TouchableOpacity>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelect(item)}>
                    <View style={styles.optionContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          selected === item && styles.selectedOption,
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {toTitleCase(item)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 58,
    width: 58,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    position: "absolute",
    right: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    width: "50%",
    elevation: 5,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1c5461",
  },
  optionContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },
  optionText: {
    fontSize: 12,
    color: "#1c5461",
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#287674",
  },
  closeButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#287674",
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
