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

export default function TouristActivityScreen({ headerHeight }: TouristPackagesScreenProps) {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headertitle}>Activity Page</Text>  
      <View style={styles.sectionbig}>
      <Text style={styles.sectiontitle}>Visitor Registration</Text>  
      <TouchableOpacity
        style={styles.visitButton}
        onPress={() => {
          router.push('/tourist/activity/attraction_history/visitHistory');
        }}
      >
        <View style={styles.visitButtonContent}>
          <Text style={styles.visitButtonText}>View Visit History</Text>
          <Feather name="arrow-right" size={14} color="#9d9d9d" style={{ marginLeft: 6 }} />
        </View>
      </TouchableOpacity>


        {result.qr_code_url ? (
          <View style={styles.section}>
            <Text style={styles.title}>Your Current Registration</Text>
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
      </View>

      <View style={styles.sectionbig}>
        <Text style={styles.sectiontitle}>Booking History</Text>
          <TouchableOpacity
            style={styles.visitButton}
            onPress={() => {
              router.push('/tourist/activity/booking_history/visitHistory');
            }}
          >
            <View style={styles.visitButtonContent}>
              <Text style={styles.visitButtonText}>View Visit History</Text>
              <Feather name="arrow-right" size={14} color="#9d9d9d" style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 110,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  headertitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#002b11',
    marginBottom: 16,
  },
  sectionbig: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#f4f1de',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    marginBottom: 8,
  },
  sectiontitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c8773',
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
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002b11',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 10,
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
    fontFamily: 'monospace',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    color: '#1e293b',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#2eb1ab',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
    borderRadius: 6,
  },
  copyText: {
    color: '#ffffff',
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
    backgroundColor: '#2eb1ab',
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
  historyButton: {
    marginTop: 12,
    backgroundColor: '#2eb1ab',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  visitButton: {
    paddingTop: 8,
    alignSelf: 'flex-end',
    borderRadius: 6,
  },
  visitButtonText: {
    color: '#9d9d9d',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
