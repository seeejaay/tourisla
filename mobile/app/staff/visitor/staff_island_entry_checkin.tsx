import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useIslandEntryManager } from '@/hooks/useIslandEntryManager';
import { getIslandEntryMembers, markIslandEntryPaid, manualIslandEntryCheckIn  } from '@/lib/api/islandEntry';
import { StatusBar } from 'expo-status-bar';

export default function IslandEntryCheckInScreen() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleLookup = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await getIslandEntryMembers(code.trim());
      setResult(res.data);
    } catch (err) {
      setError('No island entry registration found.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await manualIslandEntryCheckIn(code.trim());
      setSuccess('Visitor checked in successfully!');
      setCode('');
      setResult(null);
    } catch (err) {
      console.error('Check-in error:', err?.response?.data || err.message);
      setError('Check-in failed.');
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await markIslandEntryPaid(code.trim());
      const res = await getIslandEntryMembers(code.trim());
      setResult(res.data);
      setSuccess('Marked as paid!');
    } catch {
      setError('Failed to mark as paid.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Island Entry Lookup</Text>

        <View style={styles.formRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter unique code"
            value={code}
            onChangeText={setCode}
          />
          <Pressable style={styles.button} onPress={handleLookup}>
            <Text style={styles.buttonText}>Lookup</Text>
          </Pressable>
        </View>

        {loading && <ActivityIndicator size="large" color="#10B981" style={{ marginVertical: 20 }} />}

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        {success !== '' && <Text style={styles.successText}>{success}</Text>}

        {result && (
          <View style={styles.resultBox}>
            <Image
              source={{ uri: result.registration.qr_code_url }}
              style={styles.qrImage}
            />
            <Text style={styles.label}>Code: {result.registration.unique_code}</Text>
            <Text style={styles.label}>Date: {new Date(result.registration.registration_date).toLocaleString()}</Text>
            <Text style={styles.label}>Payment: {result.registration.payment_method}</Text>
            <Text style={styles.label}>Status: {result.registration.status}</Text>
            <Text style={styles.label}>Total Fee: ₱{Number(result.registration.total_fee).toLocaleString()}</Text>

            {result.registration.status !== "PAID" && (
              <Pressable style={styles.payButton} onPress={handleMarkAsPaid}>
                <Text style={styles.buttonText}>Mark as Paid</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.checkinButton, result.registration.status !== "PAID" && styles.disabled]}
              onPress={handleCheckIn}
              disabled={result.registration.status !== "PAID"}
            >
              <Text style={styles.buttonText}>Check In</Text>
            </Pressable>

            <Text style={[styles.header, { marginTop: 24 }]}>Group Members</Text>
            {result.members.map((m, idx) => (
              <View key={m.id} style={styles.memberBox}>
                <Text style={styles.label}>{idx + 1}. {m.name}, {m.age} y/o, {m.sex}</Text>
                <Text style={styles.subLabel}>From: {m.municipality}, {m.province}, {m.country}</Text>
                <Text style={styles.subLabel}>Foreign: {m.is_foreign ? "Yes" : "No"}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  scroll: { padding: 20, paddingTop: 40 },
  header: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    textAlign: 'center',
    marginBottom: 20,
  },
  formRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  payButton: {
    marginTop: 12,
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 10,
  },
  checkinButton: {
    marginTop: 12,
    backgroundColor: '#16A34A',
    padding: 12,
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: { color: '#FFF', fontWeight: '600', textAlign: 'center' },
  resultBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  label: { fontSize: 14, color: '#374151', marginBottom: 4 },
  subLabel: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  qrImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
    alignSelf: 'center',
  },
  memberBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
