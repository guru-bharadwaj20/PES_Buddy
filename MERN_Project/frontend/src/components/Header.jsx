import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
	const { user, logout, socketConnected } = useContext(AuthContext);
	const { items } = useContext(CartContext);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const dropdownRef = useRef(null);

	const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
	const closeMobileMenu = () => setMobileMenuOpen(false);

	const handleLogout = () => {
		logout();
		closeMobileMenu();
		setProfileDropdownOpen(false);
		navigate('/');
	};

	const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

	const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setProfileDropdownOpen(false);
			}
		};

		if (profileDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [profileDropdownOpen]);

	return (
		<header className="bg-linear-to-r from-primary-black via-gray-900 to-primary-black shadow-2xl sticky top-0 z-50 border-b border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo/Brand */}
					<div className="flex items-center space-x-3">
						<Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
							<div className="bg-linear-to-br from-light-blue to-blue-600 p-2 rounded-lg shadow-lg group-hover:shadow-light-blue/50 transition-all duration-300">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<span className="text-xl font-extrabold text-white tracking-tight">
								PES <span className="text-light-blue">Buddy</span>
							</span>
						</Link>
						{socketConnected && (
							<div className="hidden sm:flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30 animate-pulse">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="text-green-500 text-xs font-bold uppercase tracking-wider">Live</span>
							</div>
						)}
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-1">
						{user ? (
							user.role === 'admin' ? (
								<>
									<Link 
										to="/admin/dashboard" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/admin/dashboard') || isActive('/admin') && location.pathname === '/admin/dashboard'
												? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										Admin Dashboard
									</Link>
									<Link 
										to="/admin/doormato" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/admin/doormato')
												? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										🍔 Doormato Control
									</Link>
									<Link 
										to="/admin/scootigo" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/admin/scootigo')
												? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										🛵 Scootigo Control
									</Link>
								</>
							) : (
								<>
									<Link 
										to="/dashboard" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/dashboard') 
												? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										Dashboard
									</Link>
									<Link 
										to="/doormato" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/doormato')
												? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										🍔 Doormato
									</Link>
									<Link 
										to="/scootigo" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/scootigo')
												? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										🛵 Scootigo
									</Link>
									<Link 
										to="/expense-tracker" 
										className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
											isActive('/expense-tracker') 
												? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										💰 Expenses
									</Link>
								</>
							)
						) : (
							<>
								<Link 
									to="/" 
									className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
										isActive('/') && location.pathname === '/'
											? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
											: 'text-gray-300 hover:text-white hover:bg-white/10'
									}`}
								>
									Home
								</Link>
								<Link 
									to="/about" 
									className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
										isActive('/about') 
											? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
											: 'text-gray-300 hover:text-white hover:bg-white/10'
									}`}
								>
									About
								</Link>
								<Link 
									to="/contact" 
									className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
										isActive('/contact') 
											? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
											: 'text-gray-300 hover:text-white hover:bg-white/10'
									}`}
								>
									Contact
								</Link>
							</>
						)}
					</nav>

					{/* Desktop Auth Buttons */}
					<div className="hidden lg:flex items-center space-x-3">
						{user ? (
							<>
								{/* Profile Dropdown */}
								<div className="relative" ref={dropdownRef}>
									<button 
										onClick={toggleProfileDropdown}
										className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
									>
										<div className="w-8 h-8 rounded-full bg-linear-to-br from-light-blue to-blue-600 flex items-center justify-center text-white font-bold text-sm">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<span className="text-sm font-medium text-gray-300">Hi, {user.name}</span>
										<svg className={`w-4 h-4 text-gray-300 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>

									{/* Dropdown Menu */}
									{profileDropdownOpen && (
										<div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-2xl border border-white/10 py-2 z-50 animate-slide-down">
											<Link
												to={user.role === 'admin' ? '/admin/profile' : '/profile'}
												onClick={() => setProfileDropdownOpen(false)}
												className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-all flex items-center space-x-3 border-b border-white/10"
											>
												<svg className={`w-5 h-5 ${user.role === 'admin' ? 'text-yellow-500' : 'text-light-blue'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
												<span className="font-semibold">My Profile</span>
											</Link>
											<button 
												onClick={handleLogout}
												className="w-full px-4 py-3 mt-2 mx-2 text-left text-white bg-light-red hover:bg-red-600 border-2 border-light-red rounded-lg transition-all flex items-center space-x-3 shadow-lg"
												style={{ width: 'calc(100% - 1rem)' }}
											>
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
												</svg>
												<span className="font-bold text-white">Logout</span>
											</button>
										</div>
									)}
								</div>

								{/* Cart Icon - Only for customers */}
								{user.role !== 'admin' && (
									<Link 
										to="/doormato/cart" 
										className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 relative ${
											isActive('/doormato/cart')
												? 'bg-light-blue text-white shadow-lg shadow-light-blue/30' 
												: 'text-gray-300 hover:text-white hover:bg-white/10'
										}`}
									>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
										{items.length > 0 && (
											<span className="absolute -top-1 -right-1 bg-light-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
												{items.length}
											</span>
										)}
									</Link>
								)}
							</>
						) : (
							<>
								<Link 
									to="/auth/login" 
									className="px-5 py-2 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/10 transition-all duration-200"
								>
									Login
								</Link>
								<Link 
									to="/auth/register" 
									className="px-5 py-2 bg-linear-to-r from-light-blue to-blue-600 hover:from-blue-600 hover:to-light-blue text-white font-bold rounded-lg shadow-lg shadow-light-blue/30 hover:shadow-light-blue/50 transition-all duration-200"
								>
									Register
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button 
						onClick={toggleMobileMenu}
						className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu Drawer */}
			<div 
				className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
					mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
				}`}
				onClick={closeMobileMenu}
			>
				<div 
					className={`fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-linear-to-br from-gray-900 via-primary-black to-gray-900 shadow-2xl transform transition-transform duration-300 ease-out ${
						mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-col h-full">
						{/* Mobile Menu Header */}
						<div className="flex items-center justify-between p-6 border-b border-white/10">
							<div className="flex items-center space-x-2">
								<div className="bg-linear-to-br from-light-blue to-blue-600 p-2 rounded-lg shadow-lg">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<span className="text-lg font-bold text-white">Menu</span>
							</div>
							<button 
								onClick={closeMobileMenu}
								className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Mobile Navigation Links */}
						<nav className="flex-1 overflow-y-auto p-6 space-y-2">
							{user ? (
								user.role === 'admin' ? (
									<>
										<Link 
											to="/admin/dashboard" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/admin/dashboard') 
													? 'bg-yellow-500 text-gray-900 shadow-lg' 
													: 'text-gray-300 hover:bg-white/10 hover:text-white'
											}`}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											<span>Admin Dashboard</span>
										</Link>
										<Link 
											to="/admin/doormato" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/admin/doormato')
													? 'bg-yellow-500 text-gray-900 shadow-lg' 
													: 'text-gray-300 hover:bg-white/10 hover:text-white'
											}`}
										>
											<span className="text-xl">🍔</span>
											<span>Doormato Control</span>
										</Link>
										<Link 
											to="/admin/scootigo" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/admin/scootigo')
													? 'bg-yellow-500 text-gray-900 shadow-lg' 
													: 'text-gray-300 hover:bg-white/10 hover:text-white'
											}`}
										>
											<span className="text-xl">🛵</span>
											<span>Scootigo Control</span>
										</Link>
									</>
								) : (
									<>
										<Link 
											to="/dashboard" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/dashboard') 
													? 'bg-light-blue text-white shadow-lg' 
													: 'text-gray-300 hover:bg-white/10 hover:text-white'
											}`}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
											</svg>
											<span>Dashboard</span>
										</Link>
										<Link 
											to="/doormato" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/doormato')
													? 'bg-light-blue text-white shadow-lg' 
													: 'text-gray-300 hover:bg-white/10 hover:text-white'
											}`}
										>
											<span className="text-xl">🍔</span>
											<span>Doormato</span>
										</Link>
										<Link 
											to="/scootigo" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/scootigo')
													? 'bg-light-blue text-white shadow-lg' 
													: 'text-gray-300 hover:bg-white/10 hover:text-white'
											}`}
										>
											<span className="text-xl">🛵</span>
											<span>Scootigo</span>
										</Link>
										<Link 
											to="/expense-tracker" 
											onClick={closeMobileMenu}
											className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
												isActive('/expense-tracker') 
													? 'bg-light-blue text-white shadow-lg' 
													: 'text-gray-300 hover:text-white hover:bg-white/10'
											}`}
										>
											<span className="text-xl">💰</span>
											<span>Expense Tracker</span>
										</Link>
									</>
								)
							) : (
								<>
									<Link 
										to="/" 
										onClick={closeMobileMenu}
										className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
											location.pathname === '/'
												? 'bg-light-blue text-white shadow-lg' 
												: 'text-gray-300 hover:bg-white/10 hover:text-white'
										}`}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
										</svg>
										<span>Home</span>
									</Link>
									<Link 
										to="/about" 
										onClick={closeMobileMenu}
										className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
											isActive('/about') 
												? 'bg-light-blue text-white shadow-lg' 
												: 'text-gray-300 hover:bg-white/10 hover:text-white'
										}`}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span>About</span>
									</Link>
									<Link 
										to="/contact" 
										onClick={closeMobileMenu}
										className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
											isActive('/contact') 
												? 'bg-light-blue text-white shadow-lg' 
												: 'text-gray-300 hover:bg-white/10 hover:text-white'
										}`}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										<span>Contact</span>
									</Link>
								</>
							)}
						</nav>

						{/* Mobile Auth Section */}
						<div className="p-6 border-t border-white/10 space-y-3">
							{user ? (
								<>
									<div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
										<div className="w-10 h-10 rounded-full bg-linear-to-br from-light-blue to-blue-600 flex items-center justify-center text-white font-bold">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-white">{user.name}</p>
											<p className="text-xs text-gray-400">{user.email}</p>
										</div>
									</div>
									<Link
										to={user.role === 'admin' ? '/admin/profile' : '/profile'}
										onClick={closeMobileMenu}
										className={`w-full px-4 py-3 ${user.role === 'admin' ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' : 'bg-light-blue hover:bg-blue-600 text-white'} font-semibold rounded-lg transition-all flex items-center justify-center space-x-2`}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
										<span>My Profile</span>
									</Link>
									<button 
										onClick={handleLogout} 
										className="w-full px-4 py-3 bg-light-red hover:bg-red-600 border-2 border-light-red text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										<span>Logout</span>
									</button>
								</>
							) : (
								<>
									<Link 
										to="/auth/login" 
										onClick={closeMobileMenu}
										className="block w-full px-4 py-3 text-center text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/10 transition-all"
									>
										Login
									</Link>
									<Link 
										to="/auth/register" 
										onClick={closeMobileMenu}
										className="block w-full px-4 py-3 text-center bg-linear-to-r from-light-blue to-blue-600 text-white font-bold rounded-lg shadow-lg transition-all"
									>
										Register Now
									</Link>
								</>
							)}
							{socketConnected && (
								<div className="flex items-center justify-center space-x-2 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
									<span className="text-green-500 text-xs font-bold uppercase tracking-wider">Connected Live</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
