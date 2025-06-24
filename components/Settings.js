"use client";

import { useState } from "react";
import { updateAccount } from "@/lib/actions/userActions"; // Ensure this is implemented correctly
import Image from "next/image";

function Settings({ currentUser }) {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [newEmail, setNewEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cloudinary upload preset and URL
  const CLOUDINARY_UPLOAD_PRESET = "reel-maker"; // Replace with your Cloudinary upload preset
  const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/df9psppug/image/upload"; // Replace "your_cloud_name" with your Cloudinary cloud name

  // Handle file input change for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Show a preview of the uploaded file
    }
  };

  // Handle account update
  const handleUpdate = async () => {
    setLoading(true);

    let avatarUrl = null;

    try {
      // Upload avatar to Cloudinary if provided
      if (avatar) {
        const formData = new FormData();
        formData.append("file", avatar);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          avatarUrl = data.secure_url; // Get the secure URL of the uploaded image
        } else {
          throw new Error(data.error.message || "Failed to upload avatar.");
        }
      }

      // Call the backend function to update the account
      const result = await updateAccount({
        fullName,
        currentEmail,
        newEmail,
        avatar: avatarUrl, // Pass the avatar URL if available
      });

      setMessage(result.message || "Account updated successfully!");
    } catch (error) {
      console.error("Error updating account:", error);
      setMessage("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Account Settings</h1>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current Email
          </label>
          <input
            type="email"
            placeholder="Enter current email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Email</label>
          <input
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Avatar</label>
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-brand text-white p-4 rounded-full"
        >
          {loading ? "Updating..." : "Update Account"}
        </button>

        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

export default Settings;
