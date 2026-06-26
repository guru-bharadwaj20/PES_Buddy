import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = { title: "About" };

const team = [
  { name: "Doormato Module", role: "Campus Food Ordering", icon: "🍔" },
  { name: "Scootigo Module", role: "Scooter Booking System", icon: "🛵" },
  { name: "Expense Tracker", role: "Personal Finance Manager", icon: "💰" },
  { name: "Admin Portal", role: "Platform Management", icon: "🏢" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">About PES Buddy</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A comprehensive campus management platform built for PES University students
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <AnimatedSection delay={0.1}>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                PES Buddy was created to simplify everyday campus life at PES University.
                From ordering food between classes to booking scooter rides across campus,
                we&apos;ve built a unified platform that saves time and makes student life more convenient.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">🏫 About PES University</h2>
              <p className="text-gray-300 leading-relaxed">
                PES University is one of India&apos;s leading engineering institutions located in
                Bengaluru, Karnataka. With multiple campuses and thousands of students, the need
                for a unified campus management system led to the creation of PES Buddy.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3}>
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our Modules</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {team.map((module) => (
              <div key={module.name} className="glass rounded-xl p-6 text-center card-hover">
                <div className="text-4xl mb-3">{module.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{module.name}</h3>
                <p className="text-gray-400 text-sm">{module.role}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="glass rounded-2xl p-8 border border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">🛠️ Technology Stack</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "Frontend", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"] },
                { label: "Backend", items: ["Next.js Route Handlers", "Prisma ORM", "MongoDB Atlas", "Socket.IO", "Redis (optional)"] },
                { label: "Auth & Deploy", items: ["Auth.js (NextAuth v5)", "HttpOnly Cookies", "Vercel", "GitHub Actions", "PWA Ready"] },
              ].map((stack) => (
                <div key={stack.label}>
                  <h3 className="text-blue-400 font-bold mb-3">{stack.label}</h3>
                  <ul className="space-y-1">
                    {stack.items.map((item) => (
                      <li key={item} className="text-gray-400 flex items-center gap-2">
                        <span className="text-green-400">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
