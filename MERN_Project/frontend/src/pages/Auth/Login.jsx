import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const Login = () => {
	const [srn, setSrn] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [resetEmail, setResetEmail] = useState('');
	const [resetLoading, setResetLoading] = useState(false);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);
		try {
			const res = await login(srn, password);
			if (res && res.token) {
				setSuccess('Login successful! Redirecting...');
				setTimeout(() => {
					navigate('/dashboard');
				}, 1000);
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
			setLoading(false);
		}
	};

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setResetLoading(true);
		try {
			await authService.forgotPassword({ email: resetEmail });
			setSuccess('Password reset instructions sent to your email!');
			setTimeout(() => {
				setShowForgotPassword(false);
				setResetEmail('');
				setSuccess(null);
			}, 3000);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
		} finally {
			setResetLoading(false);
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
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
				</div>
				<h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back!</h2>
				<p className="text-gray-400">Sign in to your PES Buddy account</p>
				</div>

			{/* Form Card */}
			<div className="glass rounded-2xl p-8 shadow-2xl">
				{showForgotPassword ? (
					<div>
						<button
							onClick={() => {
								setShowForgotPassword(false);
								setError(null);
								setSuccess(null);
							}}
							className="text-light-blue hover:text-blue-400 mb-6 flex items-center space-x-2"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							<span>Back to Login</span>
						</button>

						<h3 className="text-2xl font-bold text-white mb-2">Forgot Password?</h3>
						<p className="text-gray-400 mb-6">Enter your email to receive reset instructions</p>

						<form onSubmit={handleForgotPassword} className="space-y-6">
							{error && (
								<div className="bg-light-red/10 border-2 border-light-red rounded-xl p-4 flex items-start space-x-3">
									<svg className="w-5 h-5 text-light-red mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span className="text-light-red font-semibold text-sm">{error}</span>
								</div>
							)}

							{success && (
								<div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 flex items-start space-x-3">
									<svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span className="text-green-500 font-semibold text-sm">{success}</span>
								</div>
							)}

							<div>
								<label className="block text-sm font-bold text-white mb-2">Email Address</label>
								<input 
									type="email"
									value={resetEmail} 
									onChange={e => setResetEmail(e.target.value)}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none placeholder-gray-500"
									placeholder="Enter your email"
									required
								/>
							</div>

							<button 
								type="submit" 
								disabled={resetLoading}
								className="w-full py-4 bg-linear-to-r from-light-blue to-blue-600 hover:from-blue-600 hover:to-light-blue text-white font-bold rounded-xl shadow-lg shadow-light-blue/30 hover:shadow-light-blue/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
							>
								{resetLoading ? (
									<>
										<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span>Sending...</span>
									</>
								) : (
									<span>Send Reset Link</span>
								)}
							</button>
						</form>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="bg-light-red/10 border-2 border-light-red rounded-xl p-4 flex items-start space-x-3 animate-slide-down">
								<svg className="w-5 h-5 text-light-red mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span className="text-light-red font-semibold text-sm">{error}</span>
							</div>
						)}

						{success && (
							<div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 flex items-start space-x-3">
								<svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span className="text-green-500 font-semibold text-sm">{success}</span>
							</div>
						)}						<div>
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
						<div className="flex items-center justify-between mb-2">
							<label className="block text-sm font-bold text-white">Password</label>
							<button
								type="button"
								onClick={() => setShowForgotPassword(true)}
								className="text-sm text-light-blue hover:text-blue-400 font-semibold transition-colors"
							>
								Forgot Password?
							</button>
						</div>
						<input 
							type="password" 
							value={password} 
							onChange={e => setPassword(e.target.value)}
							className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none placeholder-gray-500"
							placeholder="Enter your password"
							required
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
								<span>Signing in...</span>
							</>
						) : (
							<span>Sign In</span>
						)}
					</button>
				</form>
				)}

				{!showForgotPassword && (
					<>
						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-700"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-gray-900/80 text-gray-400 font-medium">New to PES Buddy?</span>
							</div>
						</div>

						{/* Register Link */}
						<Link 
							to="/auth/register"
							className="block w-full py-3 text-center bg-gray-800/50 border-2 border-light-blue text-light-blue font-semibold rounded-xl hover:bg-light-blue hover:text-white transition-all duration-300"
						>
							Create New Account
						</Link>

						{/* Admin Portal Link */}
						<div className="mt-6 text-center">
							<Link 
								to="/admin" 
								className="text-yellow-500 hover:text-yellow-400 font-semibold inline-flex items-center"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
								Admin Portal
							</Link>
						</div>
					</>
				)}
				</div>
			</div>
		</div>
	);
};

export default Login;
