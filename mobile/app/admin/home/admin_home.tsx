import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AdminHomeScreen({ headerHeight }) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={[styles.scrollView, { marginTop: headerHeight }]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome to Tourisla Admin</Text>
            <Text style={styles.cardText}>
              Manage tourist spots, announcements, and emergency hotlines from this dashboard.
            </Text>
          </View>
          
          {/* Quick stats cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#ebf8ff' }]}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Tourist Spots</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#e6fffa' }]}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Announcements</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Emergency Hotlines</Text>
            </View>
          </View>
          
          {/* Recent activity section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#38bdf8' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New announcement added</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10b981' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Tourist spot updated</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#f59e0b' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New hotline added</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
          
          {/* Add bottom padding to account for floating tab bar */}
          <View style={{ height: 180 }} />
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
