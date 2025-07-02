import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAttractionHistoryManager } from '@/hooks/useAttractionHistoryManager';
import { fetchTouristSpots } from '@/lib/api/touristSpot';
import { fetchMySpotFeedbacks } from '@/lib/api/feedback';
import { ViewCard } from '@/components/attraction-history/viewCard';
import { DetailsModal } from '@/components/attraction-history/detailsModal';
import { FeedbackModal } from '@/components/attraction-history/FeedbackModal';
import HeaderWithBack from '@/components/HeaderWithBack';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown'; 

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(''); // ✅ Filter state

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

  const allSpotNames = useMemo(() => Array.from(new Set(spots.map(s => s.name))), [spots]); // ✅ Dropdown options

  // ✅ Filter history by search & selected filter
  const filteredHistory = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return history.filter((log) => {
      const spotName = spotMap[log.tourist_spot_id] || '';
      const matchesSearch = spotName.toLowerCase().includes(lowerQuery);
      const matchesFilter = selectedFilter === '' || spotName === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter, history, spotMap]);

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
    <View style={styles.container}>
      <HeaderWithBack title="Visit History" backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Attraction Visit History</Text>

        {/* ✅ Search + Filter */}
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
            options={allSpotNames}
          />
        </View>

        {/* ✅ Results */}
        {filteredHistory.length === 0 ? (
          <Text style={styles.label}>No visit history found.</Text>
        ) : (
          filteredHistory.map((log) => {
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
  scroll: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#002b11',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
