import dotenv from 'dotenv';
import { connectDB } from './backend/config/db.js';
import User from './backend/models/User.js';
import Canteen from './backend/models/Canteen.js';
import MenuItem from './backend/models/MenuItem.js';
import Scooter from './backend/models/Scooter.js';
import { canteens, menuItems, scooters, users } from './backend/utils/seedData.js';

dotenv.config();

const importData = async () => {
	try {
		await connectDB();
		// Clear existing
		await Canteen.deleteMany();
		await MenuItem.deleteMany();
		await Scooter.deleteMany();
		await User.deleteMany();

		// Insert canteens then their menu
		const createdCanteens = await Canteen.insertMany(canteens);
		const menuToInsert = [];
		
		for (const c of createdCanteens) {
			// Match canteen name with menu items (SKM, GJBC, BEBlock, Hornbill)
			let canteenKey = '';
			if (c.name.includes('SKM')) canteenKey = 'SKM';
			else if (c.name.includes('GJBC')) canteenKey = 'GJBC';
			else if (c.name.includes('BE Block')) canteenKey = 'BEBlock';
			else if (c.name.includes('Hornbill')) canteenKey = 'Hornbill';
			
			const canteenMenu = menuItems[canteenKey] || [];
			for (const m of canteenMenu) {
				menuToInsert.push({ 
					name: m.name, 
					price: m.price, 
					category: m.category,
					canteen: c._id, 
					description: m.description 
				});
			}
		}
		await MenuItem.insertMany(menuToInsert);

		// Insert scooters with proper schema mapping
		const scootersToInsert = scooters.map((s, idx) => ({
			scooterId: `SCOOT-${101 + idx}`,
			driverName: s.driverName,
			farePerKm: s.fare,
			available: s.available,
			vehicleNumber: s.vehicleNumber,
			route: s.route
		}));
		await Scooter.insertMany(scootersToInsert);

		// Insert demo user
		for (const u of users) {
			await User.create(u);
		}

		console.log('✅ Data Imported Successfully');
		process.exit();
	} catch (err) {
		console.error('❌ Error importing data:', err);
		process.exit(1);
	}
};

const deleteData = async () => {
	try {
		await connectDB();
		await Canteen.deleteMany();
		await MenuItem.deleteMany();
		await Scooter.deleteMany();
		await User.deleteMany();
		console.log('Data Deleted');
		process.exit();
	} catch (err) {
		console.error('Error deleting data:', err);
		process.exit(1);
	}
};

const run = async () => {
	const arg = process.argv[2];
	if (arg === '--import') await importData();
	else if (arg === '--delete') await deleteData();
	else console.log('Usage: node seeder.js --import | --delete');
};

run();
