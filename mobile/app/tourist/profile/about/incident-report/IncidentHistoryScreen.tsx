import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { IncidentReport } from "@/hooks/useIncidentManager";
import { CheckCircle, Clock, Archive, ImageIcon, FileQuestion } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const reportsPerPage = 6;

export default function IncidentHistoryScreen() {
  const { getMyReports, reports } = useIncidentManager();
  const { loggedInUser } = useAuth();
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "RECEIVED", label: "Received" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const toTitleCase = (str: string) =>
    str[0].toUpperCase() + str.slice(1).toLowerCase();

  const toSentenceCase = (str: string) =>
    str
      .split(/([.!?]\s*)/g)
      .map((part) =>
        part.length > 0
          ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          : ""
      )
      .join("")
      .trim();

      useEffect(() => {
        async function fetchReports() {
          const user = await loggedInUser(router, false);
          if (!user) {
            router.push("/auth/login");
            return;
          }
      
          const userId = user.data.user.id;
          console.log("Fetching reports for user ID:", userId);
          await getMyReports(userId); // just trigger, don’t expect return
        }
      
        fetchReports();
      }, []);
    
      useEffect(() => {
        setIncidentReports(reports);
      }, [reports]);

  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  const filteredReports =
    activeTab === "ALL"
      ? incidentReports
      : incidentReports.filter((r) => r.status === activeTab);

  const searchedReports = filteredReports.filter(
    (r) =>
      r.incident_type.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(searchedReports.length / reportsPerPage));
  const paginatedReports = searchedReports.slice(
    (page - 1) * reportsPerPage,
    page * reportsPerPage
  );

  const renderReportCard = ({ item }: { item: IncidentReport }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedReport(item);
        setDialogOpen(true);
      }}
      className="bg-white rounded-xl p-4 mb-4 relative"
    >
<View className="w-full h-40 bg-gray-100 rounded mb-2 overflow-hidden relative">
  {/* Status badge INSIDE the image container */}
  <View
    className={`absolute top-2 right-2 px-3 py-1 rounded-full z-10 ${
      item.status === "RECEIVED"
        ? "bg-blue-100"
        : item.status === "RESOLVED"
        ? "bg-green-100"
        : item.status === "ARCHIVED"
        ? "bg-gray-300"
        : "bg-gray-100"
    }`}
  >
    <Text
      className={`text-xs font-bold ${
        item.status === "RECEIVED"
          ? "text-blue-800"
          : item.status === "RESOLVED"
          ? "text-green-800"
          : item.status === "ARCHIVED"
          ? "text-gray-700"
          : "text-gray-800"
      }`}
    >
      {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
    </Text>
  </View>

  {item.photo_url ? (
    <Image
      source={{ uri: item.photo_url }}
      style={{ width: "100%", height: "100%", resizeMode: "cover" }}
    />
  ) : (
    <View className="flex-1 items-center justify-center">
      <ImageIcon size={40} color="gray" />
    </View>
  )}
</View>

      <View>
        <Text className="text-lg font-semibold text-[#1c5461] mb-1">
          {toSentenceCase(item.incident_type)}
        </Text>
        <Text className="text-sm text-gray-600">
          {new Date(item.incident_date).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at{" "}
          {new Date(`1970-01-01T${item.incident_time}`).toLocaleTimeString(
            "en-PH",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )}
        </Text>
        <Text className="text-sm text-gray-600">{toTitleCase(item.location)}</Text>
        <Text numberOfLines={2} className="text-sm text-gray-700 mt-1">
          {toSentenceCase(item.description)}
        </Text>
        {item.note?.trim().length > 0 && (
          <Text numberOfLines={1} className="p-4 text-sm text-gray-500 italic mt-1 bg-yellow-100 rounded-lg">
            Note: {toSentenceCase(item.note)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#f8fafc] pt-2">
      <Text className="text-xl font-black text-[#1c5461]">My Incident Reports</Text>
      <Text className="text-gray-600 mb-4">
        Here you can view all your incident reports.
      </Text>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {statusOptions.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg mr-2 border ${
              activeTab === tab.value
                ? "bg-[#1c5461] border-[#1c5461]"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text- font-bold ${
                activeTab === tab.value ? "text-white" : "text-gray-700"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search */}
      <View className="flex-row items-center border border-gray-300 rounded-lg px-3 mb-4">
        <Ionicons name="search" size={18} color="gray" />
        <TextInput
          className="flex-1 ml-2 py-2"
          placeholder="Search reports..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Reports */}
      {paginatedReports.length === 0 ? (
        <View className="flex items-center justify-center py-12">
          <FileQuestion size={48} color="gray" />
          <Text className="text-gray-500 mt-2 text-center">
            No incident reports found for this status.
          </Text>
          <TouchableOpacity
            className="mt-3 px-4 py-2 border border-gray-300 rounded-lg"
            onPress={() => {
              setSearch("");
              setActiveTab("ALL");
            }}
          >
            <Text>Show All Reports</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={paginatedReports}
          renderItem={renderReportCard}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <View className="flex-row justify-center items-center my-4 gap-3">
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage((p) => p - 1)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <Text>Previous</Text>
          </TouchableOpacity>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <TouchableOpacity
            disabled={page === totalPages}
            onPress={() => setPage((p) => p + 1)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal visible={dialogOpen} animationType="slide" onRequestClose={() => setDialogOpen(false)}>
        <ScrollView className="p-4 bg-white flex-1">
        <TouchableOpacity onPress={() => setDialogOpen(false)} className="mb-4 flex-row place-items-start">
          <Ionicons name="chevron-back" size={30} color="#1c5461" />
        </TouchableOpacity>
          {selectedReport && (
            <>
              <Text className="text-xl font-bold mb-2">
                {toSentenceCase(selectedReport.incident_type)}
              </Text>
              {selectedReport.photo_url ? (
                <Image
                  source={{ uri: selectedReport.photo_url }}
                  style={{ width: "100%", height: 200, resizeMode: "cover", borderRadius: 8 }}
                />
              ) : (
                <View className="w-full h-48 bg-gray-100 items-center justify-center mb-2">
                  <ImageIcon size={48} color="gray" />
                </View>
              )}
              <Text className="mt-2">
                <Text className="font-medium">Date:</Text>{" "}
                {new Date(selectedReport.incident_date).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(`1970-01-01T${selectedReport.incident_time}`).toLocaleTimeString(
                  "en-PH",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </Text>
              <Text className="mt-1">
                <Text className="font-medium">Location:</Text>{" "}
                {toTitleCase(selectedReport.location)}
              </Text>
              <Text className="mt-2 text-justify">
                <Text className="font-medium">Description:</Text>{" "}
                {toSentenceCase(selectedReport.description)}
              </Text>
              <Text className="mt-1">
                <Text className="font-medium">Note:</Text>{" "}
                {selectedReport.note?.trim() ? toSentenceCase(selectedReport.note) : "—"}
              </Text>
              <Text className="mt-4 text-xs text-gray-500">
                <Text className="font-medium">Submitted By:</Text> {selectedReport.role} (ID:{" "}
                {selectedReport.submitted_by})
              </Text>
              <Text className="text-xs text-gray-500">
                <Text className="font-medium">Submitted At:</Text>{" "}
                {selectedReport.submitted_at
                  ? new Date(selectedReport.submitted_at).toLocaleString()
                  : "—"}
              </Text>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}
