import type { VisitorLog } from "@/app/tourist/activity/attraction_history/visitHistory";
import React from 'react';
import { Modal, View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  group: VisitorLog[];
  spotName: string;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, group, spotName }) => {
  if (!open || !group || group.length === 0) return null;
  const main = group[0];

  return (
    <Modal open={open} transparent animationType="fade">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>{spotName}</Text>

            <Text style={styles.detail}><Text style={styles.bold}>Visit Date:</Text> {new Date(main.visit_date).toLocaleDateString()}</Text>
            <Text style={styles.detail}><Text style={styles.bold}>Unique Code:</Text> <Text style={styles.mono}>{main.unique_code}</Text></Text>
            <Text style={styles.detail}><Text style={styles.bold}>Registration Date:</Text> {new Date(main.registration_date).toLocaleDateString()}</Text>

            <View style={styles.qrContainer}>
              <Text style={styles.bold}>QR Code:</Text>
              <Image source={{ uri: main.qr_code_url }} style={styles.qrImage} />
            </View>

            <Text style={styles.bold}>Group Members:</Text>
            {group.map((member, idx) => (
              <Text key={idx} style={styles.groupItem}>
                {member.member_name} ({member.member_age}, {member.member_sex}) - {member.municipality}, {member.province}, {member.country} {member.is_foreign ? '(Foreign)' : ''}
              </Text>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingTop: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 12,
    color: '#000',
  },
  detail: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#111827',
  },
  mono: {
    fontFamily: 'monospace',
    color: '#1e293b',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  qrImage: {
    width: 120,
    height: 120,
    marginTop: 8,
  },
  groupItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
});
