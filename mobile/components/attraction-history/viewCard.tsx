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

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

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
          <Text style={styles.spotName}>{toTitleCase(spotName)}</Text>
          <Text style={styles.boldText}>
            Visit Date: {new Date(log.visit_date).toLocaleDateString()}
          </Text>
          <Text style={styles.subText}>
            Unique Code: <Text style={styles.mono}>{log.unique_code}</Text>
          </Text>
          <Text style={styles.subText}>
            Registration: {new Date(log.registration_date).toLocaleDateString()}
          </Text>
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
        <View style={styles.qrContainer}>
            <Text style={[styles.subText, { alignSelf: 'flex-end', marginBottom: 4 }]}>
            Registration ID: {log.registration_id}
            </Text>
          <Image
            source={{ uri: log.qr_code_url }}
            style={styles.qrImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8fcfd',
    borderRadius: 16,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  spotName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1c5461',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: '600',
    color: '#1c5461',
    fontSize: 12,
    marginTop: 2,
  },
  subText: {
    fontSize: 11,
    color: '#1c5461',
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
    marginTop: 8, 
    marginBottom: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#3e979f',
    borderRadius: 8,
  },
  detailsText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  feedbackButton: {
    flex: 1, 
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#51702c',
    borderRadius: 8,
  },
  feedbackText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
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
    alignSelf: 'flex-end',
    width: '90%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
});