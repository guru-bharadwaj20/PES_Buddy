import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
	const [srn, setSrn] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await login(srn, password);
			if (res && res.token) navigate('/');
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed');
		}
	};

	return (
		<main className="container">
			<h2 className="page-title">Login</h2>
			<form onSubmit={handleSubmit} className="card">
				<div className="mb-2">
					<label>SRN</label>
					<input value={srn} onChange={e => setSrn(e.target.value)} />
				</div>
				<div className="mb-2">
					<label>Password</label>
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<button type="submit" className="btn btn-primary">Login</button>
			</form>
			{error && <div className="mt-1" style={{ color: '#d9534f', fontWeight: 700 }}>{error}</div>}
		</main>
	);
};

export default Login;
