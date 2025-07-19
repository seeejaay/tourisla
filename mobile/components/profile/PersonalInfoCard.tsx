import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const formatNameWords = (name: string) => {
  if (!name) return '';
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function PersonalInfoCard({ user }: { user: any }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  const handleEditProfile = () => {
    router.push({
      pathname: '/tourist/profile/edit_profile',
      params: {
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user?.phone_number || '',
        nationality: user?.nationality || '',
        email: user?.email || '',
        birth_date: user?.birth_date || ''
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#0f172a"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dropdownContent}>
          {[
            {
              icon: 'mail',
              label: 'Email',
              value: user?.email?.toLowerCase() || 'Not provided',
            },
            {
              icon: 'phone',
              label: 'Phone',
              value: user?.phone_number || 'Not provided',
            },
            {
              icon: 'flag',
              label: 'Nationality',
              value: user?.nationality || 'Not provided',
            },
            {
              icon: 'user',
              label: 'Account Type',
              value: formatNameWords(user?.role) || 'Tourist',
            },
            {
              icon: 'calendar',
              label: 'Birth Date',
              value: user?.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'Not provided',
            },
          ].map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Feather name={item.icon as any} size={18} color="#64748b" style={styles.icon} />
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 30,
    borderWidth : 1,
    borderRadius: 16,
    paddingVertical: 16,
    borderColor: '#dddde0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  dropdownContent: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  icon: {
    marginRight: 12,
    marginTop: 3,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginTop: 2,
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
  },
});
