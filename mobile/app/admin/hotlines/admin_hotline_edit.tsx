import React, { useState, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { hotlineSchema } from "@/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/static/hotline/hotline";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_BAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function AdminHotlineEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { viewHotline, updateHotline } = useHotlineManager();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<{
    id: number;
    municipality: "SANTA_FE" | "BANTAYAN" | "MADRIDEJOS";
    type: "MEDICAL" | "POLICE" | "BFP" | "NDRRMO" | "COAST_GUARD";
    contact_number: string;
    address: string;
  }>({
    id: Number(id),
    municipality: "BANTAYAN",
    type: "MEDICAL",
    contact_number: "",
    address: "",
  });

  // Get type color
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

  // Get hotline icon
  const getHotlineIcon = (type: string) => {
    switch(type) {
      case "MEDICAL":
        return "hospital";
      case "POLICE":
        return "police-badge";
      case "BFP":
        return "fire";
      case "NDRRMO":
        return "alert";
      case "COAST_GUARD":
        return "ship";
      default:
        return "phone";
    }
  };

  // Fetch hotline data when component mounts
  useEffect(() => {
    const fetchHotlineData = async () => {
      try {
        setLoading(true);
        const hotline = await viewHotline(Number(id));
        if (hotline) {
          setForm({
            id: hotline.id,
            municipality: hotline.municipality as any,
            type: hotline.type as any,
            contact_number: hotline.contact_number,
            address: hotline.address || "",
          });
        } else {
          Alert.alert("Error", "Failed to load hotline data");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching hotline:", error);
        Alert.alert("Error", "Failed to load hotline data");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchHotlineData();
  }, [id]);

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

    setSubmitting(true);
    try {
      const result = await updateHotline(form);
      if (result) {
        Alert.alert(
          "Success",
          "Emergency contact updated successfully",
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to update emergency contact");
      }
    } catch (error) {
      console.error("Error updating hotline:", error);
      Alert.alert("Error", "Failed to update emergency contact");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4cc9f0" />
          <Text style={styles.loadingText}>Loading hotline data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#007dab" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Emergency Contact</Text>
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

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Type Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.type}
                  onValueChange={(value) => handleChange("type", value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Medical" value="MEDICAL" />
                  <Picker.Item label="Police" value="POLICE" />
                  <Picker.Item label="Fire Department" value="BFP" />
                  <Picker.Item label="Disaster Response" value="NDRRMO" />
                  <Picker.Item label="Coast Guard" value="COAST_GUARD" />
                </Picker>
              </View>
              {errors.type && (
                <Text style={styles.errorText}>{errors.type}</Text>
              )}
            </View>

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
                  <Picker.Item label="Bantayan" value="BANTAYAN" />
                  <Picker.Item label="Santa Fe" value="SANTA_FE" />
                  <Picker.Item label="Madridejos" value="MADRIDEJOS" />
                </Picker>
              </View>
              {errors.municipality && (
                <Text style={styles.errorText}>{errors.municipality}</Text>
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
                  placeholder="Enter contact number"
                  keyboardType="phone-pad"
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
                  style={[styles.input, styles.textArea]}
                  value={form.address}
                  onChangeText={(value) => handleChange("address", value)}
                  placeholder="Enter address"
                  multiline
                  numberOfLines={3}
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
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Update Contact</Text>
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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
});

