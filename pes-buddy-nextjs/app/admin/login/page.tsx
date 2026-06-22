"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        srn: data.srn,
        password: data.password,
        isAdmin: "true",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Access denied. Check your credentials and admin privileges.");
        return;
      }

      toast.success("Welcome, Admin!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 border border-yellow-500/30">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏢</div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Sign in with admin credentials</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-white font-semibold mb-2">Admin SRN</label>
              <input
                {...register("srn")}
                type="text"
                placeholder="PES1UG21CS001"
                className="input-base uppercase"
              />
              {errors.srn && (
                <p className="text-red-400 text-sm mt-1">{errors.srn.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter admin password"
                className="input-base"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl
                         transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
            >
              {loading ? "Signing in..." : "Admin Sign In →"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Need an admin account?{" "}
              <Link href="/admin/register" className="text-yellow-400 hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-gray-500 text-sm">
              Regular user?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
