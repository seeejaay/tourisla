import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { fetchAllTourPackages } from '@/lib/api/tour-packages';
import { useRouter } from 'expo-router';


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
        <Text style={styles.packageName}>{item.package_name}</Text>
      ) : null}
      {item.location ? (
        <Text style={styles.packageLocation}>{item.location}</Text>
      ) : null}
      {item.description ? (
        <Text style={styles.packageDescription}>
          {item.description.charAt(0).toUpperCase() + item.description.slice(1).toLowerCase()}
        </Text>
      ) : null}
      {item.price ? (
        <Text style={styles.packagePrice}>Price: ₱{item.price}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/tourist/packages/${item.id}`)}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <Text style={styles.title}>Explore Tour Packages</Text>

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
          <FlatList
            data={packages}
            keyExtractor={pkg => pkg.id.toString()}
            renderItem={renderPackage}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  packageCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 16,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 0,
  },
  packageDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  packageLocation: {
    fontSize: 12,
    color: '#737385',
    marginBottom: 20,
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
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
