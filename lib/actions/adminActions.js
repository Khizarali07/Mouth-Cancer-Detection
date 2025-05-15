"use server";

import { createAdminClient } from "../appwrite/index";
import { appwriteConfig } from "../appwrite/config";
import { Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";

export const getAdminStats = async () => {
  try {
    const { databases } = await createAdminClient();

    // Get total users
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId
    );

    // Get total files
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId
    );

    // Calculate total storage used
    const totalStorageUsed = files.documents.reduce((acc, file) => {
      return acc + (file.size || 0);
    }, 0);

    // Get recent users (last 5)
    const recentUsers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    // Get recent files (last 5)
    const recentFiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    return parseStringify({
      totalUsers: users.total,
      totalFiles: files.total,
      totalStorageUsed,
      recentUsers: recentUsers.documents,
      recentFiles: recentFiles.documents,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const { databases } = await createAdminClient();

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return parseStringify(users.documents);
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { databases } = await createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
};
