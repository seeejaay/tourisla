// mobile/tourist/registration/visitor_registration/VisitorRegistrationScreen.tsx
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, StatusBar, Dimensions } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { visitorRegistrationFields } from "@/static/visitor-registration/visitor"; 
import type { Visitor } from "@/static/visitor-registration/visitorSchema";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface TourPackageDetailsScreenProps {
  headerHeight: number;
}

const emptyVisitor = () =>
  Object.fromEntries(
    visitorRegistrationFields.map((f) => [f.name, f.type === "checkbox" ? false : ""])
  ) as Partial<Visitor>;

type FieldValue = string | boolean;

type CreateVisitorResponse = {
  registration: {
    unique_code: string;
  };
};

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width, height } = Dimensions.get('window');

export default function VisitorRegistrationScreen({ headerHeight }: TourPackageDetailsScreenProps) {
  const [mainVisitor, setMainVisitor] = useState<Partial<Visitor>>(emptyVisitor());
  const [companions, setCompanions] = useState<Partial<Visitor>[]>([]);
  const { createVisitor, loading, error } = useVisitorRegistration();
  const router = useRouter();

  const handleInputChange = (index: number | null, field: keyof Visitor, value: FieldValue) => {
    if (index === null) {
      setMainVisitor((prev) => ({ ...prev, [field]: value }));
    } else {
      setCompanions((prev) =>
        prev.map((comp, i) => (i === index ? { ...comp, [field]: value } : comp))
      );
    }
  };

  const addCompanion = () => setCompanions((prev) => [...prev, emptyVisitor()]);
  const removeCompanion = (idx: number) => setCompanions((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    try {
      const group = [mainVisitor, ...companions];
      const response = (await createVisitor(group)) as CreateVisitorResponse;

      if (response.registration.unique_code) {
        router.push(`/tourist/registration/result/visitor_registration_result?code=${encodeURIComponent(response.registration.unique_code)}`);
      }
    } catch (err) {
      console.error("Error creating visitor registration:", err);
    }
  };

  const renderFields = (visitor: Partial<Visitor>, index: number | null) => (
    <>
      {visitorRegistrationFields
        .filter((field) => {
          if ((field.name === "municipality" || field.name === "province") && visitor.is_foreign) {
            return false;
          }
          return true;
        })
        .map((field) => (
          <View key={field.name} style={styles.fieldRow}>
            <Text style={styles.label}>{field.label}</Text>
  
            {field.type === "text" || field.type === "number" ? (
              <TextInput
                keyboardType={field.type === "number" ? "numeric" : "default"}
                placeholder={field.placeholder}
                value={String(visitor[field.name as keyof Visitor] || "")}
                onChangeText={(val) => handleInputChange(index, field.name as keyof Visitor, val)}
                style={styles.input}
              />
            ) : field.type === "select" ? (
              <View style={styles.selectWrapper}>
              <Picker
                selectedValue={String(visitor[field.name as keyof Visitor] || "")}
                onValueChange={(val) => handleInputChange(index, field.name as keyof Visitor, val)}
                style={styles.selectPicker}
              >
                <Picker.Item label="Select..." value="" />
                {field.options?.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
              </View>
            ) : field.type === "checkbox" ? (
              <Switch
                value={!!visitor[field.name as keyof Visitor]}
                onValueChange={(val) => handleInputChange(index, field.name as keyof Visitor, val)}
              />
            ) : null}
          </View>
        ))}
    </>
  );
  

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
    <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
    <View style={styles.navbar}>
    <TouchableOpacity 
      style={styles.navButton}
      onPress={() => router.back()}
    >
      <FontAwesome5 name="arrow-left" size={18} color="#fff" />
    </TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.heading}>Visitor Registration</Text>

      <Text style={styles.sectionTitle}>Main Visitor</Text>
      {renderFields(mainVisitor, null)}

      <Text style={styles.sectionTitle}>Companions</Text>
      {companions.map((comp, idx) => (
        <View key={idx} style={styles.companionCard}>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeCompanion(idx)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
          {renderFields(comp, idx)}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addCompanion}>
        <Text style={styles.addButtonText}>+ Add Companion</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#f8fafc" },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: STATUS_BAR_HEIGHT + 10,
      paddingBottom: 10,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      marginHorizontal: 16,
      marginVertical: 70,
      paddingBottom: 120,
    },
  
    heading: {
      fontSize: 30,
      fontWeight: "900",
      color: "#1c5461",
      marginBottom: 16,
      textAlign: "center",
      marginTop: 24,
    },
  
    sectionTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: "#1c5461",
      marginTop: 24,
      marginBottom: 12,
    },
  
    fieldRow: {
      marginBottom: 12,
    },
  
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: "#1c5461",
      marginBottom: 6,
    },
  
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: "#fff",
      fontSize: 14,
    },
  
    companionCard: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: "#fff",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  
    removeButton: {
      alignSelf: "flex-end",
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 8,
      borderRadius: 6,
      backgroundColor: "#fee2e2",
    },
  
    removeButtonText: {
      color: "#b91c1c",
      fontWeight: "600",
      fontSize: 14,
    },
  
    addButton: {
      paddingVertical: 14,
      borderRadius: 8,
      backgroundColor: "#4db004",
      alignItems: "center",
      marginVertical: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
  
    addButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 16,
    },
  
    error: {
      color: "#dc2626",
      marginVertical: 8,
      textAlign: "center",
      backgroundColor: "#fee2e2",
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
  
    submitButton: {
      paddingVertical: 16,
      borderRadius: 8,
      backgroundColor: "#24b4ab",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
  
    submitButtonText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 18,
    },
    selectWrapper: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      backgroundColor: "#fff",
      height: 42,
      justifyContent: "center",
    },
    selectPicker: {
      height: 60,
      paddingHorizontal: 12,
      color: "#000",
      transform: [{ scale: 0.9 }],
    },
  });
  
