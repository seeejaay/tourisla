import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useBookingsByTourist } from '@/hooks/useBookingManager';
import { useRouter } from 'expo-router';
import { OperatorFeedbackModal } from "@/components/booking-history/OperatorFeedbackModal";
import { GuideFeedbackModal } from "@/components/booking-history/GuideFeedbackModal";

export default function BookingHistoryScreen() {
  const { loggedInUser } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const { 
    data: bookings, 
    fetchByTourist, 
    loading, 
    error,
} = useBookingsByTourist();
  const router = useRouter();
  const [operatorFeedbackOpen, setOperatorFeedbackOpen] = useState<null | { bookingId: number; operatorId: number; operatorName: string }>(null);
  const [guideFeedbackOpen, setGuideFeedbackOpen] = useState<null | { bookingId: number; guideId: number; guideName: string }>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await loggedInUser();
      const id = res?.data?.user?.user_id;
      if (id) {
        setUserId(id);
        fetchByTourist(id); // Use immediate value
      }
    };
    fetchUser();
  }, [loggedInUser]);
  console.log('BookingHistoryScreen userId:', userId);

  useEffect(() => {
    console.log('guideFeedbackOpen state changed:', guideFeedbackOpen);
  }, [guideFeedbackOpen]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Booking History</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#075778" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && bookings?.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.empty}>No bookings found.</Text>
        </View>
      )}

      {bookings?.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.id}>#{booking.id}</Text>
            <Text style={[
              styles.status,
              booking.status === 'APPROVED' ? styles.approved :
              booking.status === 'PENDING' ? styles.pending :
              styles.finished
            ]}>
              {booking.status}
            </Text>
          </View>

          <Text style={styles.item}><Text style={styles.label}>Package:</Text> {booking.package_name || booking.tour_package_id}</Text>
          <Text style={styles.item}><Text style={styles.label}>Date:</Text> {new Date(booking.scheduled_date).toLocaleDateString()}</Text>
          <Text style={styles.item}><Text style={styles.label}>Guests:</Text> {booking.number_of_guests}</Text>
          <Text style={styles.item}><Text style={styles.label}>Total:</Text> ₱{booking.total_price}</Text>
          <Text style={styles.item}><Text style={styles.label}>Operator:</Text> {booking.tour_operator_name || 'N/A'}</Text>

          {booking.tour_guides?.length > 0 && (
            <Text style={styles.item}>
              <Text style={styles.label}>Guide(s):</Text>{' '}
              {booking.tour_guides.map(g => `${g.first_name} ${g.last_name}`).join(', ')}
            </Text>
          )}

          {booking.proof_of_payment && (
            <TouchableOpacity
              onPress={() => Linking.openURL(booking.proof_of_payment)}
            >
              <Text style={styles.link}>View Proof of Payment</Text>
            </TouchableOpacity>
          )}

          {booking.status === 'FINISHED' && (
            <View style={styles.feedbackRow}>
              {booking.tour_guides?.map(g => (
                <TouchableOpacity
                  key={`${g.tourguide_id}-${booking.id}`}
                  style={styles.feedbackButton}
                  onPress={() => {
                    setGuideFeedbackOpen({
                        bookingId: booking.id,
                        guideId: g.tourguide_id,
                        guideName: `${g.first_name} ${g.last_name}`,
                      });
                    // You can later connect this to a modal or screen
                  }}
                >
                  <Text style={styles.feedbackText}>Guide: {g.first_name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.feedbackButton, { backgroundColor: '#1d4ed8' }]}
                onPress={() => {
                    setOperatorFeedbackOpen({
                        bookingId: booking.id,
                        operatorId: booking.touroperator_id,
                        operatorName: booking.tour_operator_name || 'Tour Operator',
                    });
                }}
              >
                <Text style={styles.feedbackText}>Tour Operator</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.timestamp}>Booked: {new Date(booking.created_at).toLocaleString()}</Text>
          <Text style={styles.timestamp}>Updated: {new Date(booking.updated_at).toLocaleString()}</Text>
        </View>
      ))}
    {operatorFeedbackOpen && (
    <OperatorFeedbackModal
        open={true}
        onClose={() => setOperatorFeedbackOpen(null)}
        bookingId={operatorFeedbackOpen.bookingId}
        operatorId={operatorFeedbackOpen.operatorId}
        operatorName={operatorFeedbackOpen.operatorName}
    />
    )}

    {guideFeedbackOpen && (
    <GuideFeedbackModal
        open={true}
        onClose={() => setGuideFeedbackOpen(null)}
        bookingId={guideFeedbackOpen.bookingId}
        guideId={guideFeedbackOpen.guideId}
        guideName={guideFeedbackOpen.guideName}
    />
    )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f9fafb',
  },
  center: {
    alignItems: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#1e293b',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  empty: {
    color: '#64748b',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  id: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  approved: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  pending: {
    backgroundColor: '#fef9c3',
    color: '#92400e',
  },
  finished: {
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
    color: '#1f2937',
  },
  label: {
    fontWeight: '600',
    color: '#475569',
  },
  link: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
    marginTop: 6,
  },
  feedbackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  feedbackButton: {
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    marginTop: 6,
    fontSize: 11,
    color: '#94a3b8',
  },
});
