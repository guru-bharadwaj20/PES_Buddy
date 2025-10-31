import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';
import { CartContext } from '../../context/CartContext';

const Menu = () => {
	const { canteenId } = useParams();
	const [items, setItems] = useState([]);
	const { addItem } = useContext(CartContext);

	useEffect(() => {
		doormatoService.getMenu(canteenId).then(setItems).catch(err => console.error(err));
	}, [canteenId]);

	return (
		<main className="container">
			<h2 className="page-title">Menu</h2>
			<div className="card">
				<ul>
					{items.map(it => (
						<li key={it._id} className="mb-2">
							<div className="row">
								<div className="col">
									<div className="item-title">{it.name}</div>
									<div className="muted">{it.description}</div>
								</div>
												<div className="minw-140 align-center" style={{ display: 'flex', gap: '0.75rem' }}>
													<div className="item-price">₹{it.price}</div>
													<button className="btn btn-accent" onClick={() => addItem({ menuItem: it._id, name: it.name, price: it.price })}>Add</button>
												</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
};

export default Menu;
