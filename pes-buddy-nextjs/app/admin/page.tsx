import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AdminLandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-6">🏢</div>
          <h1 className="text-5xl font-bold text-white mb-4">Admin Portal</h1>
          <p className="text-xl text-gray-300 mb-10">
            Manage and monitor all PES Buddy platform activities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/login"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl
                         transition-all transform hover:scale-105 shadow-lg"
            >
              Admin Sign In
            </Link>
            <Link
              href="/admin/register"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20
                         rounded-xl font-bold transition-all transform hover:scale-105"
            >
              Register Admin
            </Link>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            Regular user?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
