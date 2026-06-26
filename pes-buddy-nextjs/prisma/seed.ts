import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PES Buddy database...");

  // Admin user
  const adminHash = await bcrypt.hash("Admin@123", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@pesbuddy.com" },
    update: {},
    create: {
      name: "PES Buddy Admin",
      srn: "ADMIN000000001",
      email: "admin@pesbuddy.com",
      password: adminHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Demo student
  const studentHash = await bcrypt.hash("Student@123", 12);
  const student = await db.user.upsert({
    where: { srn: "PES1UG22CS001" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@pes.edu",
      password: studentHash,
      srn: "PES1UG22CS001",
      role: "CUSTOMER",
    },
  });
  console.log("✅ Demo student created:", student.srn);

  // Canteens
  const canteens = await Promise.all([
    db.canteen.upsert({
      where: { name: "GJBC Canteen" },
      update: {},
      create: {
        name: "GJBC Canteen",
        location: "GJBC Block, Ground Floor",
        description: "The most popular canteen on campus. Hot meals, snacks, and beverages all day!",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop",
        isActive: true,
      },
    }),
    db.canteen.upsert({
      where: { name: "SKM Canteen" },
      update: {},
      create: {
        name: "SKM Canteen",
        location: "SKM Block, 2nd Floor",
        description: "Known for the best South Indian food on campus.",
        imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=400&fit=crop",
        isActive: true,
      },
    }),
    db.canteen.upsert({
      where: { name: "Main Block Cafe" },
      update: {},
      create: {
        name: "Main Block Cafe",
        location: "Admin Block, Ground Floor",
        description: "Premium cafe with freshly brewed coffee and bakery items.",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop",
        isActive: true,
      },
    }),
    db.canteen.upsert({
      where: { name: "Library Snack Bar" },
      update: {},
      create: {
        name: "Library Snack Bar",
        location: "Library Building, Ground Floor",
        description: "Quick snacks and energy drinks to keep you going through study sessions.",
        imageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=400&fit=crop",
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${canteens.length} canteens created`);

  const [gjbc, skm, mainCafe] = canteens;

  // Menu items for GJBC
  const gjbcItems = await Promise.all([
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: gjbc.id, name: "Veg Thali" } },
      update: {},
      create: { canteenId: gjbc.id, name: "Veg Thali", price: 60, category: "Meals", description: "Complete vegetarian meal with dal, rice, roti, and sabzi", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: gjbc.id, name: "Chicken Biryani" } },
      update: {},
      create: { canteenId: gjbc.id, name: "Chicken Biryani", price: 90, category: "Meals", description: "Aromatic basmati rice with tender chicken pieces", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: gjbc.id, name: "Masala Dosa" } },
      update: {},
      create: { canteenId: gjbc.id, name: "Masala Dosa", price: 45, category: "Breakfast", description: "Crispy dosa with spiced potato filling and chutneys", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: gjbc.id, name: "Samosa (2 pcs)" } },
      update: {},
      create: { canteenId: gjbc.id, name: "Samosa (2 pcs)", price: 15, category: "Snacks", description: "Crispy pastry filled with spiced potatoes and peas", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: gjbc.id, name: "Chai" } },
      update: {},
      create: { canteenId: gjbc.id, name: "Chai", price: 10, category: "Beverages", description: "Hot masala chai", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: gjbc.id, name: "Cold Coffee" } },
      update: {},
      create: { canteenId: gjbc.id, name: "Cold Coffee", price: 40, category: "Beverages", description: "Chilled coffee with milk and ice cream", available: true },
    }),
  ]);

  // Menu items for SKM
  const skmItems = await Promise.all([
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: skm.id, name: "Idli (3 pcs)" } },
      update: {},
      create: { canteenId: skm.id, name: "Idli (3 pcs)", price: 25, category: "Breakfast", description: "Steamed rice cakes with sambar and chutney", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: skm.id, name: "Vada (2 pcs)" } },
      update: {},
      create: { canteenId: skm.id, name: "Vada (2 pcs)", price: 20, category: "Breakfast", description: "Crispy fried lentil donuts", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: skm.id, name: "Curd Rice" } },
      update: {},
      create: { canteenId: skm.id, name: "Curd Rice", price: 35, category: "Meals", description: "Cooling yogurt rice with tempered spices", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: skm.id, name: "Rava Kesari" } },
      update: {},
      create: { canteenId: skm.id, name: "Rava Kesari", price: 20, category: "Sweets", description: "Sweet semolina dessert with saffron", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: skm.id, name: "Filter Coffee" } },
      update: {},
      create: { canteenId: skm.id, name: "Filter Coffee", price: 15, category: "Beverages", description: "Authentic South Indian filter coffee", available: true },
    }),
  ]);

  // Menu items for Main Cafe
  const cafeItems = await Promise.all([
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: mainCafe.id, name: "Cappuccino" } },
      update: {},
      create: { canteenId: mainCafe.id, name: "Cappuccino", price: 70, category: "Coffee", description: "Rich espresso with steamed milk foam", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: mainCafe.id, name: "Croissant" } },
      update: {},
      create: { canteenId: mainCafe.id, name: "Croissant", price: 50, category: "Bakery", description: "Buttery, flaky French pastry", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: mainCafe.id, name: "Club Sandwich" } },
      update: {},
      create: { canteenId: mainCafe.id, name: "Club Sandwich", price: 80, category: "Snacks", description: "Toasted sandwich with veggies and cheese", available: true },
    }),
    db.menuItem.upsert({
      where: { canteenId_name: { canteenId: mainCafe.id, name: "Chocolate Brownie" } },
      update: {},
      create: { canteenId: mainCafe.id, name: "Chocolate Brownie", price: 45, category: "Bakery", description: "Warm, fudgy chocolate brownie", available: true },
    }),
  ]);

  console.log(`✅ ${gjbcItems.length + skmItems.length + cafeItems.length} menu items created`);

  // Scooters
  const scooters = await Promise.all([
    db.scooter.upsert({
      where: { scooterId: "SC001" },
      update: {},
      create: { scooterId: "SC001", driverName: "Ravi Kumar", vehicleNumber: "KA 01 EF 1234", farePerKm: 10, available: true, maintenance: false },
    }),
    db.scooter.upsert({
      where: { scooterId: "SC002" },
      update: {},
      create: { scooterId: "SC002", driverName: "Suresh Babu", vehicleNumber: "KA 02 GH 5678", farePerKm: 12, available: true, maintenance: false },
    }),
    db.scooter.upsert({
      where: { scooterId: "SC003" },
      update: {},
      create: { scooterId: "SC003", driverName: "Mahesh Reddy", vehicleNumber: "KA 03 IJ 9012", farePerKm: 10, available: true, maintenance: false },
    }),
    db.scooter.upsert({
      where: { scooterId: "SC004" },
      update: {},
      create: { scooterId: "SC004", driverName: "Anand Raj", vehicleNumber: "KA 04 KL 3456", farePerKm: 15, available: true, maintenance: false },
    }),
    db.scooter.upsert({
      where: { scooterId: "SC005" },
      update: {},
      create: { scooterId: "SC005", driverName: "Vijay Sharma", vehicleNumber: "KA 05 MN 7890", farePerKm: 10, available: false, maintenance: true },
    }),
  ]);
  console.log(`✅ ${scooters.length} scooters seeded (4 available, 1 in maintenance)`);

  console.log("\n🎉 Seeding complete!");
  console.log("   Admin login:  admin@pesbuddy.com / Admin@123");
  console.log("   Student SRN:  PES1UG22CS001 / Student@123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
