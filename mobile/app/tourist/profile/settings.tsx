import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Linking, SafeAreaView, Platform, StatusBar, ActivityIndicator, Alert
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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
  const [showTitleInHeader, setShowTitleInHeader] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowTitleInHeader(offsetY > 100); // adjust 100 depending on where the sectionTitle is
  };

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
    router.push('/tourist/profile/about/hotlines/tourist_hotlines');
  };

  const navigateToTerms = () => {
    router.push('/tourist/profile/about/terms/tourist_terms');
  };

  const navigateToRules = () => {
    router.push('/tourist/profile/settings/rules/tourist_rules');
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
      question: "What is Tourisla?",
      answer:
        "Tourisla is a tourism platform for Bantayan Island, Cebu. It provides information about tourist spots, accommodations, local services, and helps you plan your perfect island getaway.",
    },
    {
      question: "How do I book accommodations on Bantayan Island?",
      answer:
        "You can browse available accommodations on Tourisla and contact them directly through the provided contact details. Some listings may also offer online booking links.",
    },
    {
      question: "Is there internet connection on Bantayan Island?",
      answer:
        "Internet connectivity is available in most towns and major resorts on Bantayan Island. However, connection may be limited or slower in remote areas and some beaches.",
    },
    {
      question: "How do I report issues or give feedback about Tourisla?",
      answer:
        "You can report issues or send feedback through the Contact section of the app or by emailing support@tourisla.com. We value your input to improve your experience.",
    },
    {
      question: "What activities can I do on Bantayan Island?",
      answer:
        "Bantayan Island offers a variety of activities including island hopping, swimming, snorkeling, biking, exploring historical sites, and enjoying local cuisine.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <LinearGradient
        colors={['#248b7d', '#93d2ca']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showTitleInHeader ? 'Settings' : ''}
        </Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16} // smoother scroll updates
      >
      <View style={styles.section}>
        {/* Rules and Regulations - Direct navigation */}
      </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          {/* FAQs */}
          <Text style={styles.label}>About</Text>   
          <View style={styles.section}> 
          <TouchableOpacity 
          style={styles.subsectionHeader}
          onPress={navigateToRules}
          >
          <View style={styles.subsectionTitleWrapper}>
            <Feather name="file-text" size={16} color="#64748b" style={styles.subsectionIcon} />
            <Text style={styles.subsectionTitle}>Rules & Regulations</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#64748b" />
        </TouchableOpacity>
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => toggleSection('faqs')}
          >
          <View style={styles.subsectionTitleWrapper}>
            <FontAwesome5 name="question-circle" size={16} color="#64748b" style={styles.subsectionIcon} />
            <Text style={styles.subsectionTitle}>FAQs</Text>
          </View>
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


          <TouchableOpacity 
            style={styles.subsectionHeader}
            onPress={navigateToHotlines}
            activeOpacity={0.7}
          >
          <View style={styles.subsectionTitleWrapper}>
            <Feather name="phone-call" size={16} color="#64748b" style={styles.subsectionIcon} />
            <Text style={styles.subsectionTitle}>Contacts & Hotlines</Text>
          </View>
            <Feather name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity> 
          </View>

        {/* Socials */}    
        <Text style={styles.label}>Socials</Text>      
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => openLink('https://www.facebook.com/tourisla')}
          >
            <View style={styles.subsectionTitleWrapper}>
            <FontAwesome name="facebook-square" size={28} color="#1877f2" />
            <Text style={styles.subsectionTitle}>Facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => openLink('https://www.instagram.com/tourisla')}
          >
            <View style={styles.subsectionTitleWrapper}>
            <FontAwesome name="instagram" size={28} color="#c13584" />
            <Text style={styles.subsectionTitle}>Instagram</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => openLink('https://www.twitter.com/tourisla')}
          >
            <View style={styles.subsectionTitleWrapper}>
            <FontAwesome name="twitter-square" size={28} color="#199df0" />
            <Text style={styles.subsectionTitle}>X</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.subsectionHeader} 
            onPress={() => openLink('https://www.youtube.com/tourisla')}
          >
            <View style={styles.subsectionTitleWrapper}>
            <FontAwesome name="youtube-play" size={28} color="#ff0000" />
            <Text style={styles.subsectionTitle}>Youtube</Text>
            </View>
          </TouchableOpacity>
        </View>  

        {/* Rules Section */}
        <Text style={styles.label}>Legal Policies</Text>
        <View style={styles.section}>
          {/* Terms and Policies */}
          <TouchableOpacity style={styles.subsectionHeader}
            onPress={navigateToTerms}
          >
          <View style={styles.subsectionTitleWrapper}>
            <FontAwesome5 name="info-circle" size={16} color="#64748b" style={styles.subsectionIcon} />
            <Text style={styles.subsectionTitle}>Terms & Policies</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#64748b" />
        </TouchableOpacity>

          {/* Incident Report */}
          <TouchableOpacity style={styles.subsectionHeader}>
          <View style={styles.subsectionTitleWrapper}>
            <FontAwesome5 name="flag" size={16} color="#64748b" style={styles.subsectionIcon} />
            <Text style={styles.subsectionTitle}>Report a Problem</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#64748b" />
        </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Tourisla v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2023 Tourisla. All rights reserved.</Text>
        </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8f8b87',
    marginLeft: 16,
    marginBottom: 2,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
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
    marginHorizontal: 16,
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
  },
  subsectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#334155',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  subsectionContent: {
    paddingHorizontal: 16,
    paddingLeft: 24,
    paddingVertical: 12,
    marginBottom: 16,
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
    marginVertical: 8,
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
    backgroundColor: '#c7fbe2',
    flexDirection: 'row',
    paddingVertical: 14,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },
});



