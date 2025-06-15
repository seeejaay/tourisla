import { useState, useCallback } from "react";

import {
  createUser,
  viewOneUser,
  fetchUsers,
  editUser,
  deleteUser,
} from "@/lib/api/users";

import { signupSchema } from "@/app/static/userManagerSchema";

export function useUserManager() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

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
  };
}
