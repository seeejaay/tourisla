import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  fetchOperatorFeedbackQuestions,
  submitOperatorFeedback,
  fetchMyOperatorFeedbacks,
} from "@/lib/api/feedback";

const likertIcons = ["😡", "😕", "😐", "🙂", "😍"];

export const OperatorFeedbackModal = ({
  open,
  onClose,
  bookingId,
  operatorName = "Tour Operator",
  operatorId,
  onSubmitted,
}) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (open && operatorId) {
      fetchOperatorFeedbackQuestions().then(setQuestions);
      setAnswers({});
      fetchMyOperatorFeedbacks().then((groups) => {
        const found = groups.some(
          (g) => g.feedback_for_user_id === operatorId
        );
        setFeedbackGiven(found);
      });
    }
  }, [open, operatorId]);

  const handleSelect = (questionId, score) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitOperatorFeedback({
        operatorId,
        answers: questions.map((q) => ({
          question_id: q.id,
          score: answers[q.id],
        })),
      });
      setFeedbackGiven(true);
      if (onSubmitted) onSubmitted(); // already there in your modal
    } catch (e) {
      console.error(e);
      alert("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {feedbackGiven ? (
            <View>
              <Text style={styles.title}>Feedback Already Submitted</Text>
              <Text style={styles.thankYou}>Thank you for your feedback!</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView>
              <Text style={styles.title}>Leave Feedback for {operatorName}</Text>
              {questions.map((q) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.question}>{q.question_text}</Text>
                  <View style={styles.likertRow}>
                    {likertIcons.map((icon, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.iconButton,
                          answers[q.id] === idx + 1 && styles.iconSelected,
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
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading || questions.some((q) => !answers[q.id])}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Submit Feedback</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Cancel</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  questionBlock: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    marginBottom: 6,
  },
  likertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
  },
  iconSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#dbeafe",
  },
  icon: {
    fontSize: 24,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#64748b",
    fontSize: 14,
  },
  thankYou: {
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
