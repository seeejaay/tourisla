import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'tourist',
      title: 'Tourist',
      description: 'Explore destinations and book tours',
      icon: 'user',
    },
    {
      id: 'tour_guide',
      title: 'Tour Guide',
      description: 'Create and lead tours for tourists',
      icon: 'map-marked-alt',
    },
    {
      id: 'tour_operator',
      title: 'Tour Operator',
      description: 'Manage tour packages and guides',
      icon: 'building',
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: '/signup',
        params: { role: selectedRole }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>Select how you want to use Tourisla</Text>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.title && styles.selectedCard,
            ]}
            onPress={() => setSelectedRole(role.title)}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name={role.icon} size={30} color="#0f172a" />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedRole && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginRedirectText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 40,
  },
  rolesContainer: {
    gap: 16,
    marginBottom: 40,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  continueButton: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginRedirectText: {
    textAlign: 'center',
    color: '#0f172a',
  },
});
