# 🚀 PES Buddy – MERN Stack Application

## 📘 Overview
Campus companion: order food (Doormato), book scooters (Scootigo), track weekly spending, and monitor operations via a fully separated Customer & Admin Portal system. Built with the MERN stack + Socket.IO for real‑time updates.

## ⚙️ Stack
Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT  
Frontend: React 18, Vite, Tailwind, React Router, Axios, Context API  
Dev: Nodemon, Concurrent scripts, Seeder

## ⭐ Features (Quick Glance)
Customer Auth • Role-based Admin Auth • Separate Admin/Customer UI + routing • Canteens & Menus • Cart & Orders • Scooter Booking & Availability • Weekly Expense Tracking (limits + warnings) • Admin Dashboards (Orders, Bookings, Live Aggregated Stats) • Real‑Time Events • Dark / Glassmorphic Responsive UI

## 🔌 API (Core)

Auth:
`POST /api/auth/register` (role defaults to customer)
`POST /api/auth/login` (uses body flag `isAdmin` for admin portal login separation)

Doormato:
`GET /api/doormato/canteens`  
`GET /api/doormato/menu/:id`  
`POST /api/doormato/order`

Scootigo:
`GET /api/scootigo/scooters`  
`POST /api/scootigo/book`

Expense:
`GET /api/expense`  
`POST /api/expense`

Admin (Protected – must authenticate as admin):
`GET /api/admin/orders`  
`GET /api/admin/bookings`  
`GET /api/admin/stats/orders`  
`GET /api/admin/stats/bookings`  
`GET /api/admin/stats/dashboard` (NEW – consolidated quick stats: totalOrders, totalBookings, totalUsers, totalRevenue)

## 🛠️ Setup (Dev)

Prereqs: Node.js ≥18, running MongoDB

Install: `npm run install-all` • Seed: `npm run seed` • Dev: `npm run dev` (concurrent) or `npm run server` + `npm run client` • Frontend http://localhost:5173 (or dynamic alternative if 5173 busy) • API http://localhost:5000

Production: build frontend (`cd frontend && npm run build`) then `npm start` at root.

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/ (should return `{"ok":true,"message":"PES Buddy API"}`)

## 🔄 Frontend ↔ Backend

Axios base: `http://localhost:5000/api` • Token auto-attached if present.

### 2. Vite Proxy
The `frontend/vite.config.js` includes a proxy configuration:
```javascript
proxy: {
    '/api': 'http://localhost:5000'
}
```

### 3. CORS Configuration
The backend server allows frontend requests:
```javascript
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
```

Auth Flow:
1. Registration (customer or via Admin Portal for admin) does NOT auto-login (user must explicitly Sign In).  
2. Login sends `isAdmin: true` only from admin portal pages; backend enforces role separation.  
3. JWT stored as `pes_token` + user object `pes_user` with `role`.  
4. Axios attaches Bearer; protected routes verify token & role.

## 🗄️ Key Models (Simplified)

Order: user + items (+quantity, canteen), total/totalAmount, status.  
Booking: user + scooter + route + distance + fare + status.  
Expense: user + category + amount + date.  
User: name, srn, email, password (hashed), role: `customer | admin` (NEW) – defaults to `customer`.

### Canteen
```javascript
{
    name: String (unique),
    location: String,
    description: String
}
```

### MenuItem
```javascript
{
    name: String,
    price: Number,
    canteen: ObjectId (ref: Canteen),
    description: String,
    available: Boolean
}
```

### Order
```javascript
{
    user: ObjectId (ref: User),
    canteenName: String,
    items: [{
        menuItem: ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        canteen: ObjectId (ref: Canteen)
    }],
    total: Number,        // legacy alias retained
    totalAmount: Number,  // used for dashboards; ensure consistency going forward
    status: String (enum: placed, preparing, completed, cancelled, pending)
}
```

### Booking
```javascript
{
    user: ObjectId (ref: User),
    scooter: ObjectId (ref: Scooter),
    driver: String,
    vehicleNumber: String,
    pickup: String,
    destination: String,
    distance: Number,
    farePerKm: Number,
    totalFare: Number,
    status: String (enum: pending, ongoing, completed, cancelled)
}
```

