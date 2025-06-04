import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    StatusBar,
    Modal,
    Alert,
  } from 'react-native';
  import { useEffect, useState } from 'react';
  import Icon from 'react-native-vector-icons/Feather';
  import { useRouter } from 'expo-router';
  import { useUserManager } from '@/hooks/useUserManager';
  
  interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
  }
  
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

  export default function AdminUsersScreen() {
    const router = useRouter();
    const {
      users,
      viewAllUsers,
      archiveUser,
      loading,
      error,
    } = useUserManager();
  
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
    useEffect(() => {
      viewAllUsers();
    }, []);
  
    const confirmDelete = async () => {
      if (!selectedUserId) return;
      try {
        await archiveUser(selectedUserId);
        setModalVisible(false);
      } catch (err) {
        Alert.alert('Error', 'Failed to delete user.');
      }
    };
  
    return (
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}><Text style={styles.headerTitle}>User Management</Text></View>

        <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        >
  
          {loading ? (
            <Text style={styles.message}>Loading...</Text>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <Text style={styles.message}>No users found.</Text>
          ) : (
            users.map((user: User) => (
              <View key={user.user_id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{user.first_name} {user.last_name}</Text>
                  <View style={styles.actions}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => router.push(`/admin/users/admin_user_edit?id=${user.user_id}`)}
                    >
                      <Icon name="edit-3" size={18} color="#fff" />
                    </Pressable>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => {
                        setSelectedUserId(user.user_id);
                        setModalVisible(true);
                      }}
                    >
                      <Icon name="trash-2" size={18} color="#fff" />
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.subInfo}>{user.email} | {user.role} | {user.status}</Text>
              </View>
            ))
          )}
        </ScrollView>
  
        <Pressable
          style={styles.fab}
          onPress={() => router.push('/admin/users/admin_user_create')}
        >
          <Icon name="user-plus" size={24} color="#fff" />
        </Pressable>
  
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Delete</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this user?
              </Text>
              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.confirmButton}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f1f1f1',
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 100,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50 + STATUS_BAR_HEIGHT,
        backgroundColor: "#007dab",
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: STATUS_BAR_HEIGHT,
        paddingHorizontal: 20,
        zIndex: 50,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#ecf0f1",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    scrollView: {
        flex: 1,
        marginTop: 50 + STATUS_BAR_HEIGHT, // Adjust for header height
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 5,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    subInfo: {
      fontSize: 12,
      color: '#555',
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    editButton: {
      backgroundColor: "#007dab",
      padding: 10,
      borderRadius: 6,
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      padding: 10,
      borderRadius: 6,
      alignItems: "center",
    },
    fab: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: '#007dab',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    message: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: '#6b7280',
    },
    error: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: 'red',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalMessage: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: '#6c757d',
      padding: 10,
      borderRadius: 6,
      marginRight: 8,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    confirmButton: {
      flex: 1,
      backgroundColor: '#dc3545',
      padding: 10,
      borderRadius: 6,
      marginLeft: 8,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });