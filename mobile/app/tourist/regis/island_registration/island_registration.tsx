import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Linking,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useIslandEntryManager } from '@/hooks/useIslandEntryManager';
import { getLatestIslandEntry } from '@/lib/api/islandEntry';
import { islandEntrySchema } from '@/static/islandEntry/schema';
import { islandEntryFields } from '@/static/islandEntry/islandEntryFields';
import { Picker } from '@react-native-picker/picker';

export default function IslandRegistrationScreen() {
  const [companions, setCompanions] = useState([]);
  const [latestEntry, setLatestEntry] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { loading, result, fee, fetchFee, register } = useIslandEntryManager();

  useEffect(() => {
    fetchFee();
  }, []);

  useEffect(() => {
    if (showResult) getLatestIslandEntry().then(setLatestEntry);
  }, [showResult]);

  const removeCompanion = (indexToRemove) => {
    const updated = companions.filter((_, i) => i !== indexToRemove);
    setCompanions(updated);
    formik.setFieldValue('companions', updated);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      sex: '',
      age: 0,
      is_foreign: false,
      municipality: '',
      province: '',
      companions: [],
      payment_method: 'Cash',
      total_fee: 0,
    },
    validationSchema: yup.object().shape({
      ...islandEntrySchema.fields,
      companions: yup.array().of(islandEntrySchema),
    }),
    onSubmit: async (values) => {
      const groupMembers = [
        {
          name: values.name,
          sex: values.sex,
          age: values.age,
          is_foreign: values.is_foreign,
          municipality: values.municipality,
          province: values.province,
        },
        ...companions,
      ];

      if (values.payment_method === 'Online' && groupMembers.length < 3) {
        Alert.alert('Info', 'Online payment is for groups of 3 or more.');
        return;
      }

      const payload = {
        groupMembers,
        payment_method: fee?.is_enabled ? values.payment_method.toUpperCase() : 'NOT_REQUIRED',
        total_fee: fee ? fee.amount * groupMembers.length : 0,
      };

      try {
        const res = await register(payload);
        if (res?.payment_link && values.payment_method === 'Online') {
          setLatestEntry(res);
          setHasSubmitted(true);
          setShowPaymentLink(true);
        } else if (res) {
          const latest = await getLatestIslandEntry();
          setLatestEntry(latest);
          setShowResult(true);
        }
      } catch (err) {
        Alert.alert('Error', 'Registration failed.');
      }
    },
  });

  const handleCompanionChange = (index, field, value) => {
    const updated = companions.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    setCompanions(updated);
    formik.setFieldValue('companions', updated);
  };

  const addCompanion = () => {
    const newMember = {
      name: '',
      sex: '',
      age: 0,
      is_foreign: false,
      municipality: '',
      province: '',
    };
    const updated = [...companions, newMember];
    setCompanions(updated);
    formik.setFieldValue('companions', updated);
  };

  if (showResult && result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Registration Successful!</Text>
          {latestEntry && (
            <>
              <Text style={styles.successText}>
                Your Unique Code:{" "}
                <Text style={styles.code}>{latestEntry.unique_code}</Text>
              </Text>
              <Image
                source={{ uri: latestEntry.qr_code_url }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </>
          )}
          <Text style={styles.instruction}>
            Show this QR code at the entry point.
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(process.env.EXPO_PUBLIC_FRONTEND_URL || '/')
            }
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Island Entry Registration</Text>

        <View style={styles.card}>
          {islandEntryFields.map((field) => (
            <View key={field.name} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              {field.type === 'checkbox' ? (
  // Checkbox input
  <TouchableOpacity
    onPress={() => formik.setFieldValue(field.name, !formik.values[field.name])}
    style={styles.checkboxContainer}
  >
    <View
      style={[
        styles.checkbox,
        formik.values[field.name] && styles.checked,
      ]}
    />
    <Text style={styles.checkboxLabel}>{field.label}</Text>
  </TouchableOpacity>
) : field.name === 'sex' ? (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={formik.values.sex}
        onValueChange={(itemValue) => formik.setFieldValue('sex', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Sex" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>
    </View>
  ) : (
  // Regular input
  <TextInput
    value={formik.values[field.name]?.toString()}
    onChangeText={(text) => formik.setFieldValue(field.name, text)}
    placeholder={`Enter ${field.label}`}
    style={styles.input}
  />
)}

              {formik.errors[field.name] && (
                <Text style={styles.error}>{formik.errors[field.name]}</Text>
              )}
            </View>
          ))}
        </View>

        {companions.length > 0 && (
          <Text style={styles.sectionTitle}>Group Members</Text>
        )}
        {companions.map((comp, index) => (
          <View key={index} style={styles.companionCard}>
            <View style={styles.companionHeader}>
            <Text style={styles.companionTitle}>Companion {index + 1}</Text>
            <TouchableOpacity onPress={() => removeCompanion(index)}>
            <Ionicons name="close-circle" size={22} color="#dc2626" />
                {/* Alternatively, use Ionicons or MaterialIcons if available */}
            </TouchableOpacity>
            </View>
            {islandEntryFields.map((field) => (
              <View key={field.name} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                {field.name === 'sex' ? (
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={comp.sex}
      onValueChange={(value) =>
        handleCompanionChange(index, 'sex', value)
      }
      style={styles.picker}
    >
      <Picker.Item label="Select Sex" value="" />
      <Picker.Item label="Male" value="Male" />
      <Picker.Item label="Female" value="Female" />
    </Picker>
  </View>
) : (
  <TextInput
    value={comp[field.name]?.toString()}
    onChangeText={(text) =>
      handleCompanionChange(index, field.name, text)
    }
    placeholder={field.label}
    style={styles.input}
  />
)}

              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity onPress={addCompanion} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Companion</Text>
        </TouchableOpacity>

        {fee?.is_enabled && (
          <View style={styles.card2}>
            <Text style={styles.totalFee}>
              Total to Pay: ₱{fee.amount * (1 + companions.length)}
            </Text>
            <Text style={styles.label}>Payment Method</Text>
            {['Cash', 'Online'].map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => formik.setFieldValue('payment_method', method)}
                style={styles.radioContainer}
              >
                <View style={styles.radioOuter}>
                  {formik.values.payment_method === method && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!(
        formik.values.payment_method === "Online" &&
        hasSubmitted &&
        latestEntry?.payment_link
        ) && !showResult && (
        <TouchableOpacity
            onPress={formik.handleSubmit}
            style={styles.submitButton}
            disabled={loading}
        >
            <Text style={styles.submitButtonText}>
            {loading ? "Registering..." : "Submit"}
            </Text>
        </TouchableOpacity>
        )}

        {showPaymentLink && latestEntry?.payment_link && (
        <View style={{ marginTop: 24 }}>
            <Text style={styles.label}>Proceed to online payment:</Text>

            <TouchableOpacity
            onPress={() => Linking.openURL(latestEntry.payment_link)}
            style={[styles.submitButton, { marginBottom: 12 }]}
            >
            <Text style={styles.submitButtonText}>Pay via PayMongo</Text>
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', fontSize: 13, color: '#475569' }}>
            After paying, click below to confirm:
            </Text>

            <TouchableOpacity
            onPress={async () => {
                try {
                const refreshed = await getLatestIslandEntry();
                setLatestEntry(refreshed);
                if (refreshed?.qr_code_url) {
                    setShowResult(true);
                    setShowPaymentLink(false);
                } else {
                    Alert.alert("Still Pending", "Payment not yet confirmed. Try again shortly.");
                }
                } catch (err) {
                console.error("Confirm payment failed:", err);
                Alert.alert("Error", "Failed to confirm payment.");
                }
            }}
            style={[styles.submitButton, { marginTop: 12, backgroundColor: '#16a34a' }]}
            >
            <Text style={styles.submitButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
        </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 16,
  },
  companionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  removeIcon: {
    fontSize: 20,
    color: '#dc2626',
    fontWeight: 'bold',
    padding: 4,
  },
  card: {
    marginBottom: 24,
    borderRadius: 12,
  },
  card2: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    color: '#1c5461',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ececee',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#94a3b8',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  checked: {
    backgroundColor: '#0ea5e9',
  },
  checkboxLabel: {
    color: '#475569',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  companionCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  companionTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#4db004",
    alignItems: "center",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },
  totalFee: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
    color: '#008236',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#2e7177',
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 15,
    color: '#334155',
  },
  submitButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    margin: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#166534',
  },
  successCode: {
    marginBottom: 4,
    fontWeight: '500',
  },
  mono: {
    fontFamily: 'monospace',
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ececee',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  successText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1e293b',
  },
  code: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#1e40af',
  },
  qrImage: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginVertical: 16,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
