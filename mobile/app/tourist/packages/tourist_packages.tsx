import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { fetchAllTourPackages } from '@/lib/api/tour-packages';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


interface TouristPackagesScreenProps {
  headerHeight: number;
}

interface TourPackage {
  id: number;
  package_name: string;
  description?: string;
  price?: number;
  duration?: string;
  created_at?: string;
  updated_at?: string;
  available_slots?: number; 
  // add any other columns you have in tour_packages table
}

export default function TouristPackagesScreen({ headerHeight }: TouristPackagesScreenProps) {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const renderPackage = ({ item }: { item: TourPackage }) => (
    <View style={styles.packageCard}>
      {item.package_name ? (
        <Text style={styles.packageName}>
          {item.package_name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          }
        </Text>
      ) : null}
      {item.location ? (
        <Text style={styles.packageLocation}>
        {item.location
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        }
        </Text>
      ) : null}
      {item.available_slots !== undefined && (
        <View style={styles.slotsContainer}>
          <Text style={styles.slots}>
            {item.available_slots} {item.available_slots === 1 ? 'Slot' : 'Slots'} Available
          </Text>
        </View>
      )}
      {item.price ? (
        <View style={styles.cardFooter}>
          <View style={styles.packagePriceContainer}>
            <Text style={styles.packagePrice}>Price:</Text>
            <Text style={styles.price}>₱{item.price}</Text>
          </View>
          <View style={styles.packagePriceContainer}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => router.push(`/tourist/packages/packages/${item.id}`)}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <Text style={styles.title}>Explore Tour Packages</Text>
        <Text style={styles.intro}>
          Discover our curated tour packages designed to enhance your travel experience.</Text>

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
  <FlatList
    data={packages}
    keyExtractor={pkg => pkg.id.toString()}
    renderItem={renderPackage}
    contentContainerStyle={styles.listContent}
    showsVerticalScrollIndicator={false}
  />

  {/* Top fade */}
  <LinearGradient
    colors={['#f8fafc', 'transparent']}
    style={styles.topFade}
    pointerEvents="none"
  />

  {/* Bottom fade */}
  <LinearGradient
    colors={['transparent', '#f8fafc']}
    style={styles.bottomFade}
    pointerEvents="none"
  />
</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1c5461',
    marginTop: 16,
    marginHorizontal: 16,
  },
  intro: {
    fontSize: 16,
    color: '#64748b',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 1,
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
    backgroundColor: '#daf8e4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    marginHorizontal: 16,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0c5e58',
    marginBottom: 0,
  },
  packageDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  slotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slots: {
    fontSize: 12,
    color: '#5ea5aa',
    fontWeight: '900',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  packagePriceContainer: {
    flexDirection: 'column',
    width: '50%',
  },
  packagePrice: {
    fontSize: 11,
    color: '#a0b4b8',
    fontWeight: '900',
  },
  price: {
    fontSize: 22,
    color: '#1ca949',
    fontWeight: '900',
  },
  packageLocation: {
    fontSize: 12,
    color: '#737385',
    marginBottom: 20,
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
  detailsButton: {
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  detailsButtonText: {
    color: 'gray',
    fontWeight: '700',
  },
});
