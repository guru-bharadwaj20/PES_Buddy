"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "CUSTOMER" }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message ?? "Registration failed");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="text-white">Join </span>
              <span className="gradient-text">PES Buddy</span>
            </h1>
            <p className="text-gray-400">Create your student account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-white font-semibold mb-2">Full Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter your full name"
                className="input-base"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                SRN <span className="text-blue-400 text-sm font-normal">(Student Registration Number)</span>
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
              <label className="block text-white font-semibold mb-2">
                Email <span className="text-gray-500 text-sm font-normal">(optional)</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="input-base"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Min 6 chars, 1 upper, 1 lower, 1 number"
                className="input-base"
                autoComplete="new-password"
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
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
