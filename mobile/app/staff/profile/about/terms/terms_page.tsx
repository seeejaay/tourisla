import { ScrollView, Text, View, StyleSheet, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⬅️ Make sure sections is defined above the component
const sections = [
  {
    title: "Definitions",
    points: [
      '"TourISLA" refers to our platform, website, and associated services.',
      '"User" refers to anyone who accesses or uses TourISLA.',
      '"Content" includes all information, images, reviews, and data available on TourISLA.',
    ],
  },
  {
    title: "Use of Our Services",
    points: [
      "You must be at least 18 years old or have parental consent to use TourISLA.",
      "You agree to use our services only for lawful purposes and in compliance with all applicable laws and regulations.",
      "You may not engage in activities that could harm the platform, interfere with other users, or violate intellectual property rights.",
      "We reserve the right to terminate or restrict access to any user violating these terms.",
    ],
  },
  {
    title: "Account Registration",
    points: [
      "You may need to create an account to access certain features.",
      "You are responsible for maintaining the confidentiality of your account details, including your password.",
      "You agree to provide accurate, current, and complete information during registration.",
      "If we detect suspicious activity, we may suspend or terminate your account.",
    ],
  },
  {
    title: "Content and Intellectual Property",
    points: [
      "TourISLA owns all intellectual property rights to the platform and content unless otherwise specified.",
      "Users may not copy, distribute, modify, or use content without prior written permission.",
      "By posting content on TourISLA, you grant us a worldwide, non-exclusive, royalty-free license to use, modify, and display the content.",
      "You are responsible for ensuring that the content you post does not infringe third party rights.",
    ],
  },
  {
    title: "Third-Party Services",
    points: [
      "TourISLA integrates third-party APIs, including Google reCAPTCHA, FreeWeatherAPI, and TripAdvisor.",
      "We do not control or assume responsibility for third-party services, their terms, or policies.",
      "Your interactions with third-party services are governed by their respective terms and privacy policies.",
    ],
  },
  {
    title: "Limitation of Liability",
    points: [
      'TourISLA is provided "as is" without warranties of any kind, including accuracy, reliability, or uninterrupted service.',
      "We are not liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your use of the platform.",
      "We do not guarantee the accuracy of third-party information displayed on our platform.",
    ],
  },
  {
    title: "Privacy and Data Protection",
    points: [
      "Your use of TourISLA is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data.",
    ],
  },
  {
    title: "Modifications to Terms",
    points: [
      "We may update these Terms and Conditions at any time. Significant changes will be communicated via email or platform notifications.",
      "Continued use of the platform after changes signifies acceptance of the updated terms.",
    ],
  },
];

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Terms and Conditions</Text>

        <Text style={styles.paragraph}>
          Welcome to TourISLA! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. If you do not agree with these terms, please do not use our services.
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {index + 1}. {section.title}
            </Text>
            {section.points.map((point, i) => (
              <Text key={i} style={styles.listItem}>
                • {point}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          For any questions, contact us at{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:tour.isla2025@gmail.com")}
          >
            tour.isla2025@gmail.com
          </Text>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fcfd",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fcfd",
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1c5461",
    textAlign: "center",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    color: "#51702c",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1c5461",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 12,
    color: "#51702c",
    marginLeft: 10,
    marginBottom: 4,
    fontWeight: "700",
  },
  footer: {
    fontSize: 15,
    color: "#51702c",
    marginTop: 16,
    textAlign: "center",
  },
  link: {
    color: "#3e979f",
    textDecorationLine: "underline",
  },
});
