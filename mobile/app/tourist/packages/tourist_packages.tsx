import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, StatusBar, Dimensions, Image } from 'react-native';
import { fetchAllTourPackages } from '@/lib/api/tour-packages';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toTitleCase } from '@/lib/utils/textFormat';
import SearchBar from "@/components/SearchBar";
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';

interface TouristPackagesScreenProps {
  headerHeight: number;
}

interface TourGuide {
  tourguide_id: number;
  first_name: string;
  last_name: string;
}

interface TourPackage {
  id: number;
  package_name: string;
  description?: string;
  price?: number;
  duration?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  available_slots?: number; 
  guide_name?: string; // fallback
  tour_guides?: TourGuide[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_GAP * 2;

const ITEMS_PER_PAGE = 10; // Customize as needed

export default function TouristPackagesScreen() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const filteredPackages = packages.filter(pkg =>
    pkg.package_name.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedFilter === '' || toTitleCase(pkg.location || '') === selectedFilter)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const locationOptions = Array.from(
    new Set(packages.map(pkg => toTitleCase(pkg.location || '')).filter(loc => loc))
  );
  
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        const data = await fetchAllTourPackages();
        setPackages(data); 
      } catch (err: any) {
        setError(err.message || 'Failed to load packages');
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedFilter]);

  const renderPackage = ({ item }: { item: TourPackage }) => (
    <TouchableOpacity
      style={styles.packageCard}
      onPress={() => router.push(`/tourist/packages/packages/${item.id}`)}
      activeOpacity={0.9}
    >
      {item.package_name && (
        <View style={styles.nameWrapper}>
          <Text style={styles.packageName}>{toTitleCase(item.package_name)}</Text>
          {item.price !== undefined && (
            <View style={styles.priceWrapper}>
              <View style={styles.pointyCorner} />
              <Text style={styles.priceText}>₱ {item.price}</Text>
            </View>
          )}
        </View>
      )}

      {item.location ? (
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={12} color="#737385" style={styles.locationIcon} />
          <Text style={styles.packageLocation}>
            {toTitleCase(item.location)}
          </Text>
        </View>
      ) : null}

      {(item.tour_guides?.length || item.guide_name) && (
        <View style={styles.guideRow}>
          <Ionicons name="person" size={14} color="#3e979f" style={styles.guideIcon} />
            <Text style={styles.guideText}>
            {item.tour_guides && item.tour_guides.length > 0
              ? item.tour_guides.map(g => toTitleCase(`${g.first_name} ${g.last_name}`.trim())).join(', ')
              : toTitleCase(item.guide_name || '')}
            </Text>
        </View>
      )}

      {item.available_slots !== undefined && (
        <View style={styles.slotsContainer}>
            <Ionicons name="people" size={16} color="#24b4ab" style={{ marginRight: 4 }} />
            <Text style={styles.slots}>
            {item.available_slots} {item.available_slots === 1 ? 'Slot' : 'Slots'} Available
            </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/hero-carousel/1.jpg")}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Explore Tour Packages</Text>
          <Text style={styles.headerSubtitle}>Discover our curated tour packages designed to enhance your travel experience.</Text>
        </View>
      </View>
      <View style={[styles.container]}>
        <View style={styles.searchFilterRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search packages..."
            />
          </View>
          <FilterDropdown
            options={locationOptions}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>Loading packages...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && packages.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No packages found.</Text>
          </View>
        )}

        {!loading && !error && packages.length > 0 && (
          <View style={{ flex: 1 }}>
            <>
              <FlatList
                data={paginatedPackages}
                keyExtractor={pkg => pkg.id.toString()}
                renderItem={renderPackage}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                numColumns={1}
                ListFooterComponent={
                  <View style={styles.paginationWrapper}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </View>
                }
              />
              <LinearGradient
                colors={['transparent', '#f8fafc']}
                style={styles.bottomFade}
                pointerEvents="none"
              />
            </>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: { position: "relative", height: 200, marginBottom: 16 },
  headerImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerTextContainer: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    color: "white",
    fontWeight: "900",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e6f7fa",
    marginTop: 5,
    fontWeight: "600",
    textAlign: "center",
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  searchBarWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 1,
  },
  packageCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#f4f1de',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  nameWrapper: {
    position: 'relative',
    paddingRight: 100, // reserve space for price so text doesn’t overflow into it
  },
  packageName: {
    width: '80%',
    fontSize: 18,
    fontWeight: '900',
    color: '#1c5461',
    flexShrink: 1,
  },
  priceWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  
  pointyCorner: {
    width: 0,
    height: 0,
    borderTopWidth: 30,
    borderLeftWidth: 30,
    borderTopColor: '#60dd8e', // Price badge background color
    borderLeftColor: 'transparent',
  },
  
  priceText: {
    backgroundColor: '#60dd8e',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '900',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 4,
  },
  packageLocation: {
    fontSize: 12,
    color: '#737385',
    fontWeight: '500',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  guideIcon: {
    marginRight: 4,
  },
  guideText: {
    fontSize: 12,
    color: '#3e979f',
    fontWeight: '600',
  },
  slotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slots: {
    fontSize: 12,
    color: '#24b4ab',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 8,
    color: '#64748b',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
  paginationWrapper: {
    alignItems: 'center',
  },
});
