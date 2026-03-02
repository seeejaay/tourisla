import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchSpotFeedbackQuestions, submitSpotFeedback } from "@/lib/api/feedback";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  spotName: string;
  spotId: number;
  onSubmitted: () => void;
  feedbackGiven?: boolean;
}

const likertIcons = ['😡', '😕', '😐', '🙂', '😍'];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  spotName,
  spotId,
  onSubmitted,
  feedbackGiven = false,
}) => {
  const [questions, setQuestions] = useState<{ id: number; question_text: string }[]>([]);
  const [answers, setAnswers] = useState<{ [id: number]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSpotFeedbackQuestions().then(setQuestions);
      setAnswers({});
    }
  }, [open]);

  const handleSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitSpotFeedback({
        spotId,
        answers: questions.map((q) => ({
          question_id: q.id,
          score: answers[q.id],
        })),
      });
      onSubmitted();
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to submit feedback.');
    }
    setLoading(false);
  };

  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          {feedbackGiven ? (
            <View style={styles.centeredText}>
              <Text style={styles.title}>Feedback Already Submitted</Text>
              <Text style={styles.success}>Thank you for your feedback!</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.title}>Leave Feedback for {spotName}</Text>
              {questions.map((q) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.questionText}>{q.question_text}</Text>
                  <View style={styles.likertRow}>
                    {likertIcons.map((icon, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.iconButton,
                          answers[q.id] === idx + 1 && styles.selectedIcon,
                        ]}
                        onPress={() => handleSelect(q.id, idx + 1)}
                      >
                        <Text style={styles.icon}>{icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.submitButton, (loading || questions.some((q) => !answers[q.id])) && styles.disabled]}
                disabled={
                  loading ||
                  questions.length === 0 ||
                  questions.some((q) => !answers[q.id])
                }
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Submit Feedback</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#ef4444',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  questionBlock: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#334155',
  },
  likertRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  selectedIcon: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  icon: {
    fontSize: 24,
  },
  submitButton: {
    backgroundColor: '#075778',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    backgroundColor: '#94a3b8',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centeredText: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  success: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
});
