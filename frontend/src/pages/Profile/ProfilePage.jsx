import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, User, Mail, Building, Phone, MapPin } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextareaField";

const ProfilePage = () => {
  const { user, loading, updateUser } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    address: "",
    phone: "",
  });

  /* -------------------- Prefill User Data -------------------- */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  /* -------------------- Handle Input Change -------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------------------- Update Profile -------------------- */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      updateUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  /* -------------------- Loading State -------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Stellar Identity
        </h1>
        <p className="text-text-secondary mt-2 font-medium">
          Manage your cosmic credentials and business nexus
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[80px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/5 blur-[80px] -z-10"></div>

        <div className="px-8 py-6 border-b border-white/10 bg-white/2">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
              <User className="w-5 h-5 text-accent-purple" />
            </div>
            Personal Profile
          </h3>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="p-8 space-y-8">
            {/* Email - Read Only Identity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3 ml-1">
                Verified Identity (Email)
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-accent-blue/50" />
                </div>

                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full h-12 pl-12 bg-white/5 border border-white/10 rounded-xl text-text-muted font-medium cursor-not-allowed italic"
                />
              </div>
              <p className="text-[10px] text-text-muted mt-2 ml-1 italic">* Identity cannot be changed once established in the galaxy</p>
            </div>

            {/* Full Name */}
            <InputField
              label="Commander Name (Full Name)"
              name="name"
              icon={User}
              type="text"
              value={formData.name}
              onChange={handleInputChange}
            />

            {/* Business Section */}
            <div className="pt-10 border-t border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                  <Building className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">
                    Business Nexus
                  </h4>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Configure your primary billing origin details
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Fleet/Business Name"
                  name="businessName"
                  icon={Building}
                  type="text"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />

                <TextareaField
                  label="Galactic HQ Address"
                  name="address"
                  icon={MapPin}
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                />

                <InputField
                  label="Comms Frequency (Phone)"
                  name="phone"
                  icon={Phone}
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-8 py-6 bg-white/2 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  Sync Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;