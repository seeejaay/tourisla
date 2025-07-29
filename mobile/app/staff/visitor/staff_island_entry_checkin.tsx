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
import { toTitleCase } from '@/lib/utils/textFormat';

export default function IslandEntryCheckInScreen() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [expandedMembers, setExpandedMembers] = useState({});

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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
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
            <Text style={styles.receiptTitle}>ISLAND ENTRY CODE: {result.registration.unique_code} </Text>

            <View style={styles.divider} />

            <View style={styles.resultBox}>
            <Image
              source={{ uri: result.registration.qr_code_url }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.resultBox, {paddingHorizontal: 0, paddingVertical: 16}}>
            <View style={styles.detailRow}>
              <Text style={styles.receiptLabel}>Unique Code:</Text>
              <Text style={styles.receiptValue}>{result.registration.unique_code}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.receiptLabel}>Date:</Text>
              <Text style={styles.receiptValue}>
                {new Date(result.registration.registration_date).toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.receiptLabel}>Payment Method:</Text>
              <Text style={styles.receiptValue}>{toTitleCase(result.registration.payment_method)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.receiptLabel}>Status:</Text>
              <Text style={styles.receiptValue}>{toTitleCase(result.registration.status)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.receiptLabel}>Total Fee:</Text>
              <Text style={styles.receiptValue}>₱{Number(result.registration.total_fee).toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

            <Text style={[styles.receiptLabel, { fontWeight: '600', fontSize: 16, marginTop: 12 }]}> 
              Group Members
            </Text>

            {result.members.map((m, idx) => (
              <Pressable
                key={m.id}
                onPress={() =>
                  setExpandedMembers((prev) => ({
                    ...prev,
                    [m.id]: !prev[m.id],
                  }))
                }
                style={styles.memberBox}
              >
                <View style={styles.memberHeader}>
                  <Text style={styles.label, { fontWeight: '700', color: '#42837b', fontSize: 12 }}>
                    {idx + 1}. {m.name}
                  </Text>
                  <Text style={styles.label}>{expandedMembers[m.id] ? '▲' : '▼'}</Text>
                </View>

                {expandedMembers[m.id] && (
                  <>
                    <View style={styles.divider, {marginVertical: 12, backgroundColor: '#CBD5E1', height: 1}} />
                    <Text style={styles.subLabel}>Age: {m.age} y/o</Text>
                    <Text style={styles.subLabel}>Sex: {m.sex}</Text>
                    <Text style={styles.subLabel}>
                      From: {m.municipality}, {m.province}, {m.country}
                    </Text>
                    <Text style={styles.subLabel}>Foreign: {m.is_foreign ? 'Yes' : 'No'}</Text>
                  </>
                )}
              </Pressable>

            ))}
            {result.registration.status !== "PAID" && (
              <Pressable style={styles.payButton} onPress={handleMarkAsPaid}>
                <Text style={styles.buttonText}>Mark as Paid</Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.checkinButton,
                result.registration.status !== "PAID" && styles.disabled,
              ]}
              onPress={handleCheckIn}
              disabled={result.registration.status !== "PAID"}
            >
              <Text style={styles.buttonText}>Check In</Text>
            </Pressable>
        </View>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: {
    fontSize: 17,
    fontWeight: '900',
    color: '#036e55',
    marginBottom: 4,
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
    backgroundColor: '#74cbab',
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
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  resultBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  resultContent: {
    flex: 1,
    paddingRight: 8,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#036e55',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  receiptLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    flex: 1,
    textAlign: 'right',
  },
  label: { fontSize: 14, color: '#6B7280' },
  subLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2,  marginLeft: 12, fontWeight: '700' },
  qrImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  memberBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
