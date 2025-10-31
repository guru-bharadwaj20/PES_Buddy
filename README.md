# PES Buddy

A full-stack MERN application (Doormato food ordering, Scootigo scooter booking, and an Expense Tracker) originally prototyped as a C program and later converted into this modern web application.

🔵 Short history
---------------
- This repository began as a collection of C programs in the `C_Program/` folder (legacy student utilities and menu-based tools). The original C sources served as the functional spec and UX inspiration.
- The project was then reimplemented end-to-end as a Full Stack application (Node.js + Express + MongoDB backend, React + Vite frontend) to provide a polished, networked experience with persistent data and modern UI.

🔵 What this project contains
-------------------------
- Backend (server/) — Express API, Mongoose models, JWT auth, controllers and routes for Doormato, Scootigo, Expense features.
- Frontend (client/) — React + Vite app with context for Auth and Cart, service wrappers for API calls, and pages/components for the three product areas.
- Seeder (`seeder.js`) — quick script to populate sample canteens, menu items, scooters and a demo user.
- Legacy C code (`C_Program/`) — original implementation and menus (kept for reference).

<p align="center">
	<img src="https://raw.githubusercontent.com/guru-bharadwaj20/PES_Buddy/Preview.png" alt="PES Buddy preview" style="max-width:100%;border-radius:8px;box-shadow:0 8px 24px rgba(11,61,145,0.12)" />
</p>

🔵 Key features
------------
- Authentication using SRN + password (bcrypt + JWT)
- Doormato: list canteens, view menus, add to cart, place orders
- Scootigo: list scooters, book a scooter, simple booking confirmation
- Expense Tracker: add and list personal expenses (protected by auth)
- A consistent, themed UI (dark-blue/light-blue/white/black) across all pages

🔵 Tech stack
----------
- Backend: Node.js, Express, MongoDB (Mongoose), bcryptjs, jsonwebtoken
- Frontend: React, Vite, react-router, axios
- Dev: nodemon (server), Vite dev server (client)

🔵 Quickstart (development)
------------------------
🔵 Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally (or a MongoDB URI / Atlas cluster)

1) Install dependencies

PowerShell (from repository root):

```powershell
# Install server deps
cd 'C:\Users\HPSMG\Desktop\pes-buddy\server'
npm install

# Install client deps
cd '..\client'
npm install
```

2) Seed sample data (optional but recommended)

This will create demo canteens, menu items, scooters and a demo user.

```powershell
cd 'C:\Users\HPSMG\Desktop\pes-buddy'
$env:MONGO_URI='mongodb://127.0.0.1:27017/pes-buddy'
$env:JWT_SECRET='devsecret'
node .\seeder.js --import
```

If you prefer to delete seeded data:

```powershell
node .\seeder.js --delete
```

3) Run the backend and frontend

Open two terminals (or use a multiplexer). Example commands:

```powershell
# Start backend (from server folder)
cd 'C:\Users\HPSMG\Desktop\pes-buddy\server'
npm run dev

# Start frontend (from client folder)
cd 'C:\Users\HPSMG\Desktop\pes-buddy\client'
npm run dev
```

- Frontend will be available at: http://localhost:5173/
- Backend API base: http://localhost:5000/api

🔵 Demo credentials (seeded)
-------------------------
- SRN: `01ABC`
- Email: `demo@pes.edu`
- Password: `password`

These are created by the seeder and can be used to login in the UI or via API.

🔵 API quick reference
-------------------
- POST /api/auth/register — register new user
- POST /api/auth/login — login (body: { srn, password })
- GET /api/doormato/canteens — list canteens
- GET /api/doormato/menu/:canteenId — list menu items for a canteen
- POST /api/doormato/order — create order (protected)
- GET /api/scootigo/scooters — list scooters
- POST /api/scootigo/book — book scooter (protected)
- GET /api/expense — list user expenses (protected)
- POST /api/expense — add expense (protected)

🔵 Notes about auth and client
---------------------------
- The frontend stores the JWT in localStorage under the key `pes_token` and sends it as a Bearer token in Authorization headers.
- Protected endpoints require a valid token. The frontend's AuthContext handles login/register and token persistence.

🔵 Design & UX notes
------------------
- A consistent theme (dark blue / light blue / white / black) is implemented in `client/src/index.css` and applied across pages.
- Header is split into left (brand), center (feature nav) and right (Login/Register or user) zones.
- The layout uses CSS utilities and cards for spacing and visual hierarchy.

🔵 Where the C code fits in
------------------------
- The original C programs live in `C_Program/` and include menu text files and a `PesBuddy.c` entry. Those files were used as the starting functional spec and for porting behavior (menus, options, and sample users) into the MERN implementation.

🔵 Further improvements you could add
---------------------------------
- Persistent bookings model for Scootigo (currently bookings are simple responses)
- Input validation on the server (express-validator)
- Unit & integration tests (Jest / Supertest)
- Dockerfile and docker-compose to run MongoDB + app together for reproducible setups
- CI pipeline and automated seeding for pull requests

🔵 License & credits
-----------------
This project is provided as-is for learning and demonstration. You (the author) converted the original C implementation into this full-stack MERN application.

If you want, I can also:
- generate a Postman collection for the API
- add a small `README.md` in `server/` and `client/` with per-folder commands
- add Docker support for local testing

Enjoy building PES Buddy — tell me which follow-up you want and I'll implement it.

---

Disclaimer
----------
This repository and the code within are provided for educational and demonstration purposes only. While efforts were made to implement secure practices (password hashing, token-based authentication), this project is not production audited. Do not use the default secrets or seeded demo credentials in a production environment. Always review, harden, and test before deploying publicly.
