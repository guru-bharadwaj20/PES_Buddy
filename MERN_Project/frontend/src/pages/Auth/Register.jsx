import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
	const [name, setName] = useState('');
	const [srn, setSrn] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await authService.register({ name, srn, password, email });
			if (res) {
				setSuccess(true);
				setTimeout(() => {
					navigate('/auth/login');
				}, 2000);
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Registration failed');
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
				<div className="flex justify-center mb-4">
					<div className="bg-linear-to-br from-light-blue to-blue-600 p-3 rounded-2xl shadow-2xl shadow-light-blue/30">
						<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
						</svg>
					</div>
				</div>
				<h2 className="text-4xl font-extrabold text-white mb-2">Create Account</h2>
				<p className="text-gray-400">Join the PES Buddy community today</p>
				</div>

				{/* Form Card */}
				<div className="glass rounded-2xl p-8 shadow-2xl">
					{success ? (
						<div className="text-center py-12">
							<div className="mb-6">
								<svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-white mb-3">Registration Successful!</h3>
							<p className="text-gray-400 mb-4">Your account has been created successfully.</p>
							<div className="flex items-center justify-center space-x-2 text-light-blue">
								<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span className="font-semibold">Redirecting to Login...</span>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-5">
							{error && (
								<div className="bg-light-red/10 border-2 border-light-red rounded-xl p-4 flex items-start space-x-3 animate-slide-down">
									<svg className="w-5 h-5 text-light-red mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span className="text-light-red font-semibold text-sm">{error}</span>
								</div>
							)}

						<div>
							<label className="block text-sm font-bold text-white mb-2">Full Name</label>
							<input 
								type="text"
								value={name} 
								onChange={e => setName(e.target.value)}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none placeholder-gray-500"
								placeholder="Enter your full name"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-white mb-2">SRN</label>
							<input 
								type="text"
								value={srn} 
								onChange={e => setSrn(e.target.value)}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none placeholder-gray-500"
								placeholder="Enter your SRN"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-white mb-2">Email</label>
							<input 
								type="email"
								value={email} 
								onChange={e => setEmail(e.target.value)}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none placeholder-gray-500"
								placeholder="Enter your email"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-white mb-2">Password</label>
							<input 
								type="password" 
								value={password} 
								onChange={e => setPassword(e.target.value)}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none placeholder-gray-500"
								placeholder="Create a strong password"
								required
								minLength="6"
							/>
						</div>

						<button 
							type="submit" 
							disabled={loading}
							className="w-full py-4 bg-linear-to-r from-light-blue to-blue-600 hover:from-blue-600 hover:to-light-blue text-white font-bold rounded-xl shadow-lg shadow-light-blue/30 hover:shadow-light-blue/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
						>
							{loading ? (
								<>
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span>Creating account...</span>
								</>
							) : (
								<span>Create Account</span>
							)}
						</button>
					</form>
					)}

					{!success && (
						<>
							{/* Divider */}
							<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-700"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-gray-900/80 text-gray-400 font-medium">Already have an account?</span>
						</div>
					</div>

					{/* Login Link */}
					<Link 
						to="/auth/login"
						className="block w-full py-3 text-center bg-gray-800/50 border-2 border-light-blue text-light-blue font-semibold rounded-xl hover:bg-light-blue hover:text-white transition-all duration-300"
					>
						Sign In Instead
					</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Register;
