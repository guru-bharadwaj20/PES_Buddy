"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { profileUpdateSchema, passwordResetSchema } from "@/lib/validations/auth";
import { getInitials } from "@/lib/utils";
import type { z } from "zod";

type ProfileForm = z.infer<typeof profileUpdateSchema>;
type PasswordForm = z.infer<typeof passwordResetSchema>;

export default function AdminProfilePage() {
  const { data: session, update } = useSession();
  const [tab, setTab] = useState<"profile" | "password">("profile");

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
    toast.success("Password updated!");
    resetPwd();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin avatar */}
      <div className="glass rounded-2xl p-8 mb-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-white">
            {getInitials(session?.user?.name ?? "A")}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
        <p className="text-gray-400">{session?.user?.email}</p>
        <span className="mt-2 inline-block bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
          ADMIN
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "profile", label: "Profile Info", icon: "👤" },
          { id: "password", label: "Change Password", icon: "🔒" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as "profile" | "password")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {tab === "profile" && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Update Profile</h2>
            <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name</label>
                <input {...regProfile("name")} className="input-base" placeholder="Admin name" />
                {profileErrors.name && <p className="text-red-400 text-xs mt-1">{profileErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
                <input {...regProfile("email")} type="email" className="input-base" placeholder="admin@pesu.edu" />
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

        {tab === "password" && (
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
      </motion.div>
    </div>
  );
}
