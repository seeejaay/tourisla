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
  StatusBar,
  Platform,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useBookingsByTourist } from '@/hooks/useBookingManager';
import { useRouter } from 'expo-router';
import { OperatorFeedbackModal } from "@/components/booking-history/OperatorFeedbackModal";
import { GuideFeedbackModal } from "@/components/booking-history/GuideFeedbackModal";
import { FontAwesome5 } from '@expo/vector-icons';
import { cancelBooking } from '@/lib/api/booking';

interface TourPackageDetailsScreenProps {
  headerHeight: number;
}

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function BookingHistoryScreen({headerHeight,
}: TourPackageDetailsScreenProps) {
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
    <View style={[styles.outerContainer, { paddingTop: headerHeight }]}>
    <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.back()}
      >
        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <Text style={styles.itemName}>{booking.package_name || booking.tour_package_id}</Text>
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
          {(booking.status === 'APPROVED' || booking.status === 'PENDING') && (
            <TouchableOpacity
              style={[styles.feedbackButton, { backgroundColor: '#dc2626', marginTop: 12 }]}
              onPress={() => {
                Alert.alert(
                  "Cancel Booking?",
                  "Are you sure you want to cancel this booking?",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          const result = await cancelBooking(booking.id);
                          Alert.alert("Cancelled", result.message || "Booking cancelled successfully");
                          if (userId) fetchByTourist(userId);
                        } catch (err) {
                          Alert.alert("Error", err?.response?.data?.error || "Failed to cancel.");
                        }
                      },
                    },
                  ]
                );
              }
            }
            >
              <Text style={styles.feedbackText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    marginTop: STATUS_BAR_HEIGHT + 50,
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
  center: {
    alignItems: 'center',
    marginVertical: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#334155',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 12,
  },
  empty: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  id: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  status: {
    fontWeight: '700',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
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
    color: '#1f2937',
    lineHeight: 20,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  label: {
    fontWeight: '600',
    color: '#334155',
  },
  link: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  feedbackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 14,
  },
  feedbackButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  timestamp: {
    marginTop: 12,
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
