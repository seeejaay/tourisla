import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function StaffHomeScreen({ headerHeight }) {
  return (
    <ScrollView
      style={[styles.container, { paddingTop: headerHeight }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Tourism Staff Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to your staff dashboard</Text>
      
      {/* Add your staff dashboard content here */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Text style={styles.cardText}>Your staff-specific features will appear here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});