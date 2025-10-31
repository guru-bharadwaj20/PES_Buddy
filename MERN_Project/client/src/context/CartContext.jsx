import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState([]);

	const addItem = (item) => {
		setItems((prev) => {
			const found = prev.find(i => i.menuItem === item.menuItem);
			if (found) {
				return prev.map(i => i.menuItem === item.menuItem ? { ...i, qty: i.qty + (item.qty || 1) } : i);
			}
			return [...prev, { ...item, qty: item.qty || 1 }];
		});
	};

	const removeItem = (menuItemId) => {
		setItems(prev => prev.filter(i => i.menuItem !== menuItemId));
	};

	const clear = () => setItems([]);

	return (
		<CartContext.Provider value={{ items, addItem, removeItem, clear }}>
			{children}
		</CartContext.Provider>
	);
};

export default CartContext;
