import { useState, useCallback } from "react";

import {
  createUser,
  viewOneUser,
  fetchUsers,
  editUser,
  deleteUser,
  editUserStatus as editUserStatusApi,
} from "@/lib/api/users";

import { signupSchema } from "@/app/static/userManagerSchema";
type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role?: string;
  status?: string;
  // add other fields as needed
};
export function useUserManager() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch all users and update users state
  const viewAllUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchUsers();
      setUsers(response);
      return response;
    } catch (error) {
      setError("An error occurred while viewing all users. " + error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register a new user and update users state
  const registerUser = async (data: signupSchema, captchaToken?: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await createUser({ ...data, captchaToken });
      await viewAllUsers();

      return response;
    } catch (error) {
      setError("An error occurred while creating the user. " + error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user and refresh users state
  const updateUser = async (data: signupSchema) => {
    setLoading(true);
    setError("");
    try {
      const response = await editUser(data);
      await viewAllUsers();
      return response;
    } catch (error) {
      setError("An error occurred while updating the user. " + error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Archive (delete) user and refresh users state
  const archiveUser = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await deleteUser(id);
      await viewAllUsers();
      return response;
    } catch (error) {
      setError("An error occurred while deleting the user. " + error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // View a single user and update selectedUser state
  const viewUser = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await viewOneUser(id);
      setSelectedUser(response);
      return response;
    } catch (error) {
      setError("An error occurred while viewing the user. " + error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const editUserStatus = async (userId: string, status: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await editUserStatusApi(userId, status);
      // Update the users state after changing status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === userId ? { ...user, status } : user
        )
      );
      return response;
    } catch (error) {
      setError("An error occurred while updating user status. " + error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    updateUser,
    archiveUser,
    viewUser,
    viewAllUsers,
    users,
    selectedUser,
    error,
    loading,
    editUserStatus,
  };
}
