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
              <FontAwesome5 name={role.icon} size={30} color="#657e8d" />
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1c5461',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1c5461',
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
    borderColor: '#7eccb6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#00c2c7',
    backgroundColor: '#e6fdfb',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#7eccb6',
    borderRadius: 25,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c5461',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#0086ad',
  },
  continueButton: {
    backgroundColor: '#7eccb6',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#aedbd3',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginRedirectText: {
    textAlign: 'center',
    color: '#1c5461',
    fontSize: 14,
    fontWeight: '600',
  },
});
