import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Profile = () => {
	const { user, logout, updateUserProfile } = useContext(AuthContext);
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('profile');
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		srn: user?.srn || ''
	});

	// Sync formData with user data whenever user changes or when entering edit mode
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				srn: user.srn || ''
			});
		}
	}, [user, editing]);
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
			const response = await authService.updateProfile({
				name: formData.name,
				email: formData.email
			});
			updateUserProfile(response.user);
			setMessage({ type: 'success', text: 'Profile updated successfully!' });
			setEditing(false);
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Failed to update profile';
			setMessage({ type: 'error', text: errorMsg });
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
			await authService.resetPassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword
			});
			setMessage({ type: 'success', text: 'Password reset successfully!' });
			setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Failed to reset password';
			setMessage({ type: 'error', text: errorMsg });
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		setLoading(true);
		setMessage({ type: '', text: '' });
		try {
			await authService.deleteAccount();
			logout();
			navigate('/');
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Failed to delete account';
			setMessage({ type: 'error', text: errorMsg });
			setShowDeleteConfirm(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
				<p className="text-gray-400">Manage your account settings and preferences</p>
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
							? 'text-light-blue border-b-2 border-light-blue'
							: 'text-gray-400 hover:text-white'
					}`}
				>
					Profile Info
				</button>
				<button
					onClick={() => setActiveTab('password')}
					className={`px-6 py-3 font-semibold transition-all ${
						activeTab === 'password'
							? 'text-light-blue border-b-2 border-light-blue'
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
				<div className="glass rounded-2xl p-8">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center space-x-4">
							<div className="w-20 h-20 rounded-full bg-linear-to-br from-light-blue to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
								{user?.name.charAt(0).toUpperCase()}
							</div>
							<div>
								<h2 className="text-2xl font-bold text-white">{user?.name}</h2>
								<p className="text-gray-400">{user?.email}</p>
							</div>
						</div>
						{!editing && (
							<button
								onClick={() => setEditing(true)}
								className="px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-lg"
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
									placeholder={user?.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								/>
							</div>
							<div>
								<label className="block text-white font-semibold mb-2">Email</label>
								<input
									type="email"
									value={formData.email}
									placeholder={user?.email || 'Enter your email'}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								/>
							</div>
							<div>
								<label className="block text-white font-semibold mb-2">SRN</label>
								<input
									type="text"
									value={formData.srn}
									placeholder={user?.srn}
									className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-gray-500 rounded-xl cursor-not-allowed"
									disabled
								/>
								<p className="text-gray-500 text-sm mt-1">SRN cannot be changed</p>
							</div>
							<div className="flex space-x-3">
								<button
									type="submit"
									disabled={loading}
									className="px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg"
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
								<span className="text-gray-400">SRN:</span>
								<span className="text-white font-semibold">{user?.srn}</span>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Reset Password Tab */}
			{activeTab === 'password' && (
				<div className="glass rounded-2xl p-8">
					<h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>
					<form onSubmit={handleResetPassword} className="space-y-4">
						<div>
							<label className="block text-white font-semibold mb-2">Current Password</label>
							<input
								type="password"
								value={passwordData.currentPassword}
								onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								required
							/>
						</div>
						<div>
							<label className="block text-white font-semibold mb-2">New Password</label>
							<input
								type="password"
								value={passwordData.newPassword}
								onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
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
								className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
								required
								minLength="6"
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg"
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
						Once you delete your account, there is no going back. Please be certain.
					</p>
					
					{!showDeleteConfirm ? (
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="px-6 py-3 bg-light-red hover:bg-red-600 text-white font-bold rounded-lg transition-all border-2 border-light-red shadow-lg"
						>
							Delete Account
						</button>
					) : (
						<div className="bg-light-red/10 border-2 border-light-red rounded-xl p-6">
							<h3 className="text-xl font-bold text-white mb-3">Are you absolutely sure?</h3>
							<p className="text-gray-400 mb-4">
								This action cannot be undone. This will permanently delete your account and remove all your data.
							</p>
							<div className="flex space-x-3">
								<button
									onClick={handleDeleteAccount}
									disabled={loading}
									className="px-6 py-3 bg-light-red hover:bg-red-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 border-2 border-light-red shadow-lg"
								>
									{loading ? 'Deleting...' : 'Yes, Delete My Account'}
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

export default Profile;
