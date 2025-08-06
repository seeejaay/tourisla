import React, { useEffect, useState, useMemo } from "react";
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
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useBookingsByTourist } from "@/hooks/useBookingManager";
import { useRouter } from "expo-router";
import { OperatorFeedbackModal } from "@/components/booking-history/OperatorFeedbackModal";
import { GuideFeedbackModal } from "@/components/booking-history/GuideFeedbackModal";
import { cancelBooking } from "@/lib/api/booking";
import { toTitleCase } from "@/lib/utils/textFormat";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";

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
  const [operatorFeedbackOpen, setOperatorFeedbackOpen] = useState<null | {
    bookingId: number;
    operatorId: number;
    operatorName: string;
  }>(null);
  const [guideFeedbackOpen, setGuideFeedbackOpen] = useState<null | {
    bookingId: number;
    guideId: number;
    guideName: string;
  }>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await loggedInUser();
      const id = res?.data?.user?.id;
      if (id) {
        setUserId(id);
        fetchByTourist(id);
      }
    };
    fetchUser();
  }, [loggedInUser]);

  const filteredBookings = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      bookings?.filter((booking) => {
        const packageName = booking.package_name?.toLowerCase() || "";
        const matchesSearch = packageName.includes(lowerQuery);
        const matchesFilter =
          selectedFilter === "" || booking.status === selectedFilter;
        return matchesSearch && matchesFilter;
      }) || []
    );
  }, [searchQuery, selectedFilter, bookings]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.filterRow}>
        <View style={{ flex: 1, marginRight: 4 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by spot name"
          />
        </View>
        <FilterDropdown
          selected={selectedFilter}
          onSelect={setSelectedFilter}
          options={["CANCELLED", "APPROVED", "PENDING", "FINISHED"]}
        />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#075778" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && bookings?.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.empty}>No bookings found.</Text>
        </View>
      )}

      {filteredBookings.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.id}>Booking: {booking.id}</Text>
            <Text
              style={[
                styles.status,
                booking.status === "APPROVED"
                  ? styles.approved
                  : booking.status === "PENDING"
                    ? styles.pending
                    : styles.finished,
              ]}
            >
              {booking.status}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemName}>
              {toTitleCase(booking.package_name) || booking.tour_package_id}
            </Text>
            <View style={styles.column}>
              <Text style={styles.item}>
                <Text style={styles.datelabel}>Scheduled Date:</Text>{" "}
                {new Date(booking.scheduled_date).toLocaleDateString()}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Guests:</Text>{" "}
                {booking.number_of_guests}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Total:</Text> ₱{booking.total_price}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Operator:</Text>{" "}
                {toTitleCase(booking.tour_operator_name) || "N/A"}
              </Text>
              <View style={styles.date}>
                <Text style={styles.timestamp}>
                  Booked: {new Date(booking.created_at).toLocaleString()}
                </Text>
              </View>
              <View style={styles.date}>
                <Text style={styles.timestamp}>
                  Updated: {new Date(booking.updated_at).toLocaleString()}
                </Text>
              </View>

              {booking.tour_guides?.length > 0 && (
                <Text style={styles.item}>
                  <Text style={styles.label}>Guide(s):</Text>{" "}
                  {toTitleCase(
                    booking.tour_guides
                      .map((g) => `${g.first_name} ${g.last_name}`)
                      .join(", ")
                  )}
                </Text>
              )}
            </View>
          </View>
          {booking.proof_of_payment && (
            <TouchableOpacity
              onPress={() => Linking.openURL(booking.proof_of_payment)}
            >
              <Text style={styles.link}>View Proof of Payment</Text>
            </TouchableOpacity>
          )}

          {booking.status === "FINISHED" && (
            <View style={styles.feedbackRow}>
              {booking.tour_guides?.map((g) => (
                <TouchableOpacity
                  key={`${g.tourguide_id}-${booking.id}`}
                  style={styles.feedbackButton}
                  onPress={() =>
                    setGuideFeedbackOpen({
                      bookingId: booking.id,
                      guideId: g.tourguide_id,
                      guideName: `${g.first_name} ${g.last_name}`,
                    })
                  }
                >
                  <Text style={styles.feedbackText}>Guide: {g.first_name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.feedbackButton, { backgroundColor: "#1d4ed8" }]}
                onPress={() =>
                  setOperatorFeedbackOpen({
                    bookingId: booking.id,
                    operatorId: booking.touroperator_id,
                    operatorName: booking.tour_operator_name || "Tour Operator",
                  })
                }
              >
                <Text style={styles.feedbackText}>Tour Operator</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* {(booking.status === 'APPROVED' ||
              booking.status === 'PENDING') && (
              <TouchableOpacity
                style={[
                  styles.feedbackButton,
                  { backgroundColor: '#dc2626', marginTop: 12 },
                ]}
                onPress={() => {
                  Alert.alert(
                    'Cancel Booking?',
                    'Are you sure you want to cancel this booking?',
                    [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            const result = await cancelBooking(booking.id);
                            Alert.alert(
                              'Cancelled',
                              result.message || 'Booking cancelled successfully'
                            );
                            if (userId) fetchByTourist(userId);
                          } catch (err) {
                            Alert.alert(
                              'Error',
                              err?.response?.data?.error || 'Failed to cancel.'
                            );
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.feedbackText}>Cancel Booking</Text>
              </TouchableOpacity>
            )} */}
        </View>
      ))}

      {operatorFeedbackOpen && (
        <OperatorFeedbackModal
          open={true}
          onClose={() => setOperatorFeedbackOpen(null)}
          bookingId={operatorFeedbackOpen.bookingId}
          operatorId={operatorFeedbackOpen.operatorId}
          operatorName={operatorFeedbackOpen.operatorName}
          onSubmitted={() => {
            if (userId) fetchByTourist(userId);
          }}
        />
      )}

      {guideFeedbackOpen && (
        <GuideFeedbackModal
          open={true}
          onClose={() => setGuideFeedbackOpen(null)}
          bookingId={guideFeedbackOpen.bookingId}
          guideId={guideFeedbackOpen.guideId}
          guideName={guideFeedbackOpen.guideName}
          onSubmitted={() => {
            if (userId) fetchByTourist(userId);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  center: {
    alignItems: "center",
    marginVertical: 24,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 10,
    color: "#334155",
    fontSize: 14,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: 14,
    marginTop: 12,
  },
  empty: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  column: {
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
  },
  date: {
    justifyContent: "flex-start",
    paddingHorizontal: 12,
  },
  id: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1c5461",
  },
  status: {
    fontWeight: "600",
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    textTransform: "uppercase",
  },
  approved: {
    backgroundColor: "#6ad068",
    color: "#fff",
    fontWeight: "700",
  },
  pending: {
    backgroundColor: "#fef9c2",
    color: "#a65f44",
    fontWeight: "700",
  },
  finished: {
    backgroundColor: "#e5e7eb",
    color: "#4b5563",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1c5461",
    marginBottom: 4,
    width: "100%",
  },
  item: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 2,
  },
  datelabel: {
    fontWeight: "500",
    color: "#51702c",
  },
  label: {
    fontWeight: "500",
    color: "#334155",
  },
  link: {
    color: "#1d4ed8",
    textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: "500",
  },
  feedbackRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    marginTop: 14,
  },
  feedbackButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 10,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});
