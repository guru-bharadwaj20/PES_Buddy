import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              PES <span className="gradient-text">Buddy</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your all-in-one campus companion for food ordering, scooter booking,
              and expense tracking at PES University.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/auth/login", label: "Sign In" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2">
              {[
                { href: "/doormato", label: "🍔 Doormato" },
                { href: "/scootigo", label: "🛵 Scootigo" },
                { href: "/expense-tracker", label: "💰 Expense Tracker" },
                { href: "/notifications", label: "🔔 Notifications" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {year} PES Buddy. Built for PES University.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> at PESU
          </p>
        </div>
      </div>
    </footer>
  );
}
