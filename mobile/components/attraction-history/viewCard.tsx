import React from 'react';
import { View, Text, Image, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { type VisitorLog } from '@/app/tourist/activity/attraction_history/visitHistory';

interface ViewCardProps {
  log: VisitorLog;
  spotName: string;
  onClick: () => void;
  onFeedback: () => void;
  feedbackGiven?: boolean;
}

export const ViewCard: React.FC<ViewCardProps> = ({
  log,
  spotName,
  onClick,
  onFeedback,
  feedbackGiven = false,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.spotName}>{spotName}</Text>
          <Text style={styles.boldText}>
            Visit Date: {new Date(log.visit_date).toLocaleDateString()}
          </Text>
          <Text style={styles.subText}>
            Unique Code: <Text style={styles.mono}>{log.unique_code}</Text>
          </Text>
          <Text style={styles.subText}>
            Registration: {new Date(log.registration_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.qrContainer}>
          <Image
            source={{ uri: log.qr_code_url }}
            style={styles.qrImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.detailsButton} onPress={onClick}>
              <Text style={styles.detailsText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.feedbackButton,
                feedbackGiven && styles.disabledButton,
              ]}
              onPress={onFeedback}
              disabled={feedbackGiven}
            >
              <Text style={styles.feedbackText}>
                {feedbackGiven ? 'Feedback Submitted' : 'Leave Feedback'}
              </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  spotName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 14,
    marginTop: 2,
  },
  subText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    color: '#1e293b',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  detailsButton: {
    flex: 1, 
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#64c5a5',
    borderRadius: 8,
  },
  detailsText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  feedbackButton: {
    flex: 1, 
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#0086ad',
    borderRadius: 8,
  },
  feedbackText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
});