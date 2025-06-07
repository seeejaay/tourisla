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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Emergency Contact</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Municipality Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Municipality</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.municipality}
                  onValueChange={(value) => handleChange("municipality", value)}
                  style={styles.picker}
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

            {/* Type Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.type}
                  onValueChange={(value) => handleChange("type", value)}
                  style={styles.picker}
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

            {/* Contact Number Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                value={form.contact_number}
                onChangeText={(value) => handleChange("contact_number", value)}
                placeholder="Enter contact number"
                keyboardType="phone-pad"
              />
              {errors.contact_number && (
                <Text style={styles.errorText}>{errors.contact_number}</Text>
              )}
            </View>

            {/* Address Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Address (Optional)</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(value) => handleChange("address", value)}
                placeholder="Enter address"
                multiline
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: STATUS_BAR_HEIGHT,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#4361ee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: "#e63946",
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    backgroundColor: "#f1f1f1",
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    backgroundColor: "#4361ee",
    marginLeft: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
