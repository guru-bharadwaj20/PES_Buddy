import dotenv from 'dotenv';
import { connectDB } from './server/config/db.js';
import User from './server/models/User.js';
import Canteen from './server/models/Canteen.js';
import MenuItem from './server/models/MenuItem.js';
import Scooter from './server/models/Scooter.js';

dotenv.config();

const sampleCanteens = [
	{ name: 'Central Canteen', description: 'Tasty meals near the main block' },
	{ name: 'Girls Canteen', description: 'Quick bites and beverages' }
];

const sampleMenu = [
	{ name: 'Masala Dosa', price: 50 },
	{ name: 'Idli (2)', price: 20 },
	{ name: 'Coffee', price: 15 },
	{ name: 'Burger', price: 60 }
];

const sampleScooters = [
	{ scooterId: 'SCOOT-101', driverName: 'Ravi', farePerKm: 12, available: true },
	{ scooterId: 'SCOOT-102', driverName: 'Priya', farePerKm: 10, available: true }
];

const importData = async () => {
	try {
		await connectDB();
		// Clear existing
		await Canteen.deleteMany();
		await MenuItem.deleteMany();
		await Scooter.deleteMany();
		await User.deleteMany();

		// Insert canteens then their menu
		const createdCanteens = await Canteen.insertMany(sampleCanteens);
		const menuToInsert = [];
		for (const c of createdCanteens) {
			for (const m of sampleMenu) {
				menuToInsert.push({ ...m, canteen: c._id, description: `${m.name} from ${c.name}` });
			}
		}
		await MenuItem.insertMany(menuToInsert);

		// scooters
		await Scooter.insertMany(sampleScooters);

		// demo user
		await User.create({ name: 'Demo User', srn: '01ABC', email: 'demo@pes.edu', password: 'password' });

		console.log('Data Imported');
		process.exit();
	} catch (err) {
		console.error('Error importing data:', err);
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
