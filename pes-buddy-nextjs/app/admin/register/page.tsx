"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "ADMIN" }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message ?? "Registration failed");
        return;
      }

      toast.success("Admin account created! Please sign in.");
      router.push("/admin/login");
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
        <div className="glass rounded-2xl p-8 border border-yellow-500/30">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏢</div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Register Admin</h1>
            <p className="text-gray-400">Create a new admin account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-white font-semibold mb-2">Full Name</label>
              <input {...register("name")} type="text" placeholder="Admin Name" className="input-base" />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">SRN</label>
              <input {...register("srn")} type="text" placeholder="PES1UG21CS001" className="input-base uppercase" />
              {errors.srn && <p className="text-red-400 text-sm mt-1">{errors.srn.message}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Email <span className="text-gray-500 text-sm font-normal">(optional)</span></label>
              <input {...register("email")} type="email" placeholder="admin@pes.edu" className="input-base" />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input {...register("password")} type="password" placeholder="Strong password" className="input-base" />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl
                         transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? "Creating..." : "Create Admin Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an admin account?{" "}
              <Link href="/admin/login" className="text-yellow-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
