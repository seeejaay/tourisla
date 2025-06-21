import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Linking, SafeAreaView, Platform, StatusBar, ActivityIndicator, Alert
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { logout } from '@/lib/api/auth'; // Import the logout function

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

export default function Settings() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [rulesError, setRulesError] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoadingRules(true);
      setRulesError(null);
      const response = await axios.get(`${API_URL}/api/rules`);
      setRules(response.data);
    } catch (error) {
      setRulesError('Failed to load rules and regulations');
    } finally {
      setLoadingRules(false);
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Error opening URL:', err);
    });
  };

  const navigateToHotlines = () => {
    router.push('/operator/profile/about/hotlines/operator_hotlines');
  };

  const navigateToTerms = () => {
    router.push('/operator/profile/about/terms/operator_terms');
  };

  const navigateToRules = () => {
    router.push('/operator/profile/settings/rules/operator_rules');
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log("Logout response:", response);
      Alert.alert("Success", "Logged out successfully", [
        { text: "OK", onPress: () => router.replace('/login') }
      ]);
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const faqs = [
    {
      question: 'What is Tourisla?',
      answer: 'Tourisla is a comprehensive tourism platform for Isla Verde, providing information about tourist spots, accommodations, and local services.'
    },
    {
      question: 'How do I book accommodations?',
      answer: 'You can browse available accommodations in the app and contact them directly through the provided contact information.'
    },
    {
      question: 'Is there an internet connection in Isla Verde?',
      answer: 'Internet connectivity varies across the island. Major accommodations typically offer WiFi, but connection may be limited in remote areas.'
    },
    {
      question: 'How do I report issues with the app?',
      answer: 'You can report any issues through the Contact section or by emailing support@tourisla.com.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
      <View style={styles.section}>
        {/* Rules and Regulations - Direct navigation */}
        <TouchableOpacity 
          style={styles.subsectionHeader}
          onPress={navigateToRules}
          activeOpacity={0.7}
        >
            <Text style={styles.subsectionTitle}>Rules & Regulations</Text>
            <Feather name="chevron-right" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          
          {/* About Tourisla */}
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => toggleSection('about')}
          >
            <Text style={styles.subsectionTitle}>About Tourisla</Text>
            <Feather 
              name={expandedSection === 'about' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'about' && (
            <View style={styles.subsectionContent}>
              <Text style={styles.paragraph}>
                Content will be loaded from the database.
              </Text>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => {/* CRUD functionality will be added later */}}
              >
                <Text style={styles.linkText}>Read more</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Contacts and Hotline */}
          <TouchableOpacity 
            style={styles.subsectionHeader}
            onPress={navigateToHotlines}
            activeOpacity={0.7}
          >
            <Text style={styles.subsectionTitle}>Contacts & Hotlines</Text>
            <Feather name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>
          
          {/* FAQs */}
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => toggleSection('faqs')}
          >
            <Text style={styles.subsectionTitle}>FAQs</Text>
            <Feather 
              name={expandedSection === 'faqs' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'faqs' && (
            <View style={styles.subsectionContent}>
              {faqs.map((faq, index) => (
                <View key={index} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Socials */}
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => toggleSection('socials')}
          >
            <Text style={styles.subsectionTitle}>Social Media</Text>
            <Feather 
              name={expandedSection === 'socials' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'socials' && (
            <View style={[styles.subsectionContent, styles.socialsContainer]}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://www.facebook.com/tourisla')}
              >
                <FontAwesome name="facebook-square" size={28} color="#1877f2" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://www.instagram.com/tourisla')}
              >
                <FontAwesome name="instagram" size={28} color="#c13584" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://www.twitter.com/tourisla')}
              >
                <FontAwesome name="twitter-square" size={28} color="#1da1f2" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://www.youtube.com/tourisla')}
              >
                <FontAwesome name="youtube-play" size={28} color="#ff0000" />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Terms and Conditions */}
          <TouchableOpacity 
            style={styles.subsectionHeader}
            onPress={navigateToTerms}
            activeOpacity={0.7}
          >
            <Text style={styles.subsectionTitle}>Terms & Conditions</Text>
            <Feather name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>
          
          {expandedSection === 'terms' && (
            <View style={styles.subsectionContent}>
              <Text style={styles.paragraph}>
                Content will be loaded from the database.
              </Text>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => {/* CRUD functionality will be added later */}}
              >
                <Text style={styles.linkText}>Read full Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Data Privacy */}
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => toggleSection('privacy')}
          >
            <Text style={styles.subsectionTitle}>Data Privacy</Text>
            <Feather 
              name={expandedSection === 'privacy' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'privacy' && (
            <View style={styles.subsectionContent}>
              <Text style={styles.paragraph}>
                Content will be loaded from the database.
              </Text>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => {/* CRUD functionality will be added later */}}
              >
                <Text style={styles.linkText}>Read full Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Tourisla v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2023 Tourisla. All rights reserved.</Text>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  subsectionContent: {
    padding: 16,
    paddingLeft: 24,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 12,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  socialButton: {
    padding: 10,
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#38bdf8',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});



