import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function StaffQrScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styleSheet.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styleSheet.scrollContent}>
        <Text style={styleSheet.mainText}>Scan QR code</Text>
        <Text style={styleSheet.subText}>
          Scan QR Codes from Tourist upon Entry in Island and Attractions
        </Text>

        <Image
          source={require('@/assets/images/qr-code.png')}
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
  btnScan: {
    backgroundColor: '#daf8e3',
  },
  btnscanText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#247f4f',
  },
});
