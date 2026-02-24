import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import CheckBox from "expo-checkbox";
import { useUserManager } from "@/hooks/useUserManager";
import selectFields from "@/static/selectFields";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SignUpScreen() {
  const { registerUser } = useUserManager();
  const { role } = useLocalSearchParams();
  const nationalityOptions =
    selectFields().find((field) => field.name === "nationality")?.options || [];

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    nationality: "",
    password: "",
    confirm_password: "",
    terms: false,
    role: role || "Tourist",
    status: "Active",
    sex: "Not Specified",
    birth_date: "",
    captchaToken: "mobile-app-verification-token",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    // Android closes automatically, iOS requires manual state toggle usually via a button
    // but for simplicity here we handle both.
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setDateValue(selectedDate);
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      handleChange("birth_date", formattedDate);
    }
  };

  const handleSignUp = async () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      nationality,
      password,
      confirm_password,
      terms,
      birth_date,
    } = form;

    // 1. Basic Validation
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !nationality ||
      !password ||
      !confirm_password ||
      !birth_date
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // 2. Age Validation (18+)
    const today = new Date();
    const birthDate = new Date(birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      Alert.alert(
        "Age Restriction",
        "You must be at least 18 years old to register.",
      );
      return;
    }

    // 3. Password Match
    if (password !== confirm_password) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // 4. Terms Check
    if (!terms) {
      Alert.alert("Notice", "You must agree to the terms and conditions");
      return;
    }

    try {
      const userData = {
        ...form,
        email: email.toUpperCase(),
        captchaToken: form.captchaToken || "mobile-app-verification-token",
      };

      await registerUser(userData);
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Registration failed: " + (error as any).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.formContainer}>
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextInput
                placeholder="First Name"
                style={styles.input}
                onChangeText={(text) => handleChange("first_name", text)}
                value={form.first_name}
              />
            </View>
            <View style={styles.nameField}>
              <TextInput
                placeholder="Last Name"
                style={styles.input}
                onChangeText={(text) => handleChange("last_name", text)}
                value={form.last_name}
              />
            </View>
          </View>

          {/* Email */}
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            onChangeText={(text) => handleChange("email", text)}
            value={form.email}
          />

          {/* Phone */}
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("phone_number", text)}
            value={form.phone_number}
          />

          {/* Gender Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.sex}
              onValueChange={(value) => handleChange("sex", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
              <Picker.Item label="Not Specified" value="Not Specified" />
            </Picker>
          </View>

          {/* Birth Date Picker */}
          <View style={styles.dateContainer}>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  placeholder="Birth Date (YYYY-MM-DD)"
                  style={styles.input}
                  value={form.birth_date}
                  editable={false}
                />
              </View>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dateValue}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Nationality Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.nationality}
              onValueChange={(value) => handleChange("nationality", value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Nationality" value="" />
              {nationalityOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              onChangeText={(text) => handleChange("password", text)}
              value={form.password}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              style={styles.passwordInput}
              onChangeText={(text) => handleChange("confirm_password", text)}
              value={form.confirm_password}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={form.terms}
              onValueChange={(val) => handleChange("terms", val)}
              color={form.terms ? "#7eccb6" : undefined}
            />
            <Text
              style={styles.checkboxLabel}
              onPress={() => router.push("/terms_page")}
            >
              I agree to the terms and conditions
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity onPress={handleSignUp} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginRedirectText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40, // Keeps the bottom content accessible
  },
  formContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    color: "#1c5461",
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  nameField: {
    width: "48%",
  },
  input: {
    borderColor: "#7eccb6",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    color: "#000",
  },
  pickerWrapper: {
    borderColor: "#7eccb6",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordInput: {
    borderColor: "#7eccb6",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingRight: 45,
    backgroundColor: "#ffffff",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#1c5461",
    fontSize: 14,
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "#3f9678",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginRedirectText: {
    textAlign: "center",
    color: "#1c5461",
    fontSize: 14,
    fontWeight: "500",
  },
  dateContainer: {
    width: "100%",
  },
});
