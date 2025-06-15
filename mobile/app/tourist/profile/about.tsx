import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Linking, SafeAreaView, Platform, StatusBar 
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

export default function About() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
    router.push('/tourist/profile/about/hotlines/tourist_hotlines');
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
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* About Tourisla */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('about')}
          >
            <Text style={styles.sectionTitle}>About Tourisla</Text>
            <Feather 
              name={expandedSection === 'about' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'about' && (
            <View style={styles.sectionContent}>
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
        </View>

        {/* Contacts and Hotline - Direct navigation */}
        <TouchableOpacity 
          style={styles.section}
          onPress={navigateToHotlines}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contacts & Hotlines</Text>
            <Feather name="chevron-right" size={20} color="#64748b" />
          </View>
        </TouchableOpacity>

        {/* FAQs */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('faqs')}
          >
            <Text style={styles.sectionTitle}>FAQs</Text>
            <Feather 
              name={expandedSection === 'faqs' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'faqs' && (
            <View style={styles.sectionContent}>
              {faqs.map((faq, index) => (
                <View key={index} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Socials */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('socials')}
          >
            <Text style={styles.sectionTitle}>Social Media</Text>
            <Feather 
              name={expandedSection === 'socials' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'socials' && (
            <View style={[styles.sectionContent, styles.socialsContainer]}>
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
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('terms')}
          >
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Feather 
              name={expandedSection === 'terms' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'terms' && (
            <View style={styles.sectionContent}>
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
        </View>

        {/* Data Privacy */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('privacy')}
          >
            <Text style={styles.sectionTitle}>Data Privacy</Text>
            <Feather 
              name={expandedSection === 'privacy' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSection === 'privacy' && (
            <View style={styles.sectionContent}>
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
    fontSize: 18,
    fontWeight: '600',
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
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
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

