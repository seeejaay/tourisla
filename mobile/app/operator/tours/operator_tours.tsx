import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function OperatorToursScreen({ headerHeight }: { headerHeight: number }) {
  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Manage Tours</Text>
        <Text style={styles.subHeaderText}>View and manage your tour offerings</Text>
        
        {/* Tour management content will go here */}
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Tour management features coming soon</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  placeholderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
  }
});
