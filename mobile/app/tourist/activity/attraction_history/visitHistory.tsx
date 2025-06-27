import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useAttractionHistoryManager } from '@/hooks/useAttractionHistoryManager';
import { fetchTouristSpots } from '@/lib/api/touristSpot';
import { fetchMySpotFeedbacks } from '@/lib/api/feedback';
import { ViewCard } from '@/components/attraction-history/viewCard';
import { DetailsModal } from '@/components/attraction-history/detailsModal';
import { FeedbackModal } from '@/components/attraction-history/FeedbackModal';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

interface TourPackageDetailsScreenProps {
  headerHeight: number;
}

interface VisitorLog {
  id: number;
  visit_date: string;
  unique_code: string;
  registration_date: string;
  qr_code_url: string;
  tourist_spot_id: number;
  registration_id: number;
}

interface TouristSpot {
  id: number;
  name: string;
}

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

interface SpotFeedback {
  id: number;
  type: string;
  feedback_for_spot_id: number;
  feedback_for_user_id: number | null;
  submitted_at: string;
  submitted_by: number;
}

export default function VisitHistoryScreen({
  headerHeight,
}: TourPackageDetailsScreenProps) {
  const { history, loading, error } = useAttractionHistoryManager();
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [feedbackOpenId, setFeedbackOpenId] = useState<number | null>(null);
  const [mySpotFeedbacks, setMySpotFeedbacks] = useState<SpotFeedback[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTouristSpots().then(setSpots);
    fetchMySpotFeedbacks().then(setMySpotFeedbacks);
  }, []);

  const spotMap = useMemo(
    () => Object.fromEntries(spots.map((s) => [s.id, s.name])),
    [spots]
  );

  const feedbackSpotIds = useMemo(
    () => new Set(mySpotFeedbacks.map((fb) => fb.feedback_for_spot_id)),
    [mySpotFeedbacks]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#075778" />
        <Text style={styles.label}>Loading visit history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
    <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.back()}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>My Visit History</Text>
      {history.length === 0 ? (
        <Text style={styles.label}>No visit history found.</Text>
      ) : (
        history.map((log) => {
          const spotId = log.tourist_spot_id;
          const feedbackGiven = feedbackSpotIds.has(spotId);
          return (
            <View key={log.id}>
              <ViewCard
                log={log}
                spotName={spotMap[spotId] || 'Unknown'}
                onClick={() => setOpenId(log.id)}
                onFeedback={() => setFeedbackOpenId(spotId)}
                feedbackGiven={feedbackGiven}
              />
              <DetailsModal
                open={openId === log.id}
                onClose={() => setOpenId(null)}
                group={[log]}
                spotName={spotMap[spotId] || 'Unknown'}
              />
              <FeedbackModal
                open={feedbackOpenId === spotId}
                onClose={() => setFeedbackOpenId(null)}
                spotName={spotMap[spotId] || 'Unknown'}
                spotId={spotId}
                onSubmitted={async () => {
                  Alert.alert("Thank you for your feedback!");
                  setFeedbackOpenId(null);
                  const updated = await fetchMySpotFeedbacks();
                  setMySpotFeedbacks(updated);
                }}
                feedbackGiven={feedbackGiven}
              />
            </View>
          );
        })
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
    marginTop: STATUS_BAR_HEIGHT + 50,
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 12,
  },
  error: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
