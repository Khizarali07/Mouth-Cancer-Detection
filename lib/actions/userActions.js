"use server";

import { revalidatePath } from "next/cache";

// Import necessary modules and configurations

const { createAdminClient, createSessionClient } = require("../appwrite/index");
const { appwriteConfig } = require("../appwrite/config");
const { Query, ID } = require("node-appwrite");
const { parseStringify } = require("@/lib/utils");
const { cookies } = require("next/headers");
const { avatarPlaceholderUrl } = require("@/constants");

const getUserByEmail = async (email) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

/**
 * Logs an error with a custom message and re-throws it for higher-level handling.
 * @param {any} error - The error object or message.
 * @param {string} message - Custom context message for the error.
 */
const handleError = (error, message) => {
  console.error(error, message); // Log the error and message for debugging
  throw error; // Re-throw the error for propagation
};

/**
 * Sends an OTP to the specified email using Appwrite's email token feature.
 * @param {Object} input - Input object containing the email.
 * @param {string} input.email - Email address to send the OTP to.
 * @returns {string|null} The user ID of the created token, or null on failure.
 */
export const sendEmailOTP = async (input) => {
  const { email } = input; // Extract email from input object
  const { account } = await createAdminClient(); // Create an Appwrite admin client to manage accounts

  try {
    // Generate a unique email token for the user
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId; // Return the user ID associated with the email token
  } catch (error) {
    handleError(error, "Failed to send email OTP");
    return null; // Return null if there was an error
  }
};

/**
 * Creates a new user account if it does not already exist and sends an OTP.
 * @param {Object} input - Input object containing user details.
 * @param {string} input.fullName - The full name of the user.
 * @param {string} input.email - The email address of the user.
 * @returns {string} The account ID as a JSON-safe string.
 */
export const createAccount = async (input) => {
  const { fullName, email } = input; // Extract fullName and email from input object

  // Check if the user already exists in the database
  const existingUser = await getUserByEmail(email);

  // Send an OTP to the user's email and get their account ID
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP"); // Handle OTP failure

  // If the user does not exist, add their details to the database
  if (!existingUser) {
    const { databases } = await createAdminClient(); // Create a database client using admin privileges

    // Create a document in the users collection
    await databases.createDocument(
      appwriteConfig.databaseId, // The database ID from the configuration
      appwriteConfig.usersCollectionId, // The users collection ID
      ID.unique(), // Generate a unique document ID
      {
        fullName, // Store the user's full name
        email, // Store the user's email
        avatar: avatarPlaceholderUrl, // Assign a default avatar URL
        accountId, // Store the generated account ID
      }
    );
  }

  // Return the account ID as a JSON-safe string
  return parseStringify({ accountId });
};

export const updateAccount = async (input) => {
  const { fullName, currentEmail, newEmail, avatar } = input; // Extract necessary fields from input

  // Check if the user exists based on the previous email
  const existingUser = await getUserByEmail(currentEmail);

  if (!existingUser) {
    return parseStringify({
      success: true,
      message: "User not found. Cannot update non-existent account.",
    });
  }
  let accountId;

  if (newEmail) {
    accountId = await sendEmailOTP({ email: newEmail });
  }

  try {
    const { databases } = await createAdminClient(); // Create a database client using admin privileges

    // Update the user's document in the database
    await databases.updateDocument(
      appwriteConfig.databaseId, // The database ID
      appwriteConfig.usersCollectionId, // The users collection ID
      existingUser.$id, // The document ID of the existing user
      {
        fullName: fullName || existingUser.fullName, // Update fullName if provided, otherwise keep existing
        email: newEmail || existingUser.email, // Update email if provided, otherwise keep existing
        avatar: avatar || existingUser.avatar, // Update the avatar with the new URL or keep existing
        accountId: accountId || existingUser.accountId, // Update the account
      }
    );

    console.log("Account updated successfully");

    revalidatePath("/dashboard/settings");

    return parseStringify({
      success: true,
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error(error);
    return parseStringify({
      success: false,
      message: "Failed to update account. Please try again.",
    });
  }
};

/**
 * Verifies an OTP sent to a user's email and creates a session.
 * @param {Object} input - Input object containing verification details.
 * @param {string} input.accountId - The account ID of the user.
 * @param {string} input.password - The OTP sent to the user's email.
 * @returns {string|null} The session ID as a JSON-safe string or null on failure.
 */
export const verifySecret = async (input) => {
  const { accountId, password } = input; // Extract accountId and password from input

  try {
    const { account } = await createAdminClient(); // Create an Appwrite admin account client

    // Create a session for the user using the account ID and OTP
    const session = await account.createSession(accountId, password);

    // Set the session in a secure cookie for the user
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/", // Cookie is accessible across the site
      httpOnly: true, // Prevents client-side access for security
      sameSite: "strict", // Protects against CSRF
      secure: true, // Ensures the cookie is sent only over HTTPS
    });

    // Return the session ID as a JSON-safe string
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
    return null; // Return null on failure
  }
};

/**
 * Signs in a user by sending an OTP if they exist in the database.
 * @param {Object} input - Input object containing the email address.
 * @param {string} input.email - The email of the user attempting to sign in.
 * @returns {string} The account ID as a JSON-safe string or an error message.
 */
export const signInUser = async (input) => {
  const { email } = input; // Extract email from input

  try {
    // Check if the user exists in the database
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // User exists, send OTP
      await sendEmailOTP({ email });
      console.log("existingUser", existingUser);
      return parseStringify({ accountId: existingUser.accountId }); // Return the account ID
    }

    // Return an error message if the user does not exist
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
    return null; // Return null on failure
  }
};

export const getCurrentUser = async () => {
  try {
    const client = await createSessionClient();

    // If no session client is available, return null
    if (!client) return null;

    const { databases, account } = client;
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/login");
  }
};
