# 🚀 PES Buddy

Campus utilities in one MERN app: **Doormato** (food), **Scootigo** (rides), **Expense Tracker** (weekly budget), **Admin Portal** (monitor orders & bookings). Originated from legacy C code → modern real‑time platform.

📘 Short History
- Started as C menus in `C_Program/` → reimagined with React + Express + MongoDB.

🗂️ Project Layout (Simplified)
Active code under `MERN_Project/`:

```
MERN_Project/
	backend/
		controllers/ (auth, doormato, scootigo, expense)
		models/ (User, Canteen, MenuItem, Order, Booking, Scooter, Expense)
		routes/ (auth, doormato, scootigo, expense, admin)
		middleware/ (auth JWT protect)
		server.js (Express + Socket.IO)
	frontend/
		src/
			pages/Doormato/*
			pages/Scootigo/Scootigo.jsx
			pages/ExpenseTracker.jsx (mounted at /expense-tracker)
			pages/Admin/{AdminPortal,DoormatoPortal,ScootigoPortal}.jsx
			context/{AuthContext,CartContext}.jsx
			services/{api,authService,doormatoService,scootigoService,expenseService}.js
			components/{Header,Footer,ProtectedRoute}.jsx
	seeder.js (populates canteens, menu items, scooters, demo user)
```

Legacy C sources in `C_Program/` kept for reference.

<p align="center">
	<img src="https://github.com/guru-bharadwaj20/PES_Buddy/blob/main/Preview.png" alt="PES Buddy preview" style="max-width:100%;border-radius:8px;box-shadow:0 8px 24px rgba(11,61,145,0.12)" />
</p>

⭐ Features Glance
Auth • Canteens & Menus • Cart & Orders • Scooter Booking & Availability • Weekly Expense Tracking • Admin Dashboards • WebSockets • Dark Responsive UI

⚙️ Stack
Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT  
Frontend: React 18, Vite, Tailwind, Router, Axios  
Dev: Nodemon, Concurrent scripts, Seeder

🛠️ Quickstart
```powershell
cd MERN_Project; npm run install-all
node seeder.js --import   # optional
npm run dev                # concurrent
# or: npm run server / npm run client
```
Frontend http://localhost:5173 • API http://localhost:5000/api

🔐 Demo Credentials
SRN `01ABC` / password `password`

These are created by the seeder and can be used to login in the UI or via API.

🔌 API Quick Reference
Auth: register, login  
Doormato: canteens, menu/:id, order  
Scootigo: scooters, book  
Expense: list, add  
Admin: orders, bookings, stats/orders, stats/bookings

🔄 Auth Notes
JWT saved as `pes_token` (localStorage) → Axios adds Bearer automatically.

🎨 Design Notes
Dark glass theme • Consistent spacing • Responsive header & mobile menu.

📟 Legacy C
Original menus & logic retained for historical context in `C_Program/`.

🧭 Enhancements
Roles • Pagination • Metrics cache • Validation • Tests • Docker • Payment flow.

📄 License & Credits
Educational project; converted from C prototype.

If you want, I can also:
- generate a Postman collection for the API
- add a small `README.md` in `server/` and `client/` with per-folder commands
- add Docker support for local testing

Enjoy building PES Buddy — tell me which follow-up you want and I'll implement it.

---

⚠️ Disclaimer
Harden before production (rotate secrets, HTTPS, rate limit, roles).

**Updated:** Nov 20, 2025
