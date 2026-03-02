import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

/**
 * A component to display weather emojis
 */
const WeatherImage = ({ 
  condition, 
  isDay = true,
  size = 'medium',
  style = {} 
}) => {
  // Get the appropriate emoji based on weather condition and time of day
  const getWeatherEmoji = () => {
    const conditionLower = condition?.toLowerCase() || '';
    
    // Map condition to emoji
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return isDay ? '☀️' : '🌙';
    } else if (conditionLower.includes('cloud')) {
      return isDay ? '⛅' : '☁️';
    } else if (conditionLower.includes('rain')) {
      return '🌧️';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return '⛈️';
    } else if (conditionLower.includes('snow')) {
      return '❄️';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return '🌫️';
    } else if (conditionLower.includes('wind')) {
      return '💨';
    }
    
    // Default to sunny/clear
    return isDay ? '☀️' : '🌙';
  };
  
  // Determine font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 48;
      case 'large': return 72;
      default: return 48;
    }
  };
  
  const fontSize = getFontSize();
  
  if (!condition) {
    return <View style={[styles.container, style]} />;
  }
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.emoji, { fontSize }]}>
        {getWeatherEmoji()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    lineHeight: undefined, // Removes extra padding around emoji
  }
});

export default WeatherImage;



