# 🚀 PES Buddy

Full-stack MERN + Socket.io campus utilities platform featuring **Doormato** (food ordering), **Scootigo** (scooter rentals), **Expense Tracker** (weekly budgeting), and **Admin Portal** (monitoring & management). Frontend (Vite + React + Tailwind) lives in `/frontend`, backend (Express + MongoDB + Socket.io) in `/backend`.

---

## ✨ Core Features
- Secure JWT authentication (register, login, profile update, password change)
- **Doormato:** Browse canteens, view menus, add to cart, place orders, track order history
- **Scootigo:** View available scooters, book rides, check booking details and history
- **Expense Tracker:** Add expenses, categorize spending, track weekly budgets with visual insights
- Real-time notifications for order updates, booking confirmations, and system alerts
- Admin dashboards for managing orders, bookings, and viewing analytics
- Cart management with real-time updates via Context API
- Responsive dark-themed UI (black / slate / cyan / emerald accents) using Tailwind
- Legacy C implementation preserved for reference in `/legacy/C_Program/`

---

## 🛠 Tech Stack
**Frontend:** React 18, Vite, React Router DOM, Tailwind CSS 3, Axios, Socket.io client, Context API  
**Backend:** Node.js, Express 4, MongoDB (Mongoose), Socket.io  
**Auth:** JWT (access token persisted as `pes_token` in localStorage)  
**Real-time:** Socket.io for notifications and live updates  
**Styling:** Tailwind utility classes + custom dark gradient theme  
**Tooling:** Nodemon (backend dev), Vite HMR (frontend), Concurrently (root dev script), Seeder utility  

---

## 📦 Monorepo Scripts (root `package.json`)
```bash
# Run both frontend & backend in dev mode
npm run dev

# Install dependencies for both
npm run install-all

# Start only backend
npm run server

# Start only frontend
npm run client

# Seed database with sample data
node seeder.js --import
```

Frontend scripts (`frontend/package.json`): `npm run dev`, `build`, `preview`, `lint`  
Backend scripts (`backend/package.json`): `npm run dev`, `start`  

---

## 🚀 Installation & Setup
Clone & install:
```bash
git clone https://github.com/guru-bharadwaj20/PES_Buddy.git
cd PES_Buddy/MERN_Project
npm run install-all
```

Environment variables:
```bash
# backend/.env
PORT=5000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Strong Secret>
NODE_ENV=development

# frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Seed the database (optional):
```bash
node seeder.js --import
# Creates demo user: SRN=01ABC, password=password
# Populates canteens, menu items, and scooters
```

Run development:
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:5000/api
```

Build frontend for production:
```bash
cd frontend
npm run build
```

---

## 🔌 API Endpoints Summary
| Domain | Method | Path | Description |
|--------|--------|------|-------------|
| **Auth** | POST | /api/auth/register | Register new user |
| Auth | POST | /api/auth/login | Login and receive JWT token |
| Auth | GET | /api/auth/profile | Get user profile (protected) |
| Auth | PUT | /api/auth/profile | Update profile (protected) |
| **Doormato** | GET | /api/doormato/canteens | List all canteens |
| Doormato | GET | /api/doormato/menu/:canteenId | Get menu for specific canteen |
| Doormato | POST | /api/doormato/order | Place food order (protected) |
| Doormato | GET | /api/doormato/orders | Get user's order history (protected) |
| **Scootigo** | GET | /api/scootigo/scooters | List available scooters |
| Scootigo | POST | /api/scootigo/book | Book a scooter (protected) |
| Scootigo | GET | /api/scootigo/bookings | Get user's booking history (protected) |
| Scootigo | GET | /api/scootigo/bookings/:id | Get booking details (protected) |
| **Expense** | GET | /api/expense | List user expenses (protected) |
| Expense | POST | /api/expense | Add new expense (protected) |
| Expense | DELETE | /api/expense/:id | Delete expense (protected) |
| **Notifications** | GET | /api/notifications | Get user notifications (protected) |
| Notifications | PUT | /api/notifications/:id/read | Mark notification as read (protected) |
| Notifications | DELETE | /api/notifications/:id | Delete notification (protected) |
| **Admin** | GET | /api/admin/orders | List all orders (admin only) |
| Admin | GET | /api/admin/bookings | List all bookings (admin only) |
| Admin | GET | /api/admin/stats/orders | Get order statistics (admin only) |
| Admin | GET | /api/admin/stats/bookings | Get booking statistics (admin only) |

---

## 🧩 Real-time Events (Socket.io)
- **Connection:** Client connects on mount, sends user ID for authentication
- **Notifications:** Server emits `notification` event when new notifications are created
- **Order Updates:** Real-time order status changes pushed to users
- **Booking Confirmations:** Instant booking updates via socket events
- Server manages user-specific rooms for targeted event delivery

---

