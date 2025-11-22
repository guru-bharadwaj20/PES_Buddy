import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
	const { loginAdmin } = useContext(AuthContext);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ srn: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const res = await loginAdmin(formData.srn, formData.password);
			if (res && res.user) {
				navigate('/admin/dashboard');
			} else {
				setError('Invalid admin credentials');
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12">
			<div className="max-w-md w-full">
				{/* Admin Badge */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-4">
						<svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
						<span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Admin Portal</span>
					</div>
					<h2 className="text-4xl font-extrabold text-white mb-2">Admin Sign In</h2>
					<p className="text-gray-400">Access the administrative dashboard</p>
				</div>

				{/* Login Form */}
				<div className="glass rounded-2xl p-8 shadow-2xl border border-yellow-500/20">
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						<div>
							<label htmlFor="srn" className="block text-sm font-bold text-gray-300 mb-2">
								Admin SRN
							</label>
							<input
								type="text"
								id="srn"
								name="srn"
								value={formData.srn}
								onChange={handleChange}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
								placeholder="Enter your admin SRN"
								required
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2">
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
								placeholder="Enter your password"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full px-4 py-3 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50"
						>
							{loading ? 'Signing in...' : 'Sign In as Admin'}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-400 text-sm">
							Don't have admin access?{' '}
							<Link to="/admin/register" className="text-yellow-500 hover:text-yellow-400 font-semibold">
								Register here
							</Link>
						</p>
					</div>

					<div className="mt-4 text-center">
						<Link to="/admin" className="text-gray-500 hover:text-gray-400 text-sm inline-flex items-center">
							<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							Back to Admin Home
						</Link>
					</div>
				</div>

				{/* Customer Login Link */}
				<div className="mt-8 text-center">
					<Link 
						to="/auth/login" 
						className="text-light-blue hover:text-blue-400 font-semibold inline-flex items-center"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Customer Login Instead
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
