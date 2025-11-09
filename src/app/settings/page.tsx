"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";

interface ProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
}

const SettingsPage: React.FC = () => {
  // Profile states
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    dateOfBirth: ""
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfileData, setTempProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    dateOfBirth: ""
  });

  // Password states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Load profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setTempProfileData(parsed);
    }
  }, []);

  // Save profile data
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempProfileData.name || !tempProfileData.email) {
      alert("Name and Email are required!");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempProfileData.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    setProfileData(tempProfileData);
    localStorage.setItem('userProfile', JSON.stringify(tempProfileData));
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(false);
  };

  // Handle password update (UI only - no actual functionality)
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill all password fields!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    // Reset form and show success (no actual password change)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordForm(false);
    alert("Password updated successfully! (UI only - no actual change)");
  };

  return (
    <Layout>
      <Header title="Settings" />
      
      <div className="space-y-6">
        {/* Profile Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!isEditingProfile ? (
            // Display mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900 text-lg">
                  {profileData.name || "Not set"}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900 text-lg">
                  {profileData.email || "Not set"}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <p className="text-gray-900 text-lg">
                  {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "Not set"}
                </p>
              </div>
            </div>
          ) : (
            // Edit mode
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempProfileData.name}
                  onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={tempProfileData.email}
                  onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={tempProfileData.dateOfBirth}
                  onChange={(e) => setTempProfileData({ ...tempProfileData, dateOfBirth: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password Update Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Change Password</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update Password
              </button>
            )}
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                  minLength={8}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Note: This is a UI-only feature. No actual password change will occur.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">Click &quot;Update Password&quot; to change your password</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
