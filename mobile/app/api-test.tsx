import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar, ActivityIndicator, Platform 
} from 'react-native';
import axios from 'axios';


export default function ApiTestScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const getApiUrl = (endpoint) => {
    // Test different URL patterns
    return `${API_URL}${endpoint}`;
  };

  const testEndpoints = async () => {
    setLoading(true);
    
    // List of endpoints to test
    const endpoints = [
      'rules',
      'api/rules',
      'api/v1/rules',
      'v1/rules',
      'api/v1/tourist-spots', // Test a known working endpoint for comparison
    ];
    
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
    
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>API Endpoint Test</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={testEndpoints}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.baseUrlText}>Base URL: {API_URL}</Text>
      
      {loading && results.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Testing API endpoints...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {results.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.endpointText}>Endpoint: {result.endpoint}</Text>
              <Text style={styles.urlText}>URL: {result.url}</Text>
              <Text style={[
                styles.statusText, 
                result.status.startsWith('2') ? styles.successStatus : 
                result.status === 'Testing...' ? styles.pendingStatus : styles.errorStatus
              ]}>
                Status: {result.status}
              </Text>
              {result.details && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsLabel}>Response:</Text>
                  <Text style={styles.detailsText}>{result.details}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0f172a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    backgroundColor: '#0f766e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  baseUrlText: {
    padding: 16,
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#e2e8f0',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  endpointText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  successStatus: {
    color: '#16a34a',
  },
  errorStatus: {
    color: '#dc2626',
  },
  pendingStatus: {
    color: '#0369a1',
  },
  detailsContainer: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 6,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#334155',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
});
