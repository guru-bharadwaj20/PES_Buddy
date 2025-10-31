import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
	const { user, logout } = useContext(AuthContext);
	return (
		<header className="site-header">
					<div className="container">
						<div className="brand"><Link to="/">PES Buddy</Link></div>
								<nav className="nav">
									<Link to="/doormato">Doormato</Link>
									<Link to="/scootigo">Scootigo</Link>
									<Link to="/expense">Expense Tracker</Link>
								</nav>
								<div className="auth">
							{user ? (
								<>
									<span className="muted mr-1">{user.name}</span>
									<button className="btn btn-outline" onClick={logout}>Logout</button>
								</>
							) : (
											<>
												<Link to="/auth/login" className="btn btn-primary mr-1">Login</Link>
												<Link to="/auth/register" className="btn btn-primary">Register</Link>
											</>
							)}
						</div>
					</div>
		</header>
	);
};

export default Header;
