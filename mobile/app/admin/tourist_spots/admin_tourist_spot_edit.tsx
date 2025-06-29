import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useTouristSpotManager } from "../../../hooks/useTouristSpotManager";

export default function AdminTouristSpotEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    viewTouristSpot,
    updateTouristSpot,
    loading,
    error,
  } = useTouristSpotManager();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    barangay: "",
    municipality: "",
    images: [] as string[],
  });

  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch tourist spot data
  useEffect(() => {
    if (id) {
      (async () => {
        setFetching(true);
        try {
          const spot = await viewTouristSpot(id as string);

          const imageUrls = Array.isArray(spot.images)
            ? spot.images.map((img: any) => img.image_url)
            : [];
          
          setForm((prev) => ({
            ...prev,
            ...spot,
            images: imageUrls,
          }));
        } catch (e) {
          Alert.alert("Error", "Failed to fetch tourist spot.");
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [id]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm((prev) => ({ ...prev, images: [...prev.images, result.assets[0].uri] }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
  
      // Append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value ?? "");
        }
      });
  
      // Append images
      form.images.forEach((uri, index) => {
        if (uri.startsWith("file://")) {
          const filename = uri.split("/").pop();
          const ext = filename?.split(".").pop()?.toLowerCase();
          const type = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  
          formData.append("images", {
            uri,
            name: filename ?? `image_${index}.jpg`,
            type,
          } as any); // Cast to avoid TS error
        } else {
          // Optional: Append existing image URLs if your backend can handle it
          formData.append("existingImages[]", uri);
        }
      });
  
      await updateTouristSpot(id as string, formData);
  
      Alert.alert("Success", "Tourist spot updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error("Update error:", e);
      Alert.alert("Error", "Failed to update tourist spot.");
    } finally {
      setSaving(false);
    }
  };
  

  if (fetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.heading}>Edit Tourist Spot</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
      />

      <Text style={styles.label}>Type</Text>
      <TextInput
        style={styles.input}
        value={form.type}
        onChangeText={(text) => setForm((prev) => ({ ...prev, type: text }))}
      />

      <Text style={styles.label}>Barangay</Text>
      <TextInput
        style={styles.input}
        value={form.barangay}
        onChangeText={(text) => setForm((prev) => ({ ...prev, barangay: text }))}
      />

      <Text style={styles.label}>Municipality</Text>
      <TextInput
        style={styles.input}
        value={form.municipality}
        onChangeText={(text) => setForm((prev) => ({ ...prev, municipality: text }))}
      />

      <Text style={styles.label}>Province</Text>
      <TextInput
        style={styles.input}
        value={form.province}
        onChangeText={(text) => setForm((prev) => ({ ...prev, province: text }))}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
      />

      <Text style={styles.label}>Opening Time</Text>
      <TextInput
        style={styles.input}
        value={form.opening_time}
        onChangeText={(text) => setForm((prev) => ({ ...prev, opening_time: text }))}
      />     

      <Text style={styles.label}>Closing Time</Text>
      <TextInput
        style={styles.input}
        value={form.closing_time}
        onChangeText={(text) => setForm((prev) => ({ ...prev, closing_time: text }))}
      />  

      <Text style={styles.label}>Days Open</Text>
      <TextInput
        style={styles.input}
        value={form.days_open}
        onChangeText={(text) => setForm((prev) => ({ ...prev, days_open: text }))}
      />  

      <Text style={styles.label}>Entrance Fee</Text>
      <TextInput
        style={styles.input}
        value={form.entrance_fee}
        onChangeText={(text) => setForm((prev) => ({ ...prev, entrance_fee: text }))}
      /> 

      <Text style={styles.label}>Other Fees</Text>
      <TextInput
        style={styles.input}
        value={form.other_fees}
        onChangeText={(text) => setForm((prev) => ({ ...prev, other_fees: text }))}
      />  

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={form.contact_number}
        onChangeText={(text) => setForm((prev) => ({ ...prev, contact_number: text }))}
      /> 
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
      />  

      <Text style={styles.label}>Facebook Page</Text>
      <TextInput
        style={styles.input}
        value={form.facebook_page}
        onChangeText={(text) => setForm((prev) => ({ ...prev, facebook_page: text }))}
      />       

      <Text style={styles.label}>Rules</Text>
      <TextInput
        style={styles.input}
        value={form.rules}
        onChangeText={(text) => setForm((prev) => ({ ...prev, rules: text }))}
      />   

      <Text style={styles.label}>Attraction Code</Text>
      <TextInput
        style={styles.input}
        value={form.attraction_code}
        onChangeText={(text) => setForm((prev) => ({ ...prev, attraction_code: text }))}
      />     

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={form.category}
        onChangeText={(text) => setForm((prev) => ({ ...prev, category: text }))}
      />                             

      <Text style={styles.label}>Images</Text>
      <ScrollView horizontal style={styles.imageList} showsHorizontalScrollIndicator={false}>
      {form.images?.map((uri, index) => (
        uri ? <Image key={index} source={{ uri }} style={styles.image} /> : null
      ))}
        <TouchableOpacity style={styles.addImageButton} onPress={handlePickImage}>
          <Icon name="image" size={24} color="#0ea5e9" />
          <Text style={styles.addImageText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving || fetching}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#0f172a" },
  label: { fontSize: 14, color: "#475569", marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  imageList: { flexDirection: "row", marginVertical: 8 },
  image: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0ea5e9",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addImageText: { color: "#0ea5e9", fontWeight: "500", marginTop: 4 },
  saveButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: { color: "#64748b", fontSize: 16, fontWeight: "600" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
