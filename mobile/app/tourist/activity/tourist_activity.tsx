import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useVisitorRegistration } from '@/hooks/useVisitorRegistration';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface TouristPackagesScreenProps {
  headerHeight: number;
}

interface QRResult {
  qr_code_url: string;
  unique_code?: string;
}

export default function TouristActivityScreen() {
  const { loggedInUser } = useAuth();
  const { getQRCodebyUserId, loading, error } = useVisitorRegistration();

  const [userId, setUserId] = useState<number | null>(null);
  const [result, setResult] = useState<QRResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const userData = await loggedInUser();
        console.log('Logged-in user data:', userData);
        if (!isMounted || !userData?.data?.user?.id) return;
        const id = userData.data.user.id;
        console.log('user_id:', id);
        setUserId(id);
        console.log('User ID set:', id);
      } catch (err) {
        console.error('Error fetching logged-in user:', err);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [loggedInUser]);

  useEffect(() => {
    if (userId) {
      getQRCodebyUserId(userId).then(setResult);
    }
  }, [userId, getQRCodebyUserId]);
  console.log('QRResult:', userId, result);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Unique code copied to clipboard.');
  };

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No user ID provided.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#075778" />
        <Text style={styles.label}>Loading registration...</Text>
      </View>
    );
  }

  if (error && !error.includes('404')) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No registration found for this user.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Current Registration</Text>
        {result.qr_code_url ? (
          <View style={styles.section}>
            <Text style={styles.label}>Show this QR code at the entrance:</Text>
            <View style={styles.qrBox}>
              <Image
                source={{ uri: result.qr_code_url }}
                style={styles.qr}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => Linking.openURL(result.qr_code_url)}
                style={styles.viewButton}
              >
                <Text style={styles.copyText}>View QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.error}>No QR code available for this user.</Text>
        )}

        {result.unique_code && (
          <View style={{marginTop: 8}}>
            <Text style={styles.label}>Unique Code:</Text>
            <View style={styles.codeRow}>
              <Text style={styles.code}>{result.unique_code}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(result.unique_code!)}
              >
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  visitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    borderColor: '#ececec',
    borderWidth: 2,
    width: '100%',
    maxWidth: 420,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ececec',
  },
  label: {
    fontSize: 12,
    color: '#7b7b7b',
    marginBottom: 6,
    fontWeight: '400',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'monospace',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    color: '#59767e',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#c7fbe2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
    borderRadius: 6,
  },
  copyText: {
    color: '#1c8773',
    fontSize: 13,
    fontWeight: '600',
  },
  qrBox: {
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  qr: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  viewButton: {
    backgroundColor: '#c7fbe2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  error: {
    color: '#ef4444',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
});
