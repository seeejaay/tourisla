import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, 
  RefreshControl, SafeAreaView, StatusBar, TouchableOpacity, 
  Dimensions, Platform 
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentWeather, getWeatherForecast, getWeatherBackgroundColor } from '@/lib/api/weather';
import WeatherImage from '@/components/WeatherImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function WeatherScreen() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Helper functions
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getBackgroundColors = () => {
    if (!currentWeather) return ['#1e293b', '#0f172a'];
    // Get the icon code from the weather data
    const iconCode = currentWeather.weather[0].icon;
    // Use the getWeatherBackgroundColor function with the icon code
    const backgroundColor = getWeatherBackgroundColor(iconCode);
    // Return an array with the background color and a darker shade
    return [backgroundColor, shadeColor(backgroundColor, -20)];
  };

  // Helper function to darken a color
  const shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.max(0, R).toString(16);
    G = Math.max(0, G).toString(16);
    B = Math.max(0, B).toString(16);

    const RR = (R.length === 1) ? "0" + R : R;
    const GG = (G.length === 1) ? "0" + G : G;
    const BB = (B.length === 1) ? "0" + B : B;

    return "#" + RR + GG + BB;
  };

  const groupForecastByDay = () => {
    if (!forecast || !forecast.list) return [];
    
    const grouped = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          date: date,
          items: [],
          minTemp: Infinity,
          maxTemp: -Infinity,
          icon: null,
          description: ''
        };
      }
      
      grouped[dateStr].items.push(item);
      grouped[dateStr].minTemp = Math.min(grouped[dateStr].minTemp, item.main.temp);
      grouped[dateStr].maxTemp = Math.max(grouped[dateStr].maxTemp, item.main.temp);
      
      const itemHour = date.getHours();
      if (itemHour >= 11 && itemHour <= 13) {
        grouped[dateStr].icon = item.weather[0].icon;
        grouped[dateStr].description = item.weather[0].description;
      }
    });
    
    // Ensure each day has an icon
    Object.keys(grouped).forEach(dateStr => {
      if (!grouped[dateStr].icon && grouped[dateStr].items.length > 0) {
        grouped[dateStr].icon = grouped[dateStr].items[0].weather[0].icon;
        grouped[dateStr].description = grouped[dateStr].items[0].weather[0].description;
      }
    });
    
    return Object.values(grouped).sort((a, b) => a.date - b.date).slice(0, 5);
  };

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Set default location to Bantayan Island, Cebu
      const defaultLocation = {
        latitude: 11.1667,  // Bantayan Island latitude
        longitude: 123.7333 // Bantayan Island longitude
      };
      
      let location;
      
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Location permission denied, using default location');
          location = defaultLocation;
        } else {
          // Try to get current location, but use default if it fails or takes too long
          const locationPromise = Location.getCurrentPositionAsync({ 
            accuracy: Location.Accuracy.Balanced 
          });
          
          // Set a timeout for getting location (5 seconds)
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Location timeout')), 5000);
          });
          
          // Race between getting location and timeout
          const userLocation = await Promise.race([locationPromise, timeoutPromise])
            .catch(err => {
              console.log('Error or timeout getting location:', err);
              return null;
            });
            
          if (userLocation) {
            location = userLocation.coords;
          } else {
            console.log('Using default location (Bantayan Island)');
            location = defaultLocation;
          }
        }
      } catch (error) {
        console.log('Error getting location:', error);
        location = defaultLocation;
      }
      
      // Store the location for future use
      await AsyncStorage.setItem('lastLocation', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now()
      }));
      
      const weatherData = await getCurrentWeather(location.latitude, location.longitude);
      setCurrentWeather(weatherData);
      
      const forecastData = await getWeatherForecast(location.latitude, location.longitude);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error loading weather data:', error);
      
      // Try to use cached weather data if available
      try {
        const cachedWeather = await AsyncStorage.getItem('cachedWeather');
        const cachedForecast = await AsyncStorage.getItem('cachedForecast');
        
        if (cachedWeather) {
          setCurrentWeather(JSON.parse(cachedWeather));
          if (cachedForecast) {
            setForecast(JSON.parse(cachedForecast));
          }
          setError('Using cached weather data. Pull down to refresh.');
        } else {
          setError('Failed to load weather data. Please try again.');
        }
      } catch (cacheError) {
        setError('Failed to load weather data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  useEffect(() => {
    if (currentWeather) {
      AsyncStorage.setItem('cachedWeather', JSON.stringify(currentWeather))
        .catch(err => console.error('Failed to cache weather data:', err));
    }
    
    if (forecast) {
      AsyncStorage.setItem('cachedForecast', JSON.stringify(forecast))
        .catch(err => console.error('Failed to cache forecast data:', err));
    }
  }, [currentWeather, forecast]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={getBackgroundColors()}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadWeatherData();
          }} tintColor="#ffffff" />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading weather data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="weather-cloudy-alert" size={60} color="#ffffff" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWeatherData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : currentWeather && (
          <View style={styles.weatherContent}>
            {/* Location and Date Header */}
            <View style={styles.headerInfo}>
              <View style={styles.locationHeader}>
                <Ionicons name="location-sharp" size={22} color="#ffffff" />
                <Text style={styles.locationText}>
                  {currentWeather.name}, {currentWeather.sys.country}
                </Text>
              </View>
              <Text style={styles.dateText}>{formatDate(currentWeather.dt)}</Text>
            </View>
            
            {/* Main Weather Card */}
            <View style={styles.mainCard}>
              <View style={styles.temperatureDisplay}>
                <WeatherImage 
                  condition={currentWeather.weather[0].main}
                  isDay={currentWeather.weather[0].icon.includes('d')}
                  size="large"
                  style={styles.weatherIcon}
                />
                <View style={styles.tempContainer}>
                  <Text style={styles.temperatureValue}>{Math.round(currentWeather.main.temp)}°</Text>
                  <Text style={styles.weatherDescription}>{currentWeather.weather[0].description}</Text>
                  <Text style={styles.feelsLike}>Feels like {Math.round(currentWeather.main.feels_like)}°</Text>
                </View>
              </View>
              
              {/* Weather Details Grid */}
              <View style={styles.detailsGrid}>
                {[
                  { icon: <Feather name="wind" size={20} color="#ffffff" />, 
                    value: `${currentWeather.wind.speed} m/s`, label: "Wind" },
                  { icon: <Feather name="droplet" size={20} color="#ffffff" />, 
                    value: `${currentWeather.main.humidity}%`, label: "Humidity" },
                  { icon: <MaterialCommunityIcons name="weather-cloudy" size={20} color="#ffffff" />, 
                    value: `${currentWeather.clouds.all}%`, label: "Cloud Cover" },
                  { icon: <MaterialCommunityIcons name="speedometer" size={20} color="#ffffff" />, 
                    value: `${currentWeather.main.pressure} hPa`, label: "Pressure" }
                ].map((item, index) => (
                  <View key={index} style={styles.detailItem}>
                    {item.icon}
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailValue}>{item.value}</Text>
                      <Text style={styles.detailLabel}>{item.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Today's Forecast Card */}
            {forecast && (
              <View style={styles.forecastCard}>
                <Text style={styles.cardTitle}>Today's Forecast</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
                  {forecast.list.slice(0, 8).map((item, index) => (
                    <View key={index} style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>{formatTime(item.dt)}</Text>
                      <WeatherImage 
                        condition={item.weather[0].main}
                        isDay={item.weather[0].icon.includes('d')}
                        size="small"
                        style={styles.hourlyIcon}
                      />
                      <Text style={styles.hourlyTemp}>{Math.round(item.main.temp)}°</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* 5-Day Forecast Card */}
            {forecast && (
              <View style={styles.forecastCard}>
                <Text style={styles.cardTitle}>5-Day Forecast</Text>
                {groupForecastByDay().map((day, index) => {
                  // Skip today
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const forecastDate = new Date(day.date);
                  forecastDate.setHours(0, 0, 0, 0);
                  if (index === 0 && forecastDate.getTime() === today.getTime()) return null;
                  
                  const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayDate = day.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                  
                  return (
                    <View key={index} style={styles.dailyForecastItem}>
                      <View style={styles.dailyDateContainer}>
                        <Text style={styles.dayName}>{dayName}</Text>
                        <Text style={styles.dayDate}>{dayDate}</Text>
                      </View>
                      
                      <WeatherImage 
                        condition={day.items[0].weather[0].main}
                        isDay={true}
                        size="small"
                        style={styles.dailyIcon}
                      />
                      
                      <View style={styles.dailyTempContainer}>
                        <Text style={styles.maxTemp}>{Math.round(day.maxTemp)}°</Text>
                        <Text style={styles.minTemp}>{Math.round(day.minTemp)}°</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            
            {/* Sun Times Card */}
            <View style={styles.sunMoonCard}>
              <Text style={styles.cardTitle}>Sun & Moon</Text>
              <View style={styles.sunMoonContent}>
                <View style={styles.sunContainer}>
                  <Feather name="sunrise" size={24} color="#f39c12" />
                  <Text style={styles.sunTimeValue}>
                    {currentWeather?.sys?.sunrise ? formatTime(currentWeather.sys.sunrise) : '--:--'}
                  </Text>
                  <Text style={styles.sunTimeLabel}>Sunrise</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.sunContainer}>
                  <Feather name="sunset" size={24} color="#e74c3c" />
                  <Text style={styles.sunTimeValue}>
                    {currentWeather?.sys?.sunset ? formatTime(currentWeather.sys.sunset) : '--:--'}
                  </Text>
                  <Text style={styles.sunTimeLabel}>Sunset</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  backgroundGradient: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: STATUS_BAR_HEIGHT + 10, paddingHorizontal: 16, paddingBottom: 30 },
  loadingContainer: { 
    flex: 1, justifyContent: 'center', alignItems: 'center', 
    height: height - STATUS_BAR_HEIGHT - 100 
  },
  loadingText: { color: '#ffffff', marginTop: 16, fontSize: 16 },
  errorContainer: { 
    flex: 1, justifyContent: 'center', alignItems: 'center', 
    height: height - STATUS_BAR_HEIGHT - 100 
  },
  errorText: { color: '#ffffff', marginTop: 16, fontSize: 16, textAlign: 'center', marginHorizontal: 24 },
  retryButton: { 
    marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12 
  },
  retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  weatherContent: { flex: 1 },
  headerInfo: { marginBottom: 24, alignItems: 'center' },
  locationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  locationText: { fontSize: 20, fontWeight: '600', color: '#ffffff', marginLeft: 8 },
  dateText: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  mainCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 24, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  temperatureDisplay: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  weatherIcon: { width: 100, height: 100 },
  tempContainer: { flex: 1, paddingLeft: 16 },
  temperatureValue: { fontSize: 64, fontWeight: 'bold', color: '#ffffff' },
  weatherDescription: { fontSize: 18, color: '#ffffff', textTransform: 'capitalize' },
  feelsLike: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
  detailItem: { 
    width: '48%', flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 16, padding: 12, marginBottom: 10 
  },
  detailTextContainer: { marginLeft: 12 },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  detailLabel: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' },
  forecastCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 24, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 16 },
  hourlyScroll: { marginHorizontal: -8 },
  hourlyItem: { 
    alignItems: 'center', marginHorizontal: 12, 
    backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 16, padding: 12, minWidth: 80 
  },
  hourlyTime: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
  hourlyIcon: { width: 40, height: 40, marginVertical: 8 },
  hourlyTemp: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  dailyForecastItem: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' 
  },
  dailyDateContainer: { width: '30%' },
  dayName: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  dayDate: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' },
  dailyIcon: { width: 40, height: 40 },
  dailyTempContainer: { flexDirection: 'row', width: '25%', justifyContent: 'flex-end' },
  maxTemp: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginRight: 8 },
  minTemp: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' },
  sunMoonCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 24, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  sunMoonContent: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  sunContainer: { alignItems: 'center', padding: 16 },
  sunTimeValue: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginTop: 8 },
  sunTimeLabel: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginTop: 4 },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
});







