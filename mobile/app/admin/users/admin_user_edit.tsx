import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useUserManager } from "@/hooks/useUserManager";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import signupSchema, { signupSchema as SignupType } from "@/static/userManagerSchema";
import { sanitizePHPhoneNumber } from "@/static/userManagerSchema";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function AdminUserEdit() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { viewUser, updateUser, loading, error } = useUserManager();

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      role: "Tourist",
      nationality: "",
      terms: true,
      status: "Active",
    },
  });

  useEffect(() => {
    console.log("User ID:", id); // Debug log
    if (id && typeof id === "string") {
      const loadUser = async () => {
        try {
          const data = await viewUser(id);
          console.log("User data:", data); // Debug log
  
          // Transform phone_number to the required format
          const transformedData = {
            ...data,
            phone_number: sanitizePHPhoneNumber(data.phone_number), // Use sanitizePHPhoneNumber
            user_id: String(data.user_id), // Ensure user_id is a string
          };
  
          Object.entries(transformedData).forEach(([key, value]) => {
            setValue(key as keyof SignupType, value as string | boolean);
          });
          setInitialDataLoaded(true);
        } catch (err) {
          console.error("Error loading user data:", err); // Debug log
          Alert.alert("Error", "Failed to load user data");
        }
      };
      loadUser();
    }
  }, [id]);

  const onSubmit = async (formData: SignupType) => {
    console.log("Form submitted:", formData); // Debug log
    try {
      if (typeof id === "string") {
        const payload = { ...formData, user_id: id };
        console.log("Payload sent to updateUser:", payload); // Debug log
        await updateUser(payload);
        Alert.alert("Success", "User updated successfully");
        router.push("/admin/users/admin_users");
      } else {
        Alert.alert("Error", "Invalid user ID");
      }
    } catch (err) {
      console.error("Update error:", err); // Debug log
      Alert.alert("Error", "Failed to update user");
    }
  };

  if (!initialDataLoaded) {
    return <Text style={{ padding: 20 }}>Loading user info...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit User</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Controller
          control={control}
          name="first_name"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="First Name"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
              {errors.first_name && (
                <Text style={styles.errorText}>{errors.first_name.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="last_name"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Last Name"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
              {errors.last_name && (
                <Text style={styles.errorText}>{errors.last_name.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Phone Number (e.g., +639XXXXXXXXX)"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
              />
              {errors.phone_number && (
                <Text style={styles.errorText}>{errors.phone_number.message}</Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
        >
          <Text style={styles.buttonText}>Update User</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50 + STATUS_BAR_HEIGHT,
    backgroundColor: "#007dab",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
    zIndex: 50,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ecf0f1",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    padding: 16,
    marginTop: 50 + STATUS_BAR_HEIGHT, // Adjust for header height
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#007dab",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});