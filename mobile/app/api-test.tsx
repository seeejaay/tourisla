import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { getApiUrl } from '@/lib/api/utils';

export default function ApiTestScreen() {
  const [results, setResults] = useState([]);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoints = async () => {
    setIsLoading(true);
    setResults([]);
    
    const endpoints = [
      'login',
      'hotlines',
      'users',
      'tourist-spots',
      customEndpoint
    ].filter(Boolean); // Remove empty endpoints
    
    const newResults = [];
    
    for (const endpoint of endpoints) {
      try {
        const url = getApiUrl(endpoint);
        newResults.push({ endpoint, url, status: 'Testing...', details: '' });
        setResults([...newResults]);
        
        const response = await axios.get(url, { 
          timeout: 5000,
          validateStatus: () => true // Don't throw on any status code
        });
        
        newResults[newResults.length - 1] = {
          endpoint,
          url,
          status: `${response.status} ${response.statusText || ''}`,
          details: typeof response.data === 'object' 
            ? JSON.stringify(response.data, null, 2).substring(0, 100) + '...'
            : String(response.data).substring(0, 100) + '...'
        };
      } catch (error) {
        newResults[newResults.length - 1] = {
          endpoint,
          url: getApiUrl(endpoint),
          status: 'Error',
          details: error.message
        };
      }
      setResults([...newResults]);
    }
    
    setIsLoading(false);
  };

  const testInternetConnectivity = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://www.google.com', { timeout: 5000 });
      Alert.alert(
        'Internet Connectivity',
        `Your device can connect to the internet. Status: ${response.status}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Internet Connectivity Failed',
        `Your device cannot connect to the internet. Error: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showEnvironmentInfo = () => {
    Alert.alert(
      'Environment Variables',
      `EXPO_PUBLIC_API_URL: ${process.env.EXPO_PUBLIC_API_URL || 'Not set'}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Endpoint Tester</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Custom endpoint (e.g., 'auth/profile')"
          value={customEndpoint}
          onChangeText={setCustomEndpoint}
        />
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={testEndpoints}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test API Endpoints'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={testInternetConnectivity}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Internet</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.envButton} 
        onPress={showEnvironmentInfo}
      >
        <Text style={styles.buttonText}>Show Environment Info</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <Text style={styles.resultEndpoint}>{result.endpoint}</Text>
            <Text style={styles.resultUrl}>{result.url}</Text>
            <Text style={styles.resultStatus}>Status: {result.status}</Text>
            {result.details && (
              <Text style={styles.resultDetails}>{result.details}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  envButton: {
    backgroundColor: '#64748b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  resultEndpoint: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  resultUrl: {
    color: '#64748b',
    marginBottom: 4,
  },
  resultStatus: {
    color: '#0f172a',
    fontWeight: '500',
    marginBottom: 4,
  },
  resultDetails: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
  },
});