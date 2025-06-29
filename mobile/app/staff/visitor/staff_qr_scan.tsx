import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useVisitorRegistration } from '@/hooks/useVisitorRegistration';

export default function StaffQrScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  const [uniqueCode, setUniqueCode] = useState('');
  const [visitorResult, setVisitorResult] = useState(null);
  const [success, setSuccess] = useState('');
  const { getVisitorResultByCode, checkInVisitor, loading, error } = useVisitorRegistration();

  const handleFindVisitor = async () => {
    setSuccess('');
    setVisitorResult(null);
    if (!uniqueCode) return;

    try {
      const result = await getVisitorResultByCode(uniqueCode);
      if (result?.registration?.id) {
        setVisitorResult(result.registration);
      } else {
        Alert.alert('Not Found', 'No visitor found with that code.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to find visitor.');
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await checkInVisitor(uniqueCode);
      if (res) {
        setSuccess('Visitor checked in successfully!');
        setVisitorResult(null);
        setUniqueCode('');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to check in visitor.');
    }
  };

  return (
    <SafeAreaView style={styleSheet.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styleSheet.scrollContent}>
        <Text style={styleSheet.mainText}>Scan QR code</Text>
        <Text style={styleSheet.subText}>
          Scan QR Codes from Tourist upon Entry in Attraction
        </Text>

        <Image
          source={require('@/assets/images/qr-code.png')} // or use a remote URI
          style={styleSheet.bannerImage}
          resizeMode="contain"
        />

        <View style={styleSheet.btnwrapper}>
          <Pressable
            style={[styleSheet.mainBtn, styleSheet.btnGreen]}
            onPress={async () => {
              const result = await requestPermission();
              console.log('Permission result:', result);
            }}
          >
            <Text style={styleSheet.btnText}>Request Permission</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/staff/visitor/qrScan')}
            style={[
              styleSheet.mainBtn,
              styleSheet.btnScan,
              { opacity: isPermissionGranted ? 1 : 0.5 },
            ]}
            disabled={!isPermissionGranted}
          >
            <Text style={styleSheet.btnscanText}>Scan Code</Text>
          </Pressable>
        </View>

        <Text style={styleSheet.mainText2}>Manual Visitor Check-In</Text>
        <View style={styleSheet.manualwrapper}>
          <TextInput
            style={styleSheet.inputRow}
            placeholder="Enter unique code"
            value={uniqueCode}
            onChangeText={setUniqueCode}
          />
          <Pressable
            style={[styleSheet.findBtn]}
            onPress={handleFindVisitor}
            disabled={loading}
          >
            <Text style={styleSheet.btnTextFind}>Find</Text>
          </Pressable>
        </View>
        {visitorResult && (
          <View style={styleSheet.visitorBox}>
            <View style={styleSheet.visitorContentRow}>
              <View style={styleSheet.visitorDetails}>
                <Text style={styleSheet.codeText}>Code: {visitorResult.unique_code}</Text>
                <Text style={styleSheet.infoText}>
                  Registration Date:{' '}
                  {new Date(visitorResult.registration_date).toLocaleString()}
                </Text>
                <Text style={styleSheet.infoText}>User ID: {visitorResult.user_id}</Text>
                <Text style={styleSheet.infoText}>Registration ID: {visitorResult.id}</Text>
              </View>
              <View>
              <Image
                source={{ uri: visitorResult.qr_code_url }}
                style={styleSheet.qrImage}
                resizeMode="contain"
              />
              </View>

            </View>

            <Pressable
              style={[styleSheet.mainBtn, styleSheet.btnGreen, { marginTop: 16, width: '100%' }]}
              onPress={handleCheckIn}
            >
              <Text style={styleSheet.btnText}>Check In Visitor</Text>
            </Pressable>
          </View>
        )}

        {success !== '' && (
          <Text style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>
            {success}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  mainText: {
    fontSize: 25,
    fontWeight: '900',
    color: '#036e55',
    marginBottom: 4,
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#4B5563',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    alignSelf: 'center',
    opacity: 0.6,
  },
  input: {
    borderColor: '#CBD5E1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
    fontSize: 16,
  },
  btnwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mainBtn: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
    justifyContent: 'center-between',
  },
  btnGreen: {
    backgroundColor: '#159e96',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  btnTextFind: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  btnScan: {
    backgroundColor: '#daf8e3',
  },
  btnscanText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#247f4f',
  },
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
    borderColor: '#CBD5E1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  findBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#74cbab',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitorContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
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
  qrImage: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 10,
    flexShrink: 0,
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
  visitorDetails: {
    flex: 1,
  },
});
