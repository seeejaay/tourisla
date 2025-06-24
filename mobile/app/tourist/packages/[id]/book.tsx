// app/tourist/packages/[id]/book.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, StatusBar, TextInput, TouchableOpacity, Platform, Image } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useOperatorQrManager } from "@/hooks/useOperatorQr";
import { useCreateBooking } from "@/hooks/useBookingManager";
import { useTourPackageManager } from "@/hooks/useTourPackagesManager";
import BookingSchemaMobile from "@/static/booking/bookingSchema";
import { bookingFields } from "@/static/booking/booking";


interface TourPackageDetailsScreenProps {
  headerHeight: number;
}
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
export default function BookScreen({ headerHeight }) {
  interface Booking {
    id: number;
    scheduled_date: string;
    status: string;
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: packageId } = useLocalSearchParams();

  // Hooks
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

  // State
  const [tourPackage, setTourPackage] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({
    scheduled_date: "",
    number_of_guests: 1,
    total_price: 0,
    proof_of_payment: null,
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchPackageAndQr() {
      const pkg = await fetchTourPackage(Array.isArray(packageId) ? packageId[0] : packageId);
      if (pkg) {
        setTourPackage(pkg);
        setForm((prev) => ({
          ...prev,
          total_price: Number(pkg.price) * (prev.number_of_guests || 1),
        }));
        // Use correct property for operator ID
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, fetchTourPackage, fetchQr]);

  // Dynamically update total_price when number_of_guests changes
  useEffect(() => {
    if (tourPackage) {
      setForm((prev) => ({
        ...prev,
        total_price: Number(tourPackage.price) * (prev.number_of_guests || 1),
      }));
    }
  }, [form.number_of_guests, tourPackage]);

  // Handle form input
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

// Handle booking submit
const handleSubmit = async () => {
  setFormError(null);
  console.log("Submitting booking with form data:", form);

  // Zod validation
  const result = BookingSchemaMobile.safeParse(form);
  if (!result.success) {
    const errorMessages = Object.values(result.error.flatten().fieldErrors)
      .flat()
      .filter(Boolean)
      .join("\n");
    setFormError(errorMessages || "Invalid input.");
    console.error("Validation errors:", errorMessages);
    return;
  }
  if (!qrData) {
    setFormError("Payment QR code not available.");
    console.error("Payment QR code not available.");
    return;
  }

  // Prepare booking data
  const bookingData: any = {
    ...form,
    scheduled_date: tourPackage.date_start,
    package_id: tourPackage.id,
    operator_qr_id: qrData.id,
    payment_method: "QR",
  };

  // If proof_of_payment is a file, use FormData
  let payload: any = bookingData;
  if (form.proof_of_payment) {
    payload = new FormData();
  
    // Append all text fields
    Object.keys(bookingData).forEach((key) => {
      if (key !== "proof_of_payment") {
        payload.append(key, bookingData[key]);
      }
    });
  
    // ✅ Convert the picked file into a Blob
    const fileUri = form.proof_of_payment.uri;
    const fileBlob = await fetch(fileUri).then(res => res.blob());
    payload.append(
      "proof_of_payment",
      fileBlob,
      form.proof_of_payment.name
    );
  }
  try {
    await create(payload);
    alert("Booking successful!");
    router.push("/booking/tour-packages");
  } catch (err) {
    setFormError("Booking failed. Please try again.");
  }
};


return (
  <View style={[styles.container, { paddingTop: headerHeight }]}>
    <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
    </View>
    <ScrollView>
    {bookingLoading ? (
      <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 32 }} />
    ) : error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : (
      <>
        {/* Heading */}
        <Text style={styles.heading}>Book: {tourPackage?.package_name}</Text>

        <Text>Scheduled Date:</Text>
        <TextInput
          style={styles.input}
          value={
            tourPackage?.date_start
              ? new Date(tourPackage.date_start)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          readOnly
          className="w-full border rounded bg-gray-100 cursor-not-allowed"
        />
        <Text>Notes</Text>
        <TextInput
          style={styles.input}
          value={form.notes}
          placeholder="Enter any additional notes"
          multiline
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, notes: text }))
          }
        />

        <Text>Number of Guests:</Text>
        
        <View style={styles.spinnerContainer}>
            <TextInput
              style={styles.spinnerInput}
              keyboardType="number-pad"
              value={String(form.number_of_guests)}
              onChangeText={(text) => setForm((prev) => ({ ...prev, number_of_guests: Number(text) || 1 }))}
            />
            <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setForm((prev) => ({ ...prev, number_of_guests: prev.number_of_guests + 1 }))}
              style={styles.spinnerButton}
            >
              <Text style={styles.spinnerButtonText}>▲</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setForm((prev) => ({ ...prev, number_of_guests: Math.max(1, prev.number_of_guests - 1) }))}
              style={styles.spinnerButton}
            >
              <Text style={styles.spinnerButtonText}>▼</Text>
            </TouchableOpacity>
            </View>
        </View>

        <Text style={styles.textPrice}>Total Price: ₱{form.total_price}</Text>

        <Text>Proof of Payment:</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickProofOfPayment}>
          <Text style={styles.uploadButtonText}>Pick Proof of Payment</Text>
        </TouchableOpacity>
        {form.proof_of_payment && (
          <Text style={styles.fileSelectedText}>File Selected: {form.proof_of_payment.name}</Text>
        )}
        {/* Payment Section */}
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
            <Text style={styles.helperText}>Scan this QR code to pay the package fee.</Text>
          </View>
        ) : (
          <Text style={styles.helperText}>No QR code available.</Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={bookingLoading}
          style={[styles.bookButton, bookingLoading && { opacity: 0.5 }]}
        >
          <Text style={styles.bookButtonText}>{bookingLoading ? "Processing..." : "Book Now"}</Text>
        </TouchableOpacity>
      </>
    )}
  </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  heading: { fontSize: 24, fontWeight: "900", color: "#0f172a", marginVertical: 8 , marginTop: 100},
  bookingCard: { backgroundColor: "#f1f5f9", padding: 12, borderRadius: 8, marginBottom: 8 },
  errorText: { color: "#ef4444", marginVertical: 8 },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  uploadButtonText: { color: "#fff", fontWeight: "600" },
  fileSelectedText: { fontSize: 12, color: "#475569", marginBottom: 8 },
  bookButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 16,
    minWidth: 120,
  },
  bookButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  spinnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingHorizontal: 4,
    width: '100%',
    marginBottom: 16,
  },
  spinnerButton: {
    padding: 0,
    justifyContent: "flex-start",
  },
  spinnerButtonText: {
    fontSize: 15,
    fontWeight: "100",
  },
  spinnerInput: {
    flex: 1,
  },
  textPrice: {
    marginBottom: 8, 
    fontWeight: "700", 
    alignSelf: "flex-end",
    color: "#00a63e",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  helperText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  qrImage: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: "#bfdbfe",
    borderRadius: 8,
    marginBottom: 8,
  },
});
