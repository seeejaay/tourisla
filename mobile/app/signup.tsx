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
  const [isVerified, setIsVerified] = useState(false);

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

  // Simple verification challenge
  const [verificationCode, setVerificationCode] = useState("");
  const [expectedCode, setExpectedCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  // Generate a random 4-digit code
  const generateVerificationCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setExpectedCode(code);
    setShowVerification(true);
    return code;
  };

  const verifyCode = () => {
    if (verificationCode === expectedCode) {
      setIsVerified(true);
      setShowVerification(false);
      Alert.alert("Success", "Verification completed");
    } else {
      Alert.alert("Error", "Incorrect verification code. Please try again.");
      setVerificationCode("");
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

    if (!isVerified) {
      Alert.alert("Notice", "Please complete the verification");
      const code = generateVerificationCode();
      Alert.alert("Verification Code", `Your verification code is: ${code}`);
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
        // Use a fixed token for development
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

  if (showVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Enter Verification Code</Text>
        <Text style={styles.verificationSubtitle}>
          Please enter the 4-digit code: {expectedCode}
        </Text>
        <TextInput
          style={styles.verificationInput}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="Enter 4-digit code"
        />
        <View style={styles.verificationButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setShowVerification(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.verifyButton]}
            onPress={verifyCode}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

          {/* Verification */}
          <View style={styles.verificationRow}>
            <Text style={styles.verificationLabel}>
              {isVerified ? "✓ Verification Completed" : "Verify you're human"}
            </Text>
            <TouchableOpacity
              style={[
                styles.verificationButton,
                isVerified ? styles.verificationCompleted : {},
              ]}
              onPress={() => {
                if (!isVerified) {
                  const code = generateVerificationCode();
                  Alert.alert(
                    "Verification Code",
                    `Your verification code is: ${code}`
                  );
                }
              }}
            >
              <Text style={styles.verificationButtonText}>
                {isVerified ? "Verified" : "Verify Now"}
              </Text>
            </TouchableOpacity>
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
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  verificationLabel: {
    fontSize: 16,
    color: "#0f172a",
    flex: 1,
  },
  verificationButton: {
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 8,
    width: 120,
    alignItems: "center",
  },
  verificationCompleted: {
    backgroundColor: "#10b981",
  },
  verificationButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  verificationContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0f172a",
  },
  verificationSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#64748b",
  },
  verificationInput: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  verificationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
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
  verifyButton: {
    backgroundColor: "#0f172a",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
