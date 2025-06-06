import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { hotlineSchema } from "@/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/static/hotline/hotline";

const STATUS_BAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function AdminHotlineAddScreen() {
  const router = useRouter();
  const { createHotline } = useHotlineManager();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<{
    municipality: "SANTA_FE" | "BANTAYAN" | "MADRIDEJOS";
    type: "MEDICAL" | "POLICE" | "BFP" | "NDRRMO" | "COAST_GUARD";
    contact_number: string;
    address: string;
  }>({
    municipality: "BANTAYAN",
    type: "MEDICAL",
    contact_number: "",
    address: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      hotlineSchema.parse(form);
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        const path = err.path[0];
        formattedErrors[path] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await createHotline(form);
      if (result) {
        Alert.alert(
          "Success",
          "Emergency contact added successfully",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to the hotlines list instead of replacing the route
                router.back();
                // Alternative approach if back() doesn't work properly:
                // router.push("/admin/hotlines/admin_hotlines");
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to add emergency contact");
      }
    } catch (error) {
      console.error("Error creating hotline:", error);
      Alert.alert("Error", "Failed to add emergency contact");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get icon based on hotline type
  const getHotlineIcon = (type: string) => {
    switch(type) {
      case "MEDICAL":
        return "medical-bag";
      case "POLICE":
        return "police-badge";
      case "BFP":
        return "fire-truck";
      case "NDRRMO":
        return "shield-alert";
      case "COAST_GUARD":
        return "sail-boat";
      default:
        return "phone";
    }
  };

  // Helper function to get color based on hotline type
  const getTypeColor = (type: string) => {
    switch(type) {
      case "MEDICAL":
        return "#ef4444";
      case "POLICE":
        return "#3b82f6";
      case "BFP":
        return "#f97316";
      case "NDRRMO":
        return "#eab308";
      case "COAST_GUARD":
        return "#06b6d4";
      default:
        return "#6366f1";
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#007dab" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Emergency Contact</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Type Preview */}
          <View style={styles.previewSection}>
            <View style={[styles.iconCircle, { backgroundColor: `${getTypeColor(form.type)}20` }]}>
              <MaterialCommunityIcons name={getHotlineIcon(form.type)} size={40} color={getTypeColor(form.type)} />
            </View>
            <Text style={[styles.previewText, { color: getTypeColor(form.type) }]}>
              {form.type.replace(/_/g, " ")}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Municipality Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Municipality</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.municipality}
                  onValueChange={(value) => handleChange("municipality", value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {hotlineFields[0].options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
              {errors.municipality && (
                <Text style={styles.errorText}>{errors.municipality}</Text>
              )}
            </View>

            {/* Type Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hotline Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.type}
                  onValueChange={(value) => handleChange("type", value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {hotlineFields[1].options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
              {errors.type && (
                <Text style={styles.errorText}>{errors.type}</Text>
              )}
            </View>

            {/* Contact Number Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="phone" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.contact_number}
                  onChangeText={(value) => handleChange("contact_number", value)}
                  placeholder="+63XXXXXXXXXX"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              {errors.contact_number && (
                <Text style={styles.errorText}>{errors.contact_number}</Text>
              )}
            </View>

            {/* Address Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Address (Optional)</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.address}
                  onChangeText={(value) => handleChange("address", value)}
                  placeholder="Enter address"
                  placeholderTextColor="#94a3b8"
                  multiline
                />
              </View>
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Save Emergency Contact</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  header: {
    height: 50 + STATUS_BAR_HEIGHT,
    backgroundColor: "#007dab",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  previewSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  previewText: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#0f172a",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#0284c7",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
