import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';import { Ionicons } from '@expo/vector-icons';
export default function OperatorProfileScreen({ headerHeight }: { headerHeight: number }) {
  return (    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>        <Text style={styles.headerText}>Profile</Text>
        <Text style={styles.subHeaderText}>Manage your tour operator profile</Text>        
        <View style={styles.profileCard}>          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>              <Text style={styles.avatarText}>TO</Text>
            </View>            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Tour Operator</Text>              <Text style={styles.profileEmail}>operator@example.com</Text>
            </View>          </View>
                    <View style={styles.profileActions}>
            <TouchableOpacity style={styles.profileActionButton}>              <Ionicons name="create-outline" size={20} color="#0ea5e9" />
              <Text style={styles.profileActionText}>Edit Profile</Text>            </TouchableOpacity>
          </View>        </View>
                <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>          
          <View style={styles.settingsCard}>            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={22} color="#64748b" />              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" style={styles.settingArrow} />            </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="lock-closed-outline" size={22} color="#64748b" />              <Text style={styles.settingText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" style={styles.settingArrow} />            </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="card-outline" size={22} color="#64748b" />              <Text style={styles.settingText}>Payment Methods</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" style={styles.settingArrow} />            </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={22} color="#64748b" />              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" style={styles.settingArrow} />            </TouchableOpacity>
          </View>          
          <TouchableOpacity style={styles.logoutButton}>            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>          </TouchableOpacity>
        </View>      </ScrollView>
    </View>  );
}
const styles = StyleSheet.create({  container: {
    flex: 1,    backgroundColor: '#f8fafc',
  },  scrollContent: {
    padding: 16,    paddingBottom: 100,
  },  headerText: {
    fontSize: 24,    fontWeight: 'bold',
    color: '#0f172a',    marginBottom: 4,
  },  subHeaderText: {
    fontSize: 16,    color: '#64748b',
    marginBottom: 24,  },
  profileCard: {    backgroundColor: '#ffffff',
    borderRadius: 12,    padding: 16,
    marginBottom: 24,    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },    shadowOpacity: 0.05,
    shadowRadius: 3,    elevation: 2,
  },  profileHeader: {
    flexDirection: 'row',    alignItems: 'center',
    marginBottom: 16,  },
  avatarContainer: {    width: 60,
    height: 60,    borderRadius: 30,
    backgroundColor: '#0ea5e9',    justifyContent: 'center',
    alignItems: 'center',    marginRight: 16,
  },  avatarText: {
    color: '#ffffff',    fontSize: 24,
    fontWeight: 'bold',  },
  profileInfo: {    flex: 1,
  },  profileName: {
    fontSize: 18,    fontWeight: '600',
    color: '#0f172a',    marginBottom: 4,
  },  profileEmail: {
    fontSize: 14,    color: '#64748b',
  },  profileActions: {
    flexDirection: 'row',    justifyContent: 'flex-end',
  },  profileActionButton: {
    flexDirection: 'row',    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',    paddingVertical: 8,
    paddingHorizontal: 12,    borderRadius: 8,
  },  profileActionText: {
    fontSize: 14,    fontWeight: '500',
    color: '#0ea5e9',    marginLeft: 6,
  },  settingsSection: {
    marginBottom: 24,  },
  sectionTitle: {    fontSize: 18,
    fontWeight: '600',    color: '#0f172a',
    marginBottom: 16,  },
  settingsCard: {    backgroundColor: '#ffffff',
    borderRadius: 12,    overflow: 'hidden',
    marginBottom: 16,    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },    shadowOpacity: 0.05,
    shadowRadius: 3,    elevation: 2,
  },  settingItem: {
    flexDirection: 'row',    alignItems: 'center',
    padding: 16,    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',  },
  settingText: {    flex: 1,
    fontSize: 16,    color: '#334155',
    marginLeft: 12,  },
  settingArrow: {    marginLeft: 8,
  },  logoutButton: {
    flexDirection: 'row',    alignItems: 'center',
    justifyContent: 'center',    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 12,    borderRadius: 8,
  },  logoutText: {
    fontSize: 16,    fontWeight: '500',
    color: '#ef4444',    marginLeft: 8,
  },
});





































































































