import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for AsyncStorage
const STORAGE_KEYS = {
  USER_DATA: "userData",
  ROLE: "role",
  AUTH_TOKEN: "authToken",
  LAST_SYNC: "lastSync",
} as const;

// Default user structure
export interface UserData {
  user_id?: string | number;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  nationality?: string;
  avatar?: string;
  profile_image?: string;
  [key: string]: any;
}

/**
 * Safely parse JSON from AsyncStorage with fallback
 */
const safeJSONParse = <T>(value: string | null, defaultValue: T): T => {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse JSON from AsyncStorage:", error);
    return defaultValue;
  }
};

/**
 * Get user data from AsyncStorage with validation
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const userData = safeJSONParse<UserData | null>(stored, null);

    // Validate required fields
    if (!userData || !userData.role) {
      console.warn("Invalid user data in storage");
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error reading user data from storage:", error);
    return null;
  }
};

/**
 * Save user data to AsyncStorage with validation
 */
export const setUserData = async (
  userData: Partial<UserData>,
): Promise<boolean> => {
  try {
    // Validate required fields
    if (!userData.role || !userData.email) {
      console.error("Cannot save user data without role and email");
      return false;
    }

    // Get existing data to merge
    const existing = await getUserData();
    const merged: UserData = {
      ...existing,
      ...userData,
      // Ensure required fields have defaults
      first_name: userData.first_name || existing?.first_name || "",
      last_name: userData.last_name || existing?.last_name || "",
      email: userData.email || existing?.email || "",
      role: userData.role || existing?.role || "",
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(merged));
    await AsyncStorage.setItem(STORAGE_KEYS.ROLE, merged.role);

    // Update last sync timestamp
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

    return true;
  } catch (error) {
    console.error("Error saving user data to storage:", error);
    return false;
  }
};

/**
 * Update specific user fields without overwriting everything
 */
export const updateUserFields = async (
  fields: Partial<UserData>,
): Promise<boolean> => {
  try {
    const existing = await getUserData();
    if (!existing) {
      console.error("No existing user data to update");
      return false;
    }

    const updated = { ...existing, ...fields };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

    return true;
  } catch (error) {
    console.error("Error updating user fields:", error);
    return false;
  }
};

/**
 * Get user role from storage
 */
export const getUserRole = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

/**
 * Clear all user data (logout)
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.ROLE,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.LAST_SYNC,
    ]);
  } catch (error) {
    console.error("Error clearing user data:", error);
    // Fallback to clear all if multiRemove fails
    await AsyncStorage.clear();
  }
};

/**
 * Check if user data is stale (older than 1 hour)
 */
export const isUserDataStale = async (): Promise<boolean> => {
  try {
    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (!lastSync) return true;

    const lastSyncTime = parseInt(lastSync, 10);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    return lastSyncTime < oneHourAgo;
  } catch (error) {
    console.error("Error checking if user data is stale:", error);
    return true;
  }
};

/**
 * Validate userData structure
 */
export const validateUserData = (userData: any): userData is UserData => {
  return (
    userData &&
    typeof userData === "object" &&
    typeof userData.role === "string" &&
    typeof userData.email === "string"
  );
};
