"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { isAdmin: false },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        srn: data.srn,
        password: data.password,
        isAdmin: "false",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please check your SRN and password.");
        return;
      }

      toast.success("Welcome back!");
      router.push(callbackUrl);
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
        <div className="glass rounded-2xl p-8 border border-white/10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="text-white">PES </span>
              <span className="gradient-text">Buddy</span>
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-white font-semibold mb-2">
                SRN <span className="text-blue-400 text-sm font-normal">(e.g. PES1UG21CS001)</span>
              </label>
              <input
                {...register("srn")}
                type="text"
                placeholder="PES1UG21CS001"
                className="input-base uppercase"
                autoComplete="username"
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
                placeholder="Enter your password"
                className="input-base"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl
                         transition-all transform hover:scale-[1.02] disabled:opacity-50
                         disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue-400 hover:underline font-semibold">
                Register here
              </Link>
            </p>
            <p className="text-gray-500 text-sm">
              Are you an admin?{" "}
              <Link href="/admin/login" className="text-yellow-400 hover:underline">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
