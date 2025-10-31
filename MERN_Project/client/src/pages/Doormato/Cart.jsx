import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import doormatoService from '../../services/doormatoService';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
	const { items, removeItem, clear } = useContext(CartContext);
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const total = items.reduce((s, i) => s + (i.price * i.qty), 0);

	const handlePlaceOrder = async () => {
		if (!user) return setMessage('Please login to place order');
		setLoading(true);
		try {
			const payload = { canteenName: items[0]?.canteenName || '', items: items.map(i => ({ menuItem: i.menuItem, qty: i.qty })) };
			await doormatoService.createOrder(payload);
			setMessage('Order placed successfully');
			clear();
		} catch (err) {
			setMessage(err.response?.data?.message || 'Failed to place order');
		} finally { setLoading(false); }
	};

	return (
		<main className="container">
			<h2 className="page-title">Cart</h2>
			<div className="card">
				{items.length === 0 ? <div className="muted">Cart is empty</div> : (
					<>
										<ul>
											{items.map(it => (
												<li key={it.menuItem} className="row align-center">
													<div className="col">{it.name} x {it.qty}</div>
													<div className="minw-160 text-right">₹{it.price * it.qty} <button className="btn btn-outline ml-1" onClick={() => removeItem(it.menuItem)}>Remove</button></div>
												</li>
											))}
										</ul>
						<div className="mb-2"><strong>Total:</strong> ₹{total}</div>
						<div className="gap">
							<button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>Place Order</button>
							<button className="btn btn-outline" onClick={clear}>Clear</button>
						</div>
						{message && <div className="mt-1">{message}</div>}
					</>
				)}
			</div>
		</main>
	);
};

export default Cart;
