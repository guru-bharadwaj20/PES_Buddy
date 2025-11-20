import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState(() => {
		// Load cart from localStorage on initialization
		const savedCart = localStorage.getItem('pesbuddy_cart');
		return savedCart ? JSON.parse(savedCart) : [];
	});

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('pesbuddy_cart', JSON.stringify(items));
	}, [items]);

	const addItem = (item) => {
		setItems((prev) => {
			const found = prev.find(i => i.menuItem === item.menuItem);
			if (found) {
				return prev.map(i => i.menuItem === item.menuItem ? { ...i, qty: i.qty + (item.qty || 1) } : i);
			}
			return [...prev, { ...item, qty: item.qty || 1 }];
		});
	};

	const updateQuantity = (menuItemId, newQty) => {
		setItems(prev => {
			if (newQty <= 0) {
				return prev.filter(i => i.menuItem !== menuItemId);
			}
			return prev.map(i => i.menuItem === menuItemId ? { ...i, qty: newQty } : i);
		});
	};

	const removeItem = (menuItemId) => {
		setItems(prev => prev.filter(i => i.menuItem !== menuItemId));
	};

	const clear = () => {
		setItems([]);
		localStorage.removeItem('pesbuddy_cart');
	};

	const getTotalItems = () => {
		return items.reduce((sum, item) => sum + item.qty, 0);
	};

	const getTotalPrice = () => {
		return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
	};

	return (
		<CartContext.Provider value={{ 
			items, 
			addItem, 
			updateQuantity, 
			removeItem, 
			clear, 
			getTotalItems, 
			getTotalPrice 
		}}>
			{children}
		</CartContext.Provider>
	);
};

export default CartContext;
