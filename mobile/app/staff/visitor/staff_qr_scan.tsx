import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function StaffQrScan() {

  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styleSheet.container}>
      <StatusBar style="auto" />

      <Text style={styleSheet.mainText}>Expo QR Code Scanner</Text>
      <Text style={{ marginBottom: 20, textAlign: 'center', fontWeight: '600', color: '#4B5563' }}>
        Scan QR Codes from Tourist upon Entry in Attraction 
      </Text>

      <Pressable
        style={[styleSheet.mainBtn, styleSheet.btnGreen]}
        onPress={async () => {
          const result = await requestPermission();
          console.log('Permission result:', result); // check status in console
        }}
      >
        <Text style={styleSheet.btnText}>Request Permission</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/staff/visitor/qrScan")}
        style={[
          styleSheet.mainBtn,
          styleSheet.btnYellow,
          { opacity: isPermissionGranted ? 1 : 0.5 }
        ]}
        disabled={!isPermissionGranted}
      >
        <Text style={styleSheet.btnText}>Scan Code</Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mainText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 5,
  },
  mainBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  btnGreen: {
    backgroundColor: "#0BCD4C",
    marginBottom: 20,
  },
  btnYellow: {
    backgroundColor: "#FBBF24",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  }
});
