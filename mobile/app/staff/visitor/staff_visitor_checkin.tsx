import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useVisitorRegistration } from '@/hooks/useVisitorRegistration';

interface GroupMember {
  id: number;
  registration_id: number;
  name: string;
  sex: string;
  age: number;
  is_foreign: boolean;
  municipality: string;
  province: string;
  country: string;
}

interface VisitorData {
  id: number;
  unique_code: string;
  qr_code_url: string;
  registration_date: string;
  user_id: number | string;
  members?: GroupMember[];
}

export default function ManualVisitorCheckIn() {
  const [uniqueCode, setUniqueCode] = useState('');
  const [visitorId, setVisitorId] = useState<number | null>(null);
  const [visitorResult, setVisitorResult] = useState<VisitorData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { getVisitorResultByCode, checkInVisitor, loading, error } =
    useVisitorRegistration();

  const handleFindVisitor = async () => {
    setSuccess(null);
    setVisitorId(null);
    setVisitorResult(null);
    if (!uniqueCode) return;

    const input = /^[A-Z0-9]+$/i.test(uniqueCode.trim())
      ? { unique_code: uniqueCode.trim() }
      : { name: uniqueCode.trim() };

    const result = await getVisitorResultByCode(input);
    if (result && result.registration && result.registration.id) {
      setVisitorId(result.registration.id);
      setVisitorResult(result.registration);
    } else {
      setVisitorId(null);
      setVisitorResult(null);
      Alert.alert('Not Found', 'No visitor found with that code or name.');
    }
  };

  const handleCheckIn = async () => {
    if (!visitorId) return;
    const checkedIn = await checkInVisitor(uniqueCode);
    if (checkedIn) {
      setSuccess('Visitor checked in successfully!');
      setVisitorId(null);
      setVisitorResult(null);
      setUniqueCode('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manual Visitor Check-In</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter unique code"
          value={uniqueCode}
          onChangeText={setUniqueCode}
        />
        <Pressable
          style={[styles.button, styles.findButton]}
          onPress={handleFindVisitor}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Searching...' : 'Find'}
          </Text>
        </Pressable>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      {visitorId && visitorResult && (
        <View style={styles.card}>
          <Image
            source={{ uri: visitorResult.qr_code_url }}
            style={styles.qrImage}
          />
          <View style={styles.details}>
            <Text style={styles.detailLabel}>Unique Code:</Text>
            <Text style={styles.detailValue}>{visitorResult.unique_code}</Text>

            <Text style={styles.detailLabel}>Registration Date:</Text>
            <Text style={styles.detailValue}>
              {visitorResult.registration_date
                ? new Date(visitorResult.registration_date).toLocaleString()
                : 'N/A'}
            </Text>

            <Text style={styles.detailLabel}>User ID:</Text>
            <Text style={styles.detailValue}>
              {visitorResult.user_id ?? 'N/A'}
            </Text>

            <Text style={styles.detailLabel}>Registration ID:</Text>
            <Text style={styles.detailValue}>{visitorResult.id}</Text>
          </View>
        </View>
      )}

      {visitorResult?.members?.length ? (
        <View style={styles.membersSection}>
          <Text style={styles.membersTitle}>Group Members</Text>
          {visitorResult.members.map((m) => (
            <View key={m.id} style={styles.memberRow}>
              <Text style={[styles.memberText, { fontWeight: '900' }]}>{m.name}</Text>

              <View style={styles.memberDetailRow}>
                <Text style={styles.memberLabel}>Sex:</Text>
                <Text style={styles.memberValue}>{m.sex}</Text>
              </View>

              <View style={styles.memberDetailRow}>
                <Text style={styles.memberLabel}>Age:</Text>
                <Text style={styles.memberValue}>{m.age} years old</Text>
              </View>

              <View style={styles.memberDetailRow}>
                <Text style={styles.memberLabel}>Country:</Text>
                <Text style={styles.memberValue}>{m.country}</Text>
              </View>

              <View style={styles.memberDetailRow}>
                <Text style={styles.memberLabel}>Municipality:</Text>
                <Text style={styles.memberValue}>{m.municipality}</Text>
              </View>

              <View style={styles.memberDetailRow}>
                <Text style={styles.memberLabel}>Province:</Text>
                <Text style={styles.memberValue}>{m.province}</Text>
              </View>

              <View style={styles.memberDetailRow}>
                <Text style={styles.memberLabel}>Is Foreign:</Text>
                <Text style={styles.memberValue}>{m.is_foreign ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {visitorId && visitorResult && (
        <Pressable
          style={[styles.button, styles.checkInButton]}
          onPress={handleCheckIn}
        >
          <Text style={styles.buttonText}>Check In Visitor</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fcfd',
    flexGrow: 1,
    paddingBottom: 115,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3e979f',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  findButton: {
    backgroundColor: '#3e979f',
  },
  checkInButton: {
    backgroundColor: '#159e96',
    marginTop: 16,
  },
  buttonText: {
    alignSelf: 'center',
    fontWeight: '600',
    color: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#e6f7fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  qrImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  detailLabel: {
    fontWeight: '700',
    color: '#1c5461',
  },
  detailValue: {
    marginBottom: 6,
    color: '#333',
  },
  membersSection: {
    marginTop: 16,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c5461',
    marginBottom: 8,
  },
  memberDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  memberRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#f0f9f9',
    padding: 8,
    marginBottom: 4,
    borderRadius: 6,
  },
  memberLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1c5461',
  },
  memberText: {
    fontSize: 12,
    flex: 1,
  },
  memberValue: {
    fontSize: 12,
    color: '#333',
  },
});
