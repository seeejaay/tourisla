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
        if (!isMounted || !userData?.data?.user?.user_id) return;
        const id = userData.data.user.user_id;
        console.log('user_id:', id);
        setUserId(id);
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
    getQRCodebyUserId().then(setResult);
  }, [getQRCodebyUserId]);
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
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.headertitle}>Recently Booked</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Your Registration</Text>

        {result.unique_code && (
          <View style={styles.section}>
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
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => {
          router.push('/tourist/activity/attraction_history/visitHistory');
        }}
      >
        <Text style={styles.historyButtonText}>View Visit History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    gap: 20,
  },
  headertitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
  },
  section: {
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#475569',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  code: {
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    color: '#0f172a',
  },
  copyButton: {
    backgroundColor: '#075778',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  qrBox: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  qr: {
    width: 180,
    height: 180,
  },
  viewButton: {
    backgroundColor: '#075778',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyButton: {
    marginTop: 20,
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
