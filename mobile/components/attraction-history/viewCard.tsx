import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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

        <Image
          source={{ uri: log.qr_code_url }}
          style={styles.qrImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  boldText: {
    fontWeight: '600',
    color: '#1f2937',
  },
  subText: {
    fontSize: 13,
    color: '#475569',
  },
  mono: {
    fontFamily: 'monospace',
    color: '#1e293b',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
    flexWrap: 'nowrap',
    alignItems: 'center', 
    width: '100%',
  },
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  detailsText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  feedbackButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  feedbackText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  qrImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 4,
  },
});
