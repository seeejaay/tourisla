import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '@/lib/api/auth';

const { width } = Dimensions.get('window');

const destinations = [
  {
    title: 'Pristine Beaches',
    description: 'Relax on untouched shores with crystal-clear waters and powdery white sand.',
    image: require('@/assets/images/nature/sea.jpg'),
    icon: <FontAwesome5 name="umbrella-beach" size={24} color="#3e979f" />,
  },
  {
    title: 'Jungle Trails',
    description: 'Explore lush jungle paths leading to breathtaking viewpoints and hidden waterfalls.',
    image: require('@/assets/images/nature/sun.jpg'),
    icon: <FontAwesome5 name="leaf" size={24} color="#51702c" />,
  },
  {
    title: 'Marine Adventures',
    description: 'Discover vibrant coral reefs teeming with tropical fish and marine life.',
    image: require('@/assets/images/nature/sand.jpg'),
    icon: <FontAwesome5 name="swimmer" size={24} color="#1c5461" />,
  },
];

const locations = [
  { name: 'Sillon', region: 'North' },
  { name: 'Bantigue', region: 'East' },
  { name: 'Montalban', region: 'West' },
  { name: 'Obo-ob', region: 'South' },
  { name: 'Santa Fe', region: 'North' },
  { name: 'Ticad', region: 'East' },
  { name: 'Sulangan', region: 'West' },
];

export default function TouristHome() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const user = await auth.getCurrentUser();
        if (user && user.name) {
          setUserName(user.name.split(' ')[0]);
        }
      } catch (error) {
        console.error('Error getting user name:', error);
      }
    };

    getUserName();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/images/Bantayan_Map.webp')}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Discover Island Paradise</Text>
            <Text style={styles.heroSubtitle}>
              Where emerald jungles meet turquoise waters in perfect harmony
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => router.push('/explore')}
              >
                <FontAwesome5 name="users" size={16} color="#fff" />
                <Text style={styles.exploreBtnText}> Explore Accommodation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => router.push('#contact')}
              >
                <Feather name="phone" size={16} color="#fff" />
                <Text style={styles.contactBtnText}> Contact Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Unique Experiences */}
        <View style={styles.heroSection2}>
        <Text style={styles.sectionTitle}>Unique Experiences</Text>
        {destinations.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>{item.icon}</View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>{item.description}</Text>
            </View>
          </View>
        ))}
        </View>

        {/* Locations */}
        <View style={styles.heroSection3}>
        <Text style={styles.sectionTitle}>Bantayan Island</Text>
        <View style={styles.locationsContainer}>
          {locations.map((loc, index) => (
            <View key={index} style={styles.locationBox}>
              <Text style={styles.locationName}>{loc.name}</Text>
              <Text style={styles.locationRegion}>{loc.region}</Text>
            </View>
          ))}
        </View>
        </View>
      </ScrollView>

      {/* Weather FAB Button */}
      <TouchableOpacity
        style={styles.weatherFab}
        onPress={() => router.push('/staff/weather')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scrollContent: {
    paddingBottom: 80
  },
  heroSection: {
    marginTop: 80,
    height: 300,
    overflow: 'hidden',
    position: 'relative'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute'
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 84, 97, 0.6)'
  },
  heroTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  heroTitle: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#ddddd1',
    marginBottom: 20
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#019375',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,

  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,

  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 12,
  },
  heroSection2: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#1c5461',
    marginVertical: 16,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },
  iconWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10
  },
  iconCircle: {
    backgroundColor: '#e0f2f1',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    padding: 16
  },
  iconBox: {
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1c5461',
    marginBottom: 6
  },
  cardText: {
    fontSize: 14,
    color: '#51702c'
  },
  heroSection3: {
    paddingVertical: 20,
    marginBottom: 80,
    backgroundColor: '#fffff1',
  },
  locationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  locationBox: {
    width: '32%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1c5461',
  },
  locationRegion: {
    fontSize: 12,
    color: '#7b9997'
  },
  weatherFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 108,
    left: 8,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#24b4ab',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  }
});
