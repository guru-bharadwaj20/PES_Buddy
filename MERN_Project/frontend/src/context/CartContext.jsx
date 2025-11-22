import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const [items, setItems] = useState([]);

	// Load cart from localStorage when user changes
	useEffect(() => {
		if (user) {
			const cartKey = `pesbuddy_cart_${user._id}`;
			const savedCart = localStorage.getItem(cartKey);
			setItems(savedCart ? JSON.parse(savedCart) : []);
		} else {
			// Clear cart when user logs out
			setItems([]);
		}
	}, [user]);

	// Save cart to localStorage whenever it changes (user-specific)
	useEffect(() => {
		if (user) {
			const cartKey = `pesbuddy_cart_${user._id}`;
			localStorage.setItem(cartKey, JSON.stringify(items));
		}
	}, [items, user]);

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
		if (user) {
			const cartKey = `pesbuddy_cart_${user._id}`;
			localStorage.removeItem(cartKey);
		}
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
