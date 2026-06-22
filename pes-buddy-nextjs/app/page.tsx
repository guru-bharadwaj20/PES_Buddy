import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "PES Buddy — Your Campus Companion",
};

const features = [
  {
    icon: "🍔",
    title: "PES Doormato",
    description: "Order delicious food from multiple campus canteens",
    items: ["SKM Canteen", "GJBC Canteen", "BE Block 13th Floor", "Hornbill Canteen"],
    color: "from-orange-500/20 to-red-500/10",
  },
  {
    icon: "🛵",
    title: "PES Scootigo",
    description: "Book scooters for convenient campus travel",
    items: ["GJBC ↔ OAT", "SKM ↔ BE Block", "MRD Block ↔ F Block", "Real-time tracking"],
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: "💰",
    title: "Expense Tracker",
    description: "Track your weekly expenses by category",
    items: ["Food & Travel", "Study Materials", "Charts & Analytics", "Smart budgeting"],
    color: "from-green-500/20 to-emerald-500/10",
  },
];

const perks = [
  { icon: "⚡", title: "Real-time Updates", desc: "Live notifications and status tracking" },
  { icon: "🍽️", title: "Multiple Canteens", desc: "Order from all campus locations" },
  { icon: "🎯", title: "Easy Booking", desc: "Simple scooter reservation system" },
  { icon: "📊", title: "Smart Expenses", desc: "Track spending with weekly limits" },
  { icon: "🔒", title: "Secure", desc: "Protected authentication system" },
  { icon: "💻", title: "User Friendly", desc: "Intuitive and modern interface" },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
            <AnimatedSection delay={0}>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                <span className="text-white">PES </span>
                <span className="gradient-text">Buddy</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                Your all-in-one campus companion for food ordering, scooter booking,
                and expense tracking at PES University
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/auth/login"
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-lg
                             transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/40
                             w-full sm:w-auto"
                >
                  Sign In →
                </Link>
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20
                             rounded-xl font-bold text-lg transition-all transform hover:scale-105
                             w-full sm:w-auto"
                >
                  Create Account
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-8">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30
                             rounded-xl text-yellow-400 hover:bg-yellow-500/20 font-semibold transition-all
                             transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Admin Portal
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <div className={`glass rounded-2xl p-8 card-hover bg-gradient-to-br ${feature.color}`}>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center text-gray-400">
                        <span className="text-blue-400 mr-2">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Getting Started */}
          <AnimatedSection delay={0.3}>
            <div className="mt-16 glass rounded-2xl p-8 border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Getting Started</h3>
              <p className="text-gray-300 mb-4">
                To access all features, please{" "}
                <Link href="/auth/register" className="text-blue-400 font-semibold hover:underline">
                  Register
                </Link>{" "}
                or{" "}
                <Link href="/auth/login" className="text-blue-400 font-semibold hover:underline">
                  Login
                </Link>{" "}
                using the buttons above.
              </p>
              <p className="text-gray-400">
                Your SRN serves as your unique identifier for all transactions and bookings.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* ─── Why PES Buddy ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <AnimatedSection>
            <h3 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose PES Buddy?
            </h3>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <AnimatedSection key={perk.title} delay={i * 0.08}>
                <div className="glass rounded-xl p-6 text-center card-hover">
                  <div className="text-4xl mb-3">{perk.icon}</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{perk.title}</h4>
                  <p className="text-gray-400 text-sm">{perk.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
