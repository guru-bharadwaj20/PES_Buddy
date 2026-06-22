import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Get in touch with the PES Buddy team
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection delay={0.1}>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-white font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">SRN (Optional)</label>
                  <input
                    type="text"
                    placeholder="PES1UG21CS001"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="input-base resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold
                             rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              {[
                { icon: "📍", title: "Address", content: "PES University, 100 Feet Ring Road, BSK 3rd Stage, Bengaluru - 560085" },
                { icon: "📧", title: "Email", content: "support@pesbuddy.edu" },
                { icon: "📞", title: "Phone", content: "+91-80-2672-1983" },
                { icon: "🕐", title: "Support Hours", content: "Monday - Friday: 9 AM - 6 PM\nSaturday: 10 AM - 2 PM" },
              ].map((contact) => (
                <div key={contact.title} className="glass rounded-2xl p-6 flex items-start gap-4">
                  <div className="text-3xl">{contact.icon}</div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{contact.title}</h3>
                    <p className="text-gray-400 whitespace-pre-line">{contact.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  );
}
