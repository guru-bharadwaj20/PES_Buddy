import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold
                       transition-all transform hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20
                       rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
