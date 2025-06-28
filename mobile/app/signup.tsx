import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import CheckBox from "expo-checkbox";
import { useUserManager } from "@/hooks/useUserManager";
import selectFields from "@/static/selectFields";

export default function SignUpScreen() {
  const { registerUser } = useUserManager();
  const { role } = useLocalSearchParams();
  const nationalityOptions =
    selectFields().find((field) => field.name === "nationality")?.options || [];

  // Replace captcha with a simple verification

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    nationality: "",
    password: "",
    confirm_password: "",
    terms: false,
    role: role || "Tourist", // Use the role from params or default to Tourist
    status: "Active",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      role,
      status,
    } = form;
  
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !nationality ||
      !password ||
      !confirm_password
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    if (password !== confirm_password) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
  
    if (!terms) {
      Alert.alert("Notice", "You must agree to the terms and conditions");
      return;
    }
  
    try {
      const userData = {
        first_name,
        last_name,
        email: email.toUpperCase(),
        phone_number,
        nationality,
        password,
        confirm_password,
        terms,
        role,
        status,
        captchaToken: "mobile-app-verification-token",
      };
  
      console.log("Sending user data:", {
        ...userData,
        password: "[MASKED]",
        confirm_password: "[MASKED]",
      });
  
      await registerUser(userData);
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Registration failed");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* First Name and Last Name in a row */}
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

          {/* Phone Number */}
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("phone_number", text)}
            value={form.phone_number}
          />

          {/* Nationality */}
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

          {/* Terms and Conditions */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={form.terms}
              onValueChange={(val) => handleChange("terms", val)}
              color={form.terms ? "#0f172a" : undefined}
            />
            <Text style={styles.checkboxLabel}>
              I agree to the terms and conditions
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignUp} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>SIGN UP</Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginRedirectText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    color: "#0f172a",
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#0f172a",
  },
  signupButton: {
    backgroundColor: "#0f172a",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginRedirectText: {
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
