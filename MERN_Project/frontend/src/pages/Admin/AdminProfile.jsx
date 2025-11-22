import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminProfile = () => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('profile');
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		srn: user?.srn || ''
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const handleEditProfile = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: '', text: '' });
		try {
			// API call to update profile
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
			setMessage({ type: 'success', text: 'Profile updated successfully!' });
			setEditing(false);
		} catch (err) {
			setMessage({ type: 'error', text: 'Failed to update profile' });
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setMessage({ type: 'error', text: 'Passwords do not match!' });
			return;
		}
		setLoading(true);
		setMessage({ type: '', text: '' });
		try {
			// API call to reset password
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
			setMessage({ type: 'success', text: 'Password reset successfully!' });
			setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
		} catch (err) {
			setMessage({ type: 'error', text: 'Failed to reset password' });
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		setLoading(true);
		try {
			// API call to delete account
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
			logout();
			navigate('/admin');
		} catch (err) {
			setMessage({ type: 'error', text: 'Failed to delete account' });
		} finally {
			setLoading(false);
			setShowDeleteConfirm(false);
		}
	};

	return (
		<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="mb-8">
				<div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-4">
					<svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Admin Account</span>
				</div>
				<h1 className="text-4xl font-bold text-white mb-2">Admin Profile</h1>
				<p className="text-gray-400">Manage your administrator account settings and preferences</p>
			</div>

			{message.text && (
				<div className={`mb-6 p-4 rounded-xl ${
					message.type === 'success' 
						? 'bg-green-500/10 border-2 border-green-500 text-green-500' 
						: 'bg-light-red/10 border-2 border-light-red text-light-red'
				}`}>
					{message.text}
				</div>
			)}

			{/* Tabs */}
			<div className="flex space-x-2 mb-6 border-b border-white/10">
				<button
					onClick={() => setActiveTab('profile')}
					className={`px-6 py-3 font-semibold transition-all ${
						activeTab === 'profile'
							? 'text-yellow-500 border-b-2 border-yellow-500'
							: 'text-gray-400 hover:text-white'
					}`}
				>
					Profile Info
				</button>
				<button
					onClick={() => setActiveTab('password')}
					className={`px-6 py-3 font-semibold transition-all ${
						activeTab === 'password'
							? 'text-yellow-500 border-b-2 border-yellow-500'
							: 'text-gray-400 hover:text-white'
					}`}
				>
					Reset Password
				</button>
				<button
					onClick={() => setActiveTab('danger')}
					className={`px-6 py-3 font-semibold transition-all ${
						activeTab === 'danger'
							? 'text-light-red border-b-2 border-light-red'
							: 'text-gray-400 hover:text-white'
					}`}
				>
					Danger Zone
				</button>
			</div>

			{/* Profile Info Tab */}
			{activeTab === 'profile' && (
				<div className="glass rounded-2xl p-8 border border-yellow-500/20">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center space-x-4">
							<div className="w-20 h-20 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 text-3xl font-bold shadow-lg shadow-yellow-500/30">
								{user?.name.charAt(0).toUpperCase()}
							</div>
							<div>
								<h2 className="text-2xl font-bold text-white">{user?.name}</h2>
								<p className="text-gray-400">{user?.email}</p>
								<span className="inline-block mt-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-500 text-xs font-bold uppercase">
									Administrator
								</span>
							</div>
						</div>
						{!editing && (
							<button
								onClick={() => setEditing(true)}
								className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
							>
								Edit Profile
							</button>
						)}
					</div>

					{editing ? (
						<form onSubmit={handleEditProfile} className="space-y-4">
							<div>
								<label className="block text-white font-semibold mb-2">Full Name</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all outline-none"
									required
								/>
							</div>
							<div>
								<label className="block text-white font-semibold mb-2">Email</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all outline-none"
									required
								/>
							</div>
							<div>
								<label className="block text-white font-semibold mb-2">Admin SRN</label>
								<input
									type="text"
									value={formData.srn}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-gray-500 rounded-xl cursor-not-allowed"
									disabled
								/>
								<p className="text-gray-500 text-sm mt-1">Admin SRN cannot be changed</p>
							</div>
							<div className="flex space-x-3">
								<button
									type="submit"
									disabled={loading}
									className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg"
								>
									{loading ? 'Saving...' : 'Save Changes'}
								</button>
								<button
									type="button"
									onClick={() => setEditing(false)}
									className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all shadow-lg"
								>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<div className="space-y-4">
							<div className="flex justify-between py-3 border-b border-white/10">
								<span className="text-gray-400">Name:</span>
								<span className="text-white font-semibold">{user?.name}</span>
							</div>
							<div className="flex justify-between py-3 border-b border-white/10">
								<span className="text-gray-400">Email:</span>
								<span className="text-white font-semibold">{user?.email || 'Not provided'}</span>
							</div>
							<div className="flex justify-between py-3 border-b border-white/10">
								<span className="text-gray-400">Admin SRN:</span>
								<span className="text-white font-semibold">{user?.srn}</span>
							</div>
							<div className="flex justify-between py-3 border-b border-white/10">
								<span className="text-gray-400">Role:</span>
								<span className="text-yellow-500 font-semibold">Administrator</span>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Reset Password Tab */}
			{activeTab === 'password' && (
				<div className="glass rounded-2xl p-8 border border-yellow-500/20">
					<h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>
					<form onSubmit={handleResetPassword} className="space-y-4">
						<div>
							<label className="block text-white font-semibold mb-2">Current Password</label>
							<input
								type="password"
								value={passwordData.currentPassword}
								onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all outline-none"
								required
							/>
						</div>
						<div>
							<label className="block text-white font-semibold mb-2">New Password</label>
							<input
								type="password"
								value={passwordData.newPassword}
								onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all outline-none"
								required
								minLength="6"
							/>
						</div>
						<div>
							<label className="block text-white font-semibold mb-2">Confirm New Password</label>
							<input
								type="password"
								value={passwordData.confirmPassword}
								onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all outline-none"
								required
								minLength="6"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg"
						>
							{loading ? 'Resetting...' : 'Reset Password'}
						</button>
					</form>
				</div>
			)}

			{/* Danger Zone Tab */}
			{activeTab === 'danger' && (
				<div className="glass rounded-2xl p-8 border-2 border-light-red/30">
					<h2 className="text-2xl font-bold text-light-red mb-6">Danger Zone</h2>
					<p className="text-gray-400 mb-6">
						Once you delete your admin account, there is no going back. Please be certain.
					</p>
					
					{!showDeleteConfirm ? (
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="px-6 py-3 bg-light-red hover:bg-red-600 text-white font-bold rounded-lg transition-all border-2 border-light-red shadow-lg"
						>
							Delete Admin Account
						</button>
					) : (
						<div className="bg-light-red/10 border-2 border-light-red rounded-xl p-6">
							<h3 className="text-xl font-bold text-white mb-3">Are you absolutely sure?</h3>
							<p className="text-gray-400 mb-4">
								This action cannot be undone. This will permanently delete your administrator account and remove all your data.
							</p>
							<div className="flex space-x-3">
								<button
									onClick={handleDeleteAccount}
									disabled={loading}
									className="px-6 py-3 bg-light-red hover:bg-red-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 border-2 border-light-red shadow-lg"
								>
									{loading ? 'Deleting...' : 'Yes, Delete My Admin Account'}
								</button>
								<button
									onClick={() => setShowDeleteConfirm(false)}
									className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all shadow-lg"
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</main>
	);
};

export default AdminProfile;
