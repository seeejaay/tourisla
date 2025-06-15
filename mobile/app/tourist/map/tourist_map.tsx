import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TouristMapScreen({ headerHeight }) {
  // Use a local image from the assets folder
  // Create the assets folder if it doesn't exist: mobile/assets/maps/
  // Then place your map image there and reference it like this:
  const mapImageSource = require('@/assets/maps/cebu-tourist-map.jpg');
  
  // Alternatively, you can still use a remote URL if needed
  // const mapImageUrl = "https://www.cebu-philippines.net/images/cebu-tourist-map.jpg";

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.content, { marginTop: headerHeight }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Tourist Map</Text>
          <Text style={styles.headerSubtitle}>Explore key locations and attractions</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mapContainer}>
            <Image 
              source={mapImageSource}
              style={styles.mapImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Map Legend</Text>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
              <Text style={styles.legendText}>Tourist Spots</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3498db' }]} />
              <Text style={styles.legendText}>Beaches</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2ecc71' }]} />
              <Text style={styles.legendText}>Parks & Nature</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f39c12' }]} />
              <Text style={styles.legendText}>Historical Sites</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9b59b6' }]} />
              <Text style={styles.legendText}>Shopping & Entertainment</Text>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color="#38bdf8" />
              <Text style={styles.infoTitle}>About This Map</Text>
            </View>
            <Text style={styles.infoText}>
              This map shows the major tourist attractions, beaches, historical sites, and other 
              points of interest. Use it to plan your journey and discover the best places to visit.
              For more detailed information about specific locations, check the Tourist Spots section.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mapContainer: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  legendContainer: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
    color: '#334155',
  },
  infoContainer: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
});
