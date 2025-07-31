import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { useVisitorRegistration } from '@/hooks/useVisitorRegistration';

export default function ManualVisitorCheckIn() {
  const [uniqueCode, setUniqueCode] = useState('');
  const [visitorResult, setVisitorResult] = useState<any>(null);
  const [success, setSuccess] = useState('');

  const { getVisitorResultByCode, checkInVisitor, loading } = useVisitorRegistration();

  const handleFindVisitor = async () => {
    setSuccess('');
    setVisitorResult(null);
    if (!uniqueCode) return;

    try {
      const result = await getVisitorResultByCode(uniqueCode);

      if (result?.registration?.id) {
        const lastCheckIn = result.registration.checked_in_at;
        const lastDate = new Date(lastCheckIn).toDateString();
        const today = new Date().toDateString();

        if (lastDate === today) {
          Alert.alert('Already Checked In', 'This visitor has already checked in today.');
          return;
        }

        setVisitorResult(result.registration);
      } else {
        Alert.alert('Not Found', 'No visitor found with that code.');
      }
    } catch {
      Alert.alert('Error', 'Failed to find visitor.');
    }
  };

  const handleCheckIn = async () => {
    if (!visitorResult?.unique_code) {
      Alert.alert('Error', 'Visitor code not found.');
      return;
    }

    try {
      const res = await checkInVisitor(visitorResult.unique_code);
      if (res) {
        setSuccess('Visitor checked in successfully!');
        setVisitorResult(null);
        setUniqueCode('');
      }
    } catch {
      Alert.alert('Error', 'Failed to check in visitor.');
    }
  };

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={styles.mainText2}>Manual Visitor Check-In</Text>
      <View style={styles.manualwrapper}>
        <TextInput
          style={styles.inputRow}
          placeholder="Enter unique code"
          value={uniqueCode}
          onChangeText={setUniqueCode}
        />
        <Pressable
          style={styles.findBtn}
          onPress={handleFindVisitor}
          disabled={loading}
        >
          <Text style={styles.btnTextFind}>Find</Text>
        </Pressable>
      </View>

      {visitorResult && (
        <View style={styles.visitorBox}>
          <View style={styles.visitorContentRow}>
            <View style={styles.visitorDetails}>
              <Text style={styles.codeText}>Code: {visitorResult.unique_code}</Text>
              <Text style={styles.infoText}>
                Registration Date:{' '}
                {new Date(visitorResult.registration_date).toLocaleString()}
              </Text>
              <Text style={styles.infoText}>User ID: {visitorResult.user_id}</Text>
              <Text style={styles.infoText}>Registration ID: {visitorResult.id}</Text>
            </View>
            <Image
              source={{ uri: visitorResult.qr_code_url }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <Pressable
            style={[styles.mainBtn, styles.btnGreen, { marginTop: 16, width: '100%' }]}
            onPress={handleCheckIn}
          >
            <Text style={styles.btnText}>Check In Visitor</Text>
          </Pressable>
        </View>
      )}

      {success !== '' && (
        <Text style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>
          {success}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainText2: {
    fontSize: 17,
    fontWeight: '900',
    color: '#036e55',
    marginBottom: 4,
  },
  manualwrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputRow: {
    flex: 1,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFF',
  },
  findBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#74cbab',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextFind: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  visitorBox: {
    backgroundColor: '#e6f8f0',
    borderWidth: 1,
    borderColor: '#86efac',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  visitorContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  visitorDetails: {
    flex: 1,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00365e',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#42495c',
    marginBottom: 2,
    fontWeight: '500',
  },
  qrImage: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 10,
    flexShrink: 0,
  },
  mainBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGreen: {
    backgroundColor: '#159e96',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});
