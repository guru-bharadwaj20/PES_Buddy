"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { profileUpdateSchema, passwordResetSchema } from "@/lib/validations/auth";
import { getInitials } from "@/lib/utils";
import type { z } from "zod";

type ProfileForm = z.infer<typeof profileUpdateSchema>;
type PasswordForm = z.infer<typeof passwordResetSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">("profile");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePassword,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordResetSchema) });

  const onProfileSubmit = async (data: ProfileForm) => {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Failed to update profile"); return; }
    await update({ name: data.name, email: data.email });
    toast.success("Profile updated!");
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.message ?? "Failed to update password"); return; }
    toast.success("Password updated successfully!");
    resetPwd();
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone.")) return;
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/auth/account", { method: "DELETE" });
      if (!res.ok) { toast.error("Failed to delete account"); return; }
      toast.success("Account deleted. Redirecting...");
      setTimeout(() => { window.location.href = "/"; }, 2000);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingAccount(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: "👤" },
    { id: "password", label: "Change Password", icon: "🔒" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Avatar header */}
      <div className="glass rounded-2xl p-8 mb-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-white">
            {getInitials(session?.user?.name ?? "U")}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
        <p className="text-gray-400">{session?.user?.email}</p>
        {(session?.user as { srn?: string })?.srn && (
          <p className="text-blue-400 font-mono mt-1">
            {(session?.user as { srn?: string }).srn}
          </p>
        )}
        <span className="mt-2 inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
          {(session?.user as { role?: string })?.role ?? "CUSTOMER"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Info */}
        {activeTab === "profile" && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Update Profile</h2>
            <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name</label>
                <input {...regProfile("name")} className="input-base" placeholder="Your name" />
                {profileErrors.name && <p className="text-red-400 text-xs mt-1">{profileErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
                <input {...regProfile("email")} type="email" className="input-base" placeholder="your@email.com" />
                {profileErrors.email && <p className="text-red-400 text-xs mt-1">{profileErrors.email.message}</p>}
              </div>
              <button
                type="submit"
                disabled={profileSubmitting}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {profileSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Change Password */}
        {activeTab === "password" && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
            <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Current Password</label>
                <input {...regPwd("currentPassword")} type="password" className="input-base" placeholder="••••••••" />
                {pwdErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{pwdErrors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">New Password</label>
                <input {...regPwd("newPassword")} type="password" className="input-base" placeholder="••••••••" />
                {pwdErrors.newPassword && <p className="text-red-400 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
                <p className="text-gray-500 text-xs mt-1">Min 6 chars, 1 uppercase, 1 lowercase, 1 number</p>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Confirm New Password</label>
                <input {...regPwd("confirmPassword")} type="password" className="input-base" placeholder="••••••••" />
                {pwdErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{pwdErrors.confirmPassword.message}</p>}
              </div>
              <button
                type="submit"
                disabled={pwdSubmitting}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {pwdSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {/* Danger Zone */}
        {activeTab === "danger" && (
          <div className="glass rounded-2xl p-6 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-gray-400 text-sm mb-6">
              Once you delete your account, all your data including orders, bookings, and expenses will be permanently deleted. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl border border-red-500/50 transition-all disabled:opacity-50"
            >
              {deletingAccount ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
