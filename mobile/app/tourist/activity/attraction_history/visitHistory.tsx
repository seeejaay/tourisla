import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useAttractionHistoryManager } from '@/hooks/useAttractionHistoryManager';
import { fetchTouristSpots } from '@/lib/api/touristSpot';
import { fetchMySpotFeedbacks } from '@/lib/api/feedback';
import { ViewCard } from '@/components/attraction-history/viewCard';
import { DetailsModal } from '@/components/attraction-history/detailsModal';
import { FeedbackModal } from '@/components/attraction-history/FeedbackModal';

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

interface SpotFeedback {
  id: number;
  type: string;
  feedback_for_spot_id: number;
  feedback_for_user_id: number | null;
  submitted_at: string;
  submitted_by: number;
}

export default function VisitHistoryScreen() {
  const { history, loading, error } = useAttractionHistoryManager();
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [feedbackOpenId, setFeedbackOpenId] = useState<number | null>(null);
  const [mySpotFeedbacks, setMySpotFeedbacks] = useState<SpotFeedback[]>([]);

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
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 16,
    color: '#111827',
  },
  label: {
    fontSize: 16,
    color: '#334155',
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
  },
});