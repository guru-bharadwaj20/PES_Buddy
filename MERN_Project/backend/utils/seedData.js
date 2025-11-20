// Combined seed data for PES Buddy
// This file contains all static data for database seeding

export const canteens = [
	{ name: 'SKM Canteen', location: 'Near SKM Block', description: 'Quick bites and beverages' },
	{ name: 'GJBC Canteen', location: 'GJB Campus', description: 'South Indian breakfast and lunch' },
	{ name: 'BE Block 13th Floor', location: 'BE Block', description: 'North Indian and Chinese cuisine' },
	{ name: 'Hornbill Canteen', location: 'Main Campus', description: 'Fast food and snacks' }
];

export const menuItems = {
	SKM: [
		{ name: 'Chicken Puffs', price: 30, category: 'Snacks', description: 'Crispy chicken filled puffs', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=300&fit=crop' },
		{ name: 'Samosa', price: 20, category: 'Snacks', description: 'Golden crispy samosa', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
		{ name: 'Momos', price: 35, category: 'Snacks', description: 'Steamed momos with spicy sauce', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop' },
		{ name: 'Peri Peri Maggi', price: 40, category: 'Snacks', description: 'Spicy peri peri maggi', image: 'https://images.unsplash.com/photo-1672951758728-fa46e8e1d778?w=400&h=300&fit=crop' },
		{ name: 'Paneer Roll', price: 30, category: 'Snacks', description: 'Delicious paneer wrap', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop' }
	],
	GJBC: [
		{ name: 'Masala Dosa', price: 70, category: 'Breakfast', description: 'Crispy dosa with potato filling', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop' },
		{ name: 'Idli Vada', price: 60, category: 'Breakfast', description: 'Soft idli with crispy vada', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
		{ name: 'Poori Sagu', price: 65, category: 'Breakfast', description: 'Fluffy poori with potato curry', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
		{ name: 'Roti with Brinjal Curry', price: 80, category: 'Lunch', description: 'Soft roti with spicy brinjal curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
		{ name: 'Khara Bath + Kesari Bath', price: 55, category: 'Breakfast', description: 'Spicy & sweet bath combo', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' }
	],
	BEBlock: [
		{ name: 'Soups', price: 80, category: 'Starters', description: 'Hot and delicious soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop' },
		{ name: 'Manchurians', price: 120, category: 'Main Course', description: 'Crispy veg manchurian balls', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop' },
		{ name: 'Butter Rotis', price: 50, category: 'Breads', description: 'Soft butter rotis', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
		{ name: 'Biryanis', price: 140, category: 'Main Course', description: 'Aromatic veg biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
		{ name: 'PESU Special Meals', price: 160, category: 'Main Course', description: 'Complete special thali', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop' }
	],
	Hornbill: [
		{ name: 'Cheesecakes', price: 100, category: 'Desserts', description: 'Creamy cheesecake slice', image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop' },
		{ name: 'Noodles', price: 120, category: 'Main Course', description: 'Hakka noodles with veggies', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop' },
		{ name: 'Ice Creams', price: 100, category: 'Desserts', description: 'Assorted ice cream flavors', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
		{ name: 'Milkshakes', price: 90, category: 'Beverages', description: 'Thick and creamy milkshakes', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
		{ name: 'PESU Chinese Combo', price: 160, category: 'Main Course', description: 'Special Chinese combo meal', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop' }
	]
};

export const scooters = [
	{
		driverName: 'Rahul',
		vehicleNumber: 'KA-01-AB-1234',
		route: 'GJBC ↔ OAT',
		fare: 10,
		distance: '2 km',
		available: true
	},
	{
		driverName: 'Kishan',
		vehicleNumber: 'KA-01-CD-5678',
		route: 'SKM ↔ BE BLOCK',
		fare: 12.5,
		distance: '3 km',
		available: true
	},
	{
		driverName: 'Raj',
		vehicleNumber: 'KA-01-EF-9012',
		route: 'MRD BLOCK ↔ F BLOCK',
		fare: 9.8,
		distance: '2 km',
		available: true
	},
	{
		driverName: 'Deepak',
		vehicleNumber: 'KA-01-GH-3456',
		route: 'GJBC ↔ OAT',
		fare: 9,
		distance: '2 km',
		available: true
	},
	{
		driverName: 'Ravi',
		vehicleNumber: 'KA-01-IJ-7890',
		route: 'SKM ↔ BE BLOCK',
		fare: 15,
		distance: '3 km',
		available: true
	}
];

export const users = [
	{
		name: 'Test User',
		srn: 'PES1UG21CS001',
		email: 'test@pes.edu',
		password: 'test123'
	}
];

export const expenseCategories = ['Food', 'Travel', 'Study Materials', 'Miscellaneous'];

export default {
	canteens,
	menuItems,
	scooters,
	users,
	expenseCategories
};
