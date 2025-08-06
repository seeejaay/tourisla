import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useOperatorQrManager } from "@/hooks/useOperatorQr";
import { useCreateBooking } from "@/hooks/useBookingManager";
import { useTourPackageManager } from "@/hooks/useTourPackagesManager";
import BookingSchemaMobile from "@/static/booking/bookingSchema";
import { bookingFields } from "@/static/booking/booking";
import HeaderWithBack from "@/components/HeaderWithBack";
import InputSpinner from "@/components/InputSpinner";

export default function BookScreen() {
  const router = useRouter();
  const { id: packageId } = useLocalSearchParams();

  const { fetchOne: fetchTourPackage } = useTourPackageManager();
  const {
    fetchQr,
    loading: qrLoading,
    error: qrError,
  } = useOperatorQrManager();
  const {
    create,
    loading: bookingLoading,
    error: bookingError,
  } = useCreateBooking();

  const [tourPackage, setTourPackage] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({
    scheduled_date: "",
    number_of_guests: 1,
    total_price: 0,
    proof_of_payment: null,
    notes: "",
    companions: [],
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch package & QR
  useEffect(() => {
    async function fetchPackageAndQr() {
      const pkg = await fetchTourPackage(
        Array.isArray(packageId) ? packageId[0] : packageId
      );
      if (pkg) {
        setTourPackage(pkg);
        setForm((prev) => ({
          ...prev,
          total_price: Number(pkg.price) * (prev.number_of_guests || 1),
        }));
        const operatorId = pkg.touroperator_id || pkg.tour_operator_id;
        if (operatorId) {
          try {
            const qr = await fetchQr(String(operatorId));
            setQrData(qr?.data?.[0] || null);
          } catch {
            setQrData(null);
          }
        }
      }
    }
    fetchPackageAndQr();
  }, [packageId, fetchTourPackage, fetchQr]);

  // Update price dynamically
  useEffect(() => {
    if (tourPackage) {
      setForm((prev) => ({
        ...prev,
        total_price: Number(tourPackage.price) * (prev.number_of_guests || 1),
      }));
    }
  }, [form.number_of_guests, tourPackage]);

  // Ensure companions array matches number_of_guests - 1
  useEffect(() => {
    if (form.number_of_guests > 1) {
      setForm((prev) => {
        const companions = prev.companions || [];
        const needed = form.number_of_guests - 1;
        if (companions.length !== needed) {
          const newCompanions = Array.from(
            { length: needed },
            (_, idx) =>
              companions[idx] || {
                first_name: "",
                last_name: "",
                age: "",
                sex: "",
                phone_number: "",
              }
          );
          return { ...prev, companions: newCompanions };
        }
        return prev;
      });
    } else {
      setForm((prev) => ({ ...prev, companions: [] }));
    }
  }, [form.number_of_guests]);

  const pickProofOfPayment = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    setForm((prev) => ({
      ...prev,
      proof_of_payment: result.assets ? result.assets[0] : null,
    }));
  };

  const handleSubmit = async () => {
    setFormError(null);

    // Check available slots
    if (form.number_of_guests > (tourPackage?.available_slots || 0)) {
      setFormError("Number of guests exceeds available slots.");
      return;
    }

    const result = BookingSchemaMobile.safeParse(form);
    if (!result.success) {
      const errorMessages = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)
        .join("\n");
      setFormError(errorMessages || "Invalid input.");
      return;
    }

    if (!qrData) {
      setFormError("Payment QR code not available.");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("scheduled_date", String(tourPackage.date_start));
    formData.append("number_of_guests", String(form.number_of_guests));
    formData.append("total_price", String(form.total_price));
    formData.append("notes", form.notes || "");
    formData.append("package_id", String(tourPackage.id));
    formData.append("operator_qr_id", String(qrData.id));
    formData.append("payment_method", "QR");
    formData.append("companions", JSON.stringify(form.companions));

    if (
      form.proof_of_payment &&
      form.proof_of_payment.uri &&
      form.proof_of_payment.name
    ) {
      // @ts-ignore
      formData.append("proof_of_payment", {
        uri: form.proof_of_payment.uri,
        name: form.proof_of_payment.name || "proof.jpg",
        type: form.proof_of_payment.mimeType || "image/jpeg",
      });
    } else {
      setFormError("Proof of payment is required and must be a valid file.");
      return;
    }

    try {
      await create(formData);
      alert("Booking successful!");
      router.replace({
        pathname: "/tourist/tourist_dashboard",
        params: { refresh: new Date().getTime() },
      });
      router.dismiss(2);
    } catch (err) {
      setFormError("Booking failed. Please try again.");
      console.error("Booking error:", err);
    }
  };

  // Render companion fields
  const renderCompanionFields = () => {
    if (form.number_of_guests <= 1) return null;
    return (
      <View style={{ marginBottom: 16 }}>
        <Text
          style={[
            styles.labelWithSpacing,
            { fontWeight: "700", color: "#1c5461" },
          ]}
        >
          Companion Details
        </Text>
        {form.companions.map((companion: any, idx: number) => (
          <View
            key={idx}
            style={{
              marginBottom: 12,
              padding: 8,
              backgroundColor: "#f0fdf4",
              borderRadius: 8,
            }}
          >
            <Text
              style={{ fontWeight: "600", color: "#3e979f", marginBottom: 4 }}
            >
              Companion {idx + 1}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={companion.first_name}
              onChangeText={(text) => {
                const companions = [...form.companions];
                companions[idx] = { ...companions[idx], first_name: text };
                setForm((f) => ({ ...f, companions }));
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={companion.last_name}
              onChangeText={(text) => {
                const companions = [...form.companions];
                companions[idx] = { ...companions[idx], last_name: text };
                setForm((f) => ({ ...f, companions }));
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={companion.age ? String(companion.age) : ""}
              onChangeText={(text) => {
                const companions = [...form.companions];
                companions[idx] = { ...companions[idx], age: Number(text) };
                setForm((f) => ({ ...f, companions }));
              }}
            />
            <View style={styles.picker}>
              <Picker
                selectedValue={companion.sex}
                onValueChange={(value) => {
                  const companions = [...form.companions];
                  companions[idx] = { ...companions[idx], sex: value };
                  setForm((f) => ({ ...f, companions }));
                }}
                mode="dropdown"
              >
                <Picker.Item label="Select Sex" value="" />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={companion.phone_number}
              onChangeText={(text) => {
                const companions = [...form.companions];
                companions[idx] = { ...companions[idx], phone_number: text };
                setForm((f) => ({ ...f, companions }));
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="Package Details"
        backgroundColor="#transparent"
        textColor="#002b11"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bookingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0ea5e9"
            style={{ marginTop: 32 }}
          />
        ) : (
          <>
            {formError && <Text style={styles.errorText}>{formError}</Text>}

            <Text style={styles.heading}>
              Book: {tourPackage?.package_name}
            </Text>

            {bookingFields.map((field) => {
              if (field.name === "proof_of_payment") {
                return (
                  <View key={field.name}>
                    <Text style={styles.labelWithSpacing}>
                      {field.label || "Proof of Payment"}:
                    </Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={pickProofOfPayment}
                    >
                      <Text style={styles.uploadButtonText}>
                        {form.proof_of_payment?.name
                          ? `File: ${form.proof_of_payment.name}`
                          : "Choose File"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              if (field.name === "number_of_guests") {
                return (
                  <View key={field.name}>
                    <InputSpinner
                      label={field.label || "Number of Guests"}
                      value={form.number_of_guests}
                      onChange={(newVal) =>
                        setForm((prev) => ({
                          ...prev,
                          number_of_guests: newVal,
                        }))
                      }
                      min={1}
                      max={tourPackage?.available_slots || 1}
                    />
                    {tourPackage?.available_slots && (
                      <Text style={styles.helperText}>
                        Max guests allowed: {tourPackage.available_slots}
                      </Text>
                    )}
                  </View>
                );
              }

              if (field.name === "scheduled_date") {
                return (
                  <View key={field.name}>
                    <Text style={styles.labelWithSpacing}>
                      {field.label || "Scheduled Date"}:
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={
                        tourPackage?.date_start
                          ? new Date(tourPackage.date_start)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      editable={false}
                    />
                  </View>
                );
              }

              if (field.name === "total_price") {
                return (
                  <View key={field.name}>
                    <Text style={styles.textPrice}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      value={`₱${form.total_price.toFixed(2)}`}
                      editable={false}
                    />
                  </View>
                );
              }
            })}

            {renderCompanionFields()}

            <Text style={styles.label}>Pay via QR Code</Text>
            {qrLoading ? (
              <Text style={styles.helperText}>Loading QR code...</Text>
            ) : qrError ? (
              <Text style={styles.errorText}>Failed to load QR code.</Text>
            ) : qrData && qrData.qr_image_url ? (
              <View style={{ alignItems: "center", marginBottom: 8 }}>
                <Image
                  source={{ uri: qrData.qr_image_url }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
                <Text style={styles.helperText}>
                  Scan this QR code to pay the package fee.
                </Text>
              </View>
            ) : (
              <Text style={styles.helperText}>No QR code available.</Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={bookingLoading}
              style={[styles.bookButton, bookingLoading && { opacity: 0.5 }]}
            >
              <Text style={styles.bookButtonText}>
                {bookingLoading ? "Processing..." : "Book Now"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#002b11",
    marginVertical: 8,
  },
  errorText: { color: "#ef4444", marginVertical: 8 },
  labelWithSpacing: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7b7b7b",
    marginBottom: 8,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    marginBottom: 8,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#898989",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  uploadButtonText: { color: "#7b7b7b", fontWeight: "500", flex: 1 },
  helperText: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  bookButton: {
    backgroundColor: "#61daaf",
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 16,
    width: "100%",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  textPrice: {
    marginBottom: 8,
    fontWeight: "700",
    alignSelf: "flex-end",
    color: "#00a63e",
  },
  qrImage: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: "#bfdbfe",
    borderRadius: 8,
  },
  picker: {
    height: 44,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    marginBottom: 8,
    justifyContent: "center",
  },
});
