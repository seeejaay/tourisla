import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as yup from "yup";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";

// Validation schema
const incidentSchema = yup.object().shape({
  incident_type: yup.string().required("Incident type is required"),
  location: yup.string().required("Location is required"),
  incident_date: yup.string().required("Date is required"),
  incident_time: yup.string().required("Time is required"),
  description: yup.string().required("Description is required"),
});

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function IncidentReportScreen() {
  const { submitReport, loading } = useIncidentManager();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined, setFieldValue: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setFieldValue("incident_date", formattedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined, setFieldValue: any) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      setFieldValue("incident_time", `${hours}:${minutes}`);
    }
  };

  const handlePickImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotoUri(asset.uri);
      setFieldValue("photo", {
        uri: asset.uri,
        name: asset.uri.split("/").pop() || "photo.jpg",
        type: "image/jpeg",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        backgroundColor="#f1f1f1"
        textColor="#03312e"
      />
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.heading}>Incident Report Form</Text>
      <Text style={{ marginHorizontal: 16, color: "#475569", fontSize: 14, marginBottom: 20 }}>
        Please fill out the form below to report an incident.
      </Text>

      <Formik
        initialValues={{
          incident_type: "",
          location: "",
          incident_date: "",
          incident_time: "",
          description: "",
          photo: null,
        }}
        validationSchema={incidentSchema}
        onSubmit={async (values, { resetForm }) => {
          const formData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            if (value) formData.append(key, value as any);
          });

          try {
            await submitReport(formData);
            Alert.alert("Success", "Incident report submitted successfully.", [
              { text: "OK", onPress: () => router.dismiss() },
            ]);
          } catch (err) {
            Alert.alert("Error", "Failed to submit incident report.");
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Incident Type */}
            <View style={styles.field}>
              <Text style={styles.label}>Incident Type</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("incident_type")}
                onBlur={handleBlur("incident_type")}
                value={values.incident_type}
              />
              {touched.incident_type && errors.incident_type && (
                <Text style={styles.error}>{errors.incident_type}</Text>
              )}
            </View>

            {/* Location */}
            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("location")}
                onBlur={handleBlur("location")}
                value={values.location}
              />
              {touched.location && errors.location && (
                <Text style={styles.error}>{errors.location}</Text>
              )}
            </View>

            {/* Date Picker */}
            <View style={styles.field}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {values.incident_date || "YYYY-MM-DD"}
                </Text>
                <Ionicons name="calendar" size={20} color="#475569" />
              </TouchableOpacity>
              {touched.incident_date && errors.incident_date && (
                <Text style={styles.error}>{errors.incident_date}</Text>
              )}
            </View>

            {/* Time Picker */}
            <View style={styles.field}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {values.incident_time || "HH:MM"}
                </Text>
                <Ionicons name="time" size={20} color="#475569" />
              </TouchableOpacity>
              {touched.incident_time && errors.incident_time && (
                <Text style={styles.error}>{errors.incident_time}</Text>
              )}
            </View>

            {/* Show native pickers */}
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={new Date()}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => handleDateChange(event, date, setFieldValue)}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                mode="time"
                value={new Date()}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, time) => handleTimeChange(event, time, setFieldValue)}
              />
            )}

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />
              {touched.description && errors.description && (
                <Text style={styles.error}>{errors.description}</Text>
              )}
            </View>

            {/* Photo Picker */}
            <View style={styles.field}>
              <Text style={styles.label}>Photo</Text>
              <TouchableOpacity
                onPress={() => handlePickImage(setFieldValue)}
                style={styles.imagePicker}
              >
                <Text style={styles.imagePickerText}>Choose File</Text>
                {photoUri && (
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: 120, height: 120, marginTop: 8 }}
                />
              )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit as any}
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  heading: { fontSize: 25, fontWeight: "900", marginBottom: 4, color: "#1c5461", marginHorizontal: 16, marginTop: 20 },
  field: { marginBottom: 16, marginHorizontal: 16 },
  label: { marginBottom: 6, fontSize: 14, color: "#475569" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  error: { color: "red", fontSize: 12, marginTop: 4 },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#9eaabb",
    borderRadius: 6,
    padding: 10,
  },
  imagePickerText: { color: "#9eaabb", fontWeight: "600" },
  submitButton: {
    backgroundColor: "#2ac6a6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dateTimeInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#0f172a",
  },
});
