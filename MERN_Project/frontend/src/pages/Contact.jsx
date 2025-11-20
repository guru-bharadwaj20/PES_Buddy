import React, { useState } from 'react';

const Contact = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: ''
	});
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Contact form submitted:', formData);
		setSubmitted(true);
		setFormData({ name: '', email: '', subject: '', message: '' });
		setTimeout(() => setSubmitted(false), 5000);
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Hero Section */}
			<div className="mb-12 text-center">
				<h1 className="text-6xl font-bold text-white mb-6">Get in Touch</h1>
				<p className="text-2xl text-gray-300 max-w-2xl mx-auto">
					Have questions or feedback? We'd love to hear from you!
				</p>
			</div>

			<div className="grid lg:grid-cols-3 gap-8 mb-12">
				{/* Contact Form */}
				<div className="lg:col-span-2">
					<div className="glass rounded-2xl p-10">
						<h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>
						
						{submitted && (
							<div className="mb-6 p-4 rounded-xl bg-green-500/10 border-2 border-green-500 text-green-500 flex items-center space-x-3">
								<svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="font-bold">Thank you! Your message has been received. We'll get back to you soon.</span>
							</div>
						)}
						
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label className="block text-white font-semibold mb-2">Full Name</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									placeholder="Enter your name"
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								/>
							</div>
							
							<div>
								<label className="block text-white font-semibold mb-2">Email Address</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									placeholder="your.email@example.com"
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								/>
							</div>
							
							<div>
								<label className="block text-white font-semibold mb-2">Subject</label>
								<input
									type="text"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									required
									placeholder="What is this regarding?"
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								/>
							</div>
							
							<div>
								<label className="block text-white font-semibold mb-2">Message</label>
								<textarea
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows="6"
									placeholder="Tell us more about your query..."
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none resize-none"
								/>
							</div>
							
							<button
								type="submit"
								className="w-full py-4 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg text-lg"
							>
								Send Message
							</button>
						</form>
					</div>
				</div>

				{/* Contact Info Sidebar */}
				<div className="space-y-6">
					{/* Contact Information */}
					<div className="glass rounded-2xl p-8">
						<h3 className="text-2xl font-bold text-white mb-6">Contact Info</h3>
						
						<div className="space-y-6">
							<div>
								<div className="flex items-center space-x-3 mb-2">
									<div className="w-10 h-10 bg-light-blue/20 rounded-lg flex items-center justify-center">
										<svg className="w-5 h-5 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
									<h4 className="text-white font-bold">Location</h4>
								</div>
								<p className="text-gray-300 text-sm leading-relaxed ml-13">
									PES University<br />
									100 Feet Ring Road<br />
									BSK 3rd Stage<br />
									Bangalore - 560085
								</p>
							</div>

							<div>
								<div className="flex items-center space-x-3 mb-2">
									<div className="w-10 h-10 bg-light-blue/20 rounded-lg flex items-center justify-center">
										<svg className="w-5 h-5 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<h4 className="text-white font-bold">Email</h4>
								</div>
								<a href="mailto:support@pesbuddy.edu" className="text-light-blue hover:text-blue-400 text-sm ml-13 transition-colors">
									support@pesbuddy.edu
								</a>
							</div>

							<div>
								<div className="flex items-center space-x-3 mb-2">
									<div className="w-10 h-10 bg-light-blue/20 rounded-lg flex items-center justify-center">
										<svg className="w-5 h-5 text-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									</div>
									<h4 className="text-white font-bold">Phone</h4>
								</div>
								<p className="text-gray-300 text-sm ml-13">+91 80 2672 1983</p>
								<p className="text-gray-500 text-xs ml-13 mt-1">Mon-Fri, 9 AM - 6 PM</p>
							</div>

							<div>
								<div className="flex items-center space-x-3 mb-2">
									<div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
										<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
										</svg>
									</div>
									<h4 className="text-white font-bold">Live Support</h4>
								</div>
								<p className="text-gray-300 text-sm ml-13">
									Real-time connection status shown in header when logged in
								</p>
							</div>
						</div>
					</div>

					{/* Report Issue Card */}
					<div className="glass rounded-2xl p-8 border-2 border-yellow-500/30 bg-yellow-500/5">
						<div className="flex items-center space-x-3 mb-4">
							<svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<h3 className="text-xl font-bold text-white">Report an Issue</h3>
						</div>
						<p className="text-gray-300 text-sm leading-relaxed">
							Encountered a bug or technical issue? Please describe the problem in detail using the contact form, and our technical team will investigate it promptly.
						</p>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="glass rounded-2xl p-10">
				<h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
				
				<div className="grid md:grid-cols-2 gap-6">
					{[
						{
							q: 'How do I register?',
							a: 'Click on "Register" in the header, fill in your details using your PES SRN.'
						},
						{
							q: 'Can I order from multiple canteens?',
							a: 'Yes! You can add items from different canteens to your cart.'
						},
						{
							q: 'How does scooter booking work?',
							a: 'Select your route, choose an available scooter, and book instantly. Fare is calculated automatically.'
						},
						{
							q: 'Is my data secure?',
							a: 'Yes! We use JWT authentication and encrypted connections to protect your data.'
						}
					].map((faq, idx) => (
						<div key={idx} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
							<h4 className="text-lg font-bold text-white mb-3">{faq.q}</h4>
							<p className="text-gray-400 leading-relaxed">{faq.a}</p>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default Contact;