### Scooter
```javascript
{
    scooterId: String (unique),
    driverName: String,
    farePerKm: Number,
    available: Boolean
}
```

### Expense
```javascript
{
    user: ObjectId (ref: User),
    category: String,
    amount: Number,
    note: String,
    date: Date
}
```

## 🧪 Quick Test

Demo user: SRN `01ABC` / password `password` (after seed) → login → explore.

### Testing New Customer Registration
1. Go to http://localhost:5173/auth/register  
2. Fill form (unique SRN & email)  
3. Submit → success message → manually click Sign In (no auto-login)  

### Testing Admin Flow
1. Visit http://localhost:5173/admin  
2. Click “Register as Admin” (creates user with role=admin)  
3. After success → manually navigate to “Admin Sign In”  
4. Gain access to `/admin/dashboard`, `/admin/profile`, etc.

## 🧯 Common Issues

### MongoDB Connection Error
**Problem:** `MongoDB connection error`
**Solution:** 
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` file
- Verify MongoDB is accessible at the specified URI

### Port Already in Use
**Problem:** `EADDRINUSE: address already in use`
**Solution:**
- Change `PORT` in `.env` file
- Or kill the process using the port

### CORS Errors
**Problem:** Cross-origin request blocked
**Solution:**
- Verify backend CORS configuration includes frontend URL
- Check that both servers are running
- Clear browser cache

### Role / Token Issues
**Problem:** Customer tries admin route or admin uses customer login path.  
**Solution:** Ensure correct portal used (admin pages send `isAdmin: true`). Clear localStorage and re-login if role mismatch.

## 📜 Scripts

### Root Level
- `npm run install-all` - Install all dependencies
- `npm start` - Start production server
- `npm run server` - Start backend in dev mode
- `npm run client` - Start frontend in dev mode
- `npm run seed` - Import sample data
- `npm run seed:delete` - Delete all data

### Server
- `npm start` - Start server (production)
- `npm run dev` - Start server with nodemon (development)

### Client
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📊 Status

✅ **Implemented & Stable**
- Auth + protected routes
- Persistent Orders & Bookings
- Admin Portal (orders + bookings dashboards)
- Enhanced Expense Tracker (weekly budget logic from C prototype)
- Real‑time WebSocket updates (orders, bookings availability, expenses, notifications)
- Canteen & driver performance aggregation (client side + endpoints for stats)
- Modern responsive UI (About, Contact, Profile redesigns + consistent button styling)
- Seeding script populates users, canteens, menu items, scooters
- No build / compile errors in current state

🚀 **Ready For Extension**
- Cache dashboard stats (current call aggregates live each request)
- Pagination / server-side filtering for admin data tables
- Fine-grained permission layers beyond simple role flag
- Payment simulation flow for Scootigo "Pay Now" UI (currently placeholder)
- Profile update & password endpoints (currently mocked / pending real implementation)

## 🧭 Next Steps

1. **Security:**
   - Change `JWT_SECRET` to a strong random string
   - Use environment-specific `.env` files
   - Add rate limiting
   - Implement HTTPS

2. **Database:**
   - Use MongoDB Atlas or other cloud database
   - Update `MONGO_URI` in `.env`
   - Add database indexes for performance

3. **Frontend:**
   - Build frontend: `cd client && npm run build`
   - Serve static files from Express
   - Configure proper environment variables

4. **Deployment:**
   - Deploy backend to Heroku, Railway, or similar
   - Deploy frontend to Vercel, Netlify, or serve from backend
   - Set up CI/CD pipeline

## 🤝 Contributing

When adding new features:
1. Create models in `server/models/`
2. Add controllers in `server/controllers/`
3. Define routes in `server/routes/`
4. Create services in `client/src/services/`
5. Build UI components in `client/src/pages/` or `client/src/components/`
6. Update this README

## 📄 License

This project is for educational purposes.

---

**Version:** 1.2.0 • **Updated:** Nov 22, 2025 • Admin & Customer portals fully separated; live dashboard stats & admin profile added