## 🗂 Frontend Folder Structure
```bash
frontend/src/
├── services/
│   ├── api.js               # Axios instance with interceptors
│   ├── authService.js       # Authentication API calls
│   ├── doormatoService.js   # Food ordering API calls
│   ├── scootigoService.js   # Scooter booking API calls
│   ├── expenseService.js    # Expense tracking API calls
│   ├── notificationService.js # Notification API calls
│   └── socketService.js     # Socket.io client setup
├── components/
│   ├── Header.jsx           # Navigation bar with auth state
│   ├── Footer.jsx           # Site footer
│   ├── ProtectedRoute.jsx   # Route guard for authenticated users
│   └── AdminProtectedRoute.jsx # Route guard for admin users
├── context/
│   ├── AuthContext.jsx      # Global auth state management
│   └── CartContext.jsx      # Shopping cart state management
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Dashboard.jsx        # User dashboard with quick stats
│   ├── Profile.jsx          # User profile management
│   ├── Notifications.jsx    # Notification center
│   ├── ExpenseTracker.jsx   # Expense management interface
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Doormato/
│   │   ├── CanteenList.jsx  # Browse canteens
│   │   ├── Menu.jsx         # View menu & add to cart
│   │   ├── Cart.jsx         # Review cart & checkout
│   │   └── MyOrders.jsx     # Order history
│   ├── Scootigo/
│   │   ├── Scootigo.jsx     # Browse & book scooters
│   │   └── BookingDetails.jsx # Booking information
│   └── Admin/
│       ├── AdminLogin.jsx
│       ├── AdminRegister.jsx
│       ├── AdminHome.jsx
│       ├── AdminPortal.jsx
│       ├── AdminProfile.jsx
│       ├── DoormatoPortal.jsx # Manage food orders
│       └── ScootigoPortal.jsx # Manage scooter bookings
├── App.jsx
└── main.jsx
```

## 🗂 Backend Folder Structure
```bash
backend/
├── config/
│   └── db.js                # MongoDB connection
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── doormatoController.js # Food ordering logic
│   ├── scootigoController.js # Scooter booking logic
│   ├── expenseController.js  # Expense tracking logic
│   └── notificationController.js # Notification logic
├── middleware/
│   ├── authMiddleware.js    # JWT verification & role checks
│   └── validateInput.js     # Request validation
├── models/
│   ├── User.js              # User schema with roles
│   ├── Canteen.js           # Canteen schema
│   ├── MenuItem.js          # Menu item schema
│   ├── Order.js             # Order schema with status
│   ├── Scooter.js           # Scooter schema with availability
│   ├── Booking.js           # Booking schema
│   ├── Expense.js           # Expense schema with categories
│   └── Notification.js      # Notification schema
├── routes/
│   ├── authRoutes.js
│   ├── doormatoRoutes.js
│   ├── scootigoRoutes.js
│   ├── expenseRoutes.js
│   ├── notificationRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── errorHandler.js      # Centralized error handling
│   └── seedData.js          # Database seeding data
└── server.js                # Express + Socket.io server entry
```

---

## 🔐 Auth Flow
1. User registers or logs in → receives JWT token + user object
2. Token persisted as `pes_token` in localStorage, user data in AuthContext
3. Axios interceptor automatically adds `Authorization: Bearer <token>` to requests
4. Protected routes use `ProtectedRoute` / `AdminProtectedRoute` components
5. Socket.io connection authenticated via user ID sent on connection

---

## 🎨 Styling & Design
- Tailwind CSS utilities across all components
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`
- Dark theme: `bg-gray-900`, `bg-black` with gradient overlays
- Accent colors: cyan (`cyan-400`, `cyan-500`) and emerald (`emerald-400`, `emerald-500`)
- Glass morphism effects with `backdrop-blur` and transparency
- Consistent spacing, typography, and interactive hover states

---

## 🧪 Development Tips
- **Hot Reload:** Both frontend and backend support hot reloading in dev mode
- **Socket Debug:** Check browser console and server logs for socket connection events
- **API Testing:** Use demo credentials (SRN: `01ABC`, password: `password`) for testing
- **Add Features:** Follow existing patterns in controllers, services, and pages
- **Seeder:** Run `node seeder.js --import` to reset database with fresh sample data
- **Clear Cache:** Delete `frontend/node_modules/.vite` if encountering white screen issues

---

## 📘 Legacy C Implementation
Original PES Buddy started as a C-based menu system (now in `legacy/C_Program/`):
- Text-based menus for different campus buildings (BeBLOC, Hornbill, SKM, GJBC)
- Simple user authentication with flat file storage
- Command-line interface for food ordering

Preserved for historical context and reference. The MERN implementation expands on these concepts with modern web technologies.

---

## 🔐 Demo Credentials
**Regular User:**  
SRN: `01ABC`  
Password: `password`

**Admin User:**  
Create via registration or seed script

---

## ✅ Roadmap Ideas
- Add payment gateway integration (Razorpay / Stripe)
- Implement real-time order tracking with map visualization
- Add review & rating system for canteens and scooters
- Implement role-based access control with multiple admin levels
- Add expense analytics with charts and budget recommendations
- Implement push notifications for mobile devices
- Add automated tests (Jest + React Testing Library / Supertest)
- Add rate limiting & security headers
- Docker containerization for easy deployment

---

## 🆘 Troubleshooting
| Issue | Fix |
|-------|-----|
| White screen on frontend | Check console for errors, clear Vite cache, verify imports |
| Socket not connecting | Verify `VITE_SOCKET_URL` matches backend, check CORS settings |
| 401 Unauthorized | Token may be expired or invalid, try logging in again |
| 404 API responses | Confirm `VITE_API_URL` matches backend port and routes exist |
| MongoDB connection error | Verify `MONGO_URI` is correct and database is accessible |
| Seeder errors | Ensure MongoDB is running and `MONGO_URI` is set correctly |

---

## 📄 License
Educational project; converted from legacy C prototype. Internal / Unspecified.

---

## ⚠️ Disclaimer
This is an educational project. Harden before production deployment:
- Rotate JWT secrets regularly
- Enable HTTPS
- Implement rate limiting
- Add input sanitization
- Use environment-specific configurations
- Add comprehensive logging and monitoring

---

**Updated:** November 24, 2025

Happy building! 🚀
