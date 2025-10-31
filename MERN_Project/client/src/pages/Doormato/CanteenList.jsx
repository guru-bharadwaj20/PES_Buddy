import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';

const CanteenList = () => {
	const [canteens, setCanteens] = useState([]);

	useEffect(() => {
		doormatoService.getCanteens().then(setCanteens).catch(err => console.error(err));
	}, []);

	return (
		<main className="container">
			<h2 className="page-title">Canteens</h2>
			<div className="card">
				<ul>
					{canteens.map(c => (
						<li key={c._id} className="mb-1">
							<Link to={`/doormato/menu/${c._id}`} className="item-title">{c.name}</Link>
							<div className="muted">{c.description}</div>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
};

export default CanteenList;
