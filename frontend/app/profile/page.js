"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Save,
  AlertCircle,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    classLevel: "12",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchProfile();
  }, [mounted]);

  const fetchProfile = async () => {
    try {
      // Check for JWT token in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login if no token found
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:4000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          username: data.username || "",
          classLevel: data.classLevel || "12",
        });
      } else if (response.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem("token");
        router.push("/login");
        return;
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:4000/api/auth/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classLevel: profile.classLevel,
        }),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const classLevelOptions = [
    { value: "10", label: "Class 10" },
    { value: "12", label: "Class 12" },
    { value: "UG", label: "Undergraduate (UG)" },
    { value: "PG", label: "Postgraduate (PG)" },
  ];

  // Prevent hydration mismatch
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading your profile...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            👤 Profile Settings
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your details and academic stage to get personalized
            recommendations.
          </p>
        </motion.div>

        {/* Alert Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-4 mb-6 flex items-center max-w-2xl mx-auto"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 text-green-800 border border-green-300 rounded-lg p-4 mb-6 flex items-center max-w-2xl mx-auto"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
              <p className="text-gray-600">Update your academic information</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Username cannot be changed
              </p>
            </div>

            {/* Class Level Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Current Academic Stage
              </label>
              <select
                value={profile.classLevel}
                onChange={(e) =>
                  setProfile({ ...profile, classLevel: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-800"
              >
                {classLevelOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-gray-800"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-500 mt-1">
                This affects your personalized course and college
                recommendations
              </p>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 max-w-2xl mx-auto mt-6"
        >
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">
            Why update your academic stage?
          </h3>
          <ul className="text-indigo-700 space-y-1 text-sm">
            <li>
              • Get recommendations tailored to your current education level
            </li>
            <li>• See relevant courses, colleges, and career paths</li>
            <li>• Access stage-specific events and deadlines</li>
            <li>• Receive personalized guidance for your next academic step</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
