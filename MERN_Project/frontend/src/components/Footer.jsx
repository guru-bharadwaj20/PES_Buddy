import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-linear-to-r from-primary-black via-gray-900 to-primary-black border-t border-white/10 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="bg-linear-to-br from-light-blue to-blue-600 p-2 rounded-lg shadow-lg">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<span className="text-xl font-extrabold text-white">
								PES <span className="text-light-blue">Buddy</span>
							</span>
						</div>
						<p className="text-gray-400 text-sm">
							Your all-in-one platform for campus food delivery, scooter booking, and expense tracking.
						</p>
						<div className="flex space-x-3">
							<a href="https://github.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-light-blue">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
							</a>
							<a href="https://twitter.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-light-blue">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
								</svg>
							</a>
							<a href="https://linkedin.com" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-light-blue">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
								</svg>
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-bold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link to="/" className="text-gray-400 hover:text-light-blue transition-colors text-sm">
									Home
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-gray-400 hover:text-light-blue transition-colors text-sm">
									About Us
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-gray-400 hover:text-light-blue transition-colors text-sm">
									Contact
								</Link>
							</li>
							<li>
								<Link to="/auth/register" className="text-gray-400 hover:text-light-blue transition-colors text-sm">
									Sign Up
								</Link>
							</li>
						</ul>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-white font-bold mb-4">Services</h3>
						<ul className="space-y-2">
							<li>
								<Link to="/doormato" className="text-gray-400 hover:text-light-blue transition-colors text-sm flex items-center space-x-2">
									<span>🍔</span>
									<span>Food Delivery</span>
								</Link>
							</li>
							<li>
								<Link to="/scootigo" className="text-gray-400 hover:text-light-blue transition-colors text-sm flex items-center space-x-2">
									<span>🛵</span>
									<span>Scooter Booking</span>
								</Link>
							</li>
							<li>
								<Link to="/expense-tracker" className="text-gray-400 hover:text-light-blue transition-colors text-sm flex items-center space-x-2">
									<span>💰</span>
									<span>Expense Tracker</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-white font-bold mb-4">Contact Us</h3>
						<ul className="space-y-3">
							<li className="flex items-start space-x-2 text-sm">
								<svg className="w-5 h-5 text-light-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								<span className="text-gray-400">support@pesbuddy.com</span>
							</li>
							<li className="flex items-start space-x-2 text-sm">
								<svg className="w-5 h-5 text-light-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
								<span className="text-gray-400">+91 9876543210</span>
							</li>
							<li className="flex items-start space-x-2 text-sm">
								<svg className="w-5 h-5 text-light-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								<span className="text-gray-400">PES University Campus, Bengaluru</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
					<p className="text-gray-400 text-sm">
						Made with ❤️ by <span className="text-light-blue font-semibold">Guru</span>
					</p>
					<p className="text-gray-400 text-sm">
						© {currentYear} PES Buddy. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
