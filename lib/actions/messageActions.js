"use server";

import { createAdminClient, createSessionClient } from "../appwrite/index";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * Creates a new message from a user
 * @param {Object} messageData - The message data
 * @param {string} messageData.userId - User ID who sent the message
 * @param {string} messageData.name - User's full name
 * @param {string} messageData.email - User's email
 * @param {string} messageData.phone - User's phone number
 * @param {string} messageData.message - The message content
 * @returns {Object} The created message document
 */
export const createMessage = async (messageData) => {
  try {
    if (!appwriteConfig.messagesCollectionId) {
      throw new Error(
        "Messages collection not configured. Please add NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION to your environment variables."
      );
    }

    const { databases } = await createAdminClient();

    const message = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        userId: messageData.userId,
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        message: messageData.message,
        status: "pending", // Default status
      }
    );

    return parseStringify(message);
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error("Failed to create message");
  }
};

/**
 * Gets all messages for admin view
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of messages to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.status - Filter by status (optional)
 * @returns {Object} Messages and total count
 */
export const getAllMessages = async (options = {}) => {
  try {
    if (!appwriteConfig.messagesCollectionId) {
      console.warn("Messages collection not configured");
      return { documents: [], total: 0 };
    }

    const { databases } = await createAdminClient();
    const { limit = 50, offset = 0, status } = options;

    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    if (status && status !== "all") {
      queries.push(Query.equal("status", status));
    }

    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      queries
    );

    return parseStringify({
      documents: messages.documents,
      total: messages.total,
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    return { documents: [], total: 0 };
  }
};

/**
 * Gets messages for a specific user
 * @param {string} userId - The user ID
 * @returns {Array} User's messages
 */
export const getUserMessages = async (userId) => {
  try {
    const { databases } = await createAdminClient();

    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    return parseStringify(messages.documents);
  } catch (error) {
    console.error("Error getting user messages:", error);
    throw new Error("Failed to get user messages");
  }
};

/**
 * Updates a message status
 * @param {string} messageId - The message ID
 * @param {string} status - New status (pending, completed, in-progress)
 * @returns {Object} Updated message document
 */
export const updateMessageStatus = async (messageId, status) => {
  try {
    const { databases } = await createAdminClient();

    const updatedMessage = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId,
      {
        status: status,
      }
    );

    revalidatePath("/admin");
    revalidatePath("/admin/messages");

    return parseStringify(updatedMessage);
  } catch (error) {
    console.error("Error updating message status:", error);
    throw new Error("Failed to update message status");
  }
};

/**
 * Deletes a message
 * @param {string} messageId - The message ID
 * @returns {boolean} Success status
 */
export const deleteMessage = async (messageId) => {
  try {
    const { databases } = await createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    revalidatePath("/admin");
    revalidatePath("/admin/messages");

    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message");
  }
};

/**
 * Gets message statistics for admin dashboard
 * @returns {Object} Message statistics
 */
export const getMessageStats = async () => {
  try {
    if (!appwriteConfig.messagesCollectionId) {
      return {
        total: 0,
        pending: 0,
        completed: 0,
        inProgress: 0,
      };
    }

    const { databases } = await createAdminClient();

    // Get total messages
    const totalMessages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.limit(1)]
    );

    // Get pending messages
    const pendingMessages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("status", "pending"), Query.limit(1)]
    );

    // Get completed messages
    const completedMessages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("status", "completed"), Query.limit(1)]
    );

    // Get in-progress messages
    const inProgressMessages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("status", "in-progress"), Query.limit(1)]
    );

    return parseStringify({
      total: totalMessages.total,
      pending: pendingMessages.total,
      completed: completedMessages.total,
      inProgress: inProgressMessages.total,
    });
  } catch (error) {
    console.error("Error getting message stats:", error);
    return {
      total: 0,
      pending: 0,
      completed: 0,
      inProgress: 0,
    };
  }
};
