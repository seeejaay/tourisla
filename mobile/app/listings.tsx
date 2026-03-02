import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { fetchTripadvisorHotels } from '@/lib/api/tripadvisor';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Listings({ headerHeight }) {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await fetchTripadvisorHotels();
        setHotels(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load hotels.');
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#24b4ab" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (hotels.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hotels found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Hotel Listings</Text>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.location_id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => {
          const imageUrl =
            item.photos?.[0]?.images?.large?.url || 'https://via.placeholder.com/288x160';
          return (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://www.tripadvisor.com.ph/Hotel_Review-d${item.location_id}`)
              }
              style={styles.card}
              activeOpacity={0.8}
            >
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address_obj?.address_string}</Text>
              <Text style={styles.link}>View on Tripadvisor</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  navButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1, // fills available vertical space
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // optional
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  flatListContent: {
    paddingVertical: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: (width - 40) / 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
    borderColor: '#ececee',
    borderWidth: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginBottom: 8,
    backgroundColor: '#e6e6e6',
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1c5461',
  },
  address: {
    fontSize: 10,
    paddingHorizontal: 8,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  link: {
    color: '#24b4ab',
    fontWeight: '600',
    fontSize: 12,
    marginVertical: 8,
    marginTop: 'auto',
  },
});