# PES Buddy - MERN Stack Application

## Overview
PES Buddy is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for college students to manage food orders, scooter bookings, and expense tracking.

## Project Structure

```
MERN_Project/
├── package.json                  # Root package.json with dev scripts
├── seeder.js                     # Database seeder
├── server.js                     # Server entry point (delegates to backend/)
├── README.md                     # This file
│
├── backend/                      # Backend Server
│   ├── .env                      # Backend environment variables
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Main server file
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route handlers
│   │   ├── authController.js     # Auth logic (login/register)
│   │   ├── doormatoController.js # Food ordering logic
│   │   ├── expenseController.js  # Expense tracking logic
│   │   └── scootigoController.js # Scooter booking logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Canteen.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Scooter.js
│   │   └── Expense.js
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── doormatoRoutes.js     # /api/doormato/*
│   │   ├── expenseRoutes.js      # /api/expense/*
│   │   └── scootigoRoutes.js     # /api/scootigo/*
│   └── utils/                    # Utilities
│       └── seedData.js           # Consolidated seed data
│
└── frontend/                     # React Frontend
    ├── index.html                # HTML entry point
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js        # Tailwind CSS configuration
    ├── postcss.config.js         # PostCSS configuration
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Main App component
        ├── index.css             # Global styles (Tailwind)
        ├── components/           # Shared components
        │   ├── Header.jsx        # Navigation header
        │   ├── Footer.jsx        # Site footer
        │   └── ProtectedRoute.jsx
        ├── context/              # React Context
        │   ├── AuthContext.jsx   # User authentication state
        │   └── CartContext.jsx   # Shopping cart state
        ├── pages/                # Page components
        │   ├── Dashboard.jsx
        │   ├── ExpenseTracker.jsx
        │   ├── NotFound.jsx
        │   ├── Auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── Doormato/
        │   │   ├── CanteenList.jsx
        │   │   ├── Menu.jsx
        │   │   └── Cart.jsx
        │   └── Scootigo/
        │       ├── Scootigo.jsx
        │       └── BookingDetails.jsx
        └── services/             # API service layer
            ├── api.js            # Axios instance
            ├── authService.js
            ├── doormatoService.js
            ├── expenseService.js
            └── scootigoService.js
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time WebSocket
- **Context API** - State management

## Features

### 1. Authentication System
- User registration with name, SRN, email, and password
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes requiring authentication

### 2. Doormato (Food Ordering)
- Browse canteens on campus
- View menu items for each canteen
- Add items to cart with quantity
- Place orders (requires authentication)
- Real-time cart management

### 3. Scootigo (Scooter Booking)
- View available scooters
- See driver details and fare per km
- Book scooters for rides
- Automatic fare calculation based on distance

### 4. Expense Tracker
- Add expenses with category, amount, and notes
- View expense history
- Track spending over time
- User-specific expense management

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user

### Doormato (`/api/doormato`)
- `GET /canteens` - Get all canteens
- `GET /menu/:canteenId` - Get menu for specific canteen
- `POST /order` - Place order (protected)

### Scootigo (`/api/scootigo`)
- `GET /scooters` - Get available scooters
- `POST /book` - Book scooter (protected)

### Expense Tracker (`/api/expense`)
- `GET /` - Get user expenses (protected)
- `POST /` - Add new expense (protected)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
   This will install dependencies for root, server, and client.

2. **Configure environment variables:**
   
   The `.env` files have been created with default values:
   - `MONGO_URI=mongodb://127.0.0.1:27017/pes-buddy`
   - `JWT_SECRET=your_jwt_secret_key_change_in_production`
   - `PORT=5000`

   **Important:** Change `JWT_SECRET` in production!

3. **Start MongoDB:**
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```
   This creates sample data:
   - 2 canteens with menu items
   - 2 scooters
   - 1 demo user (srn: 01ABC, password: password)

### Running the Application

#### Development Mode (Recommended)

**Option 1: Run both servers concurrently**
```bash
npm run dev
```
This starts both backend and frontend together using `concurrently`.

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
npm run server
# or
cd backend && npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
# or
cd frontend && npm run dev
```

#### Production Mode
```bash
# Build the frontend
cd frontend && npm run build

# Start the server
npm start
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/ (should return `{"ok":true,"message":"PES Buddy API"}`)

## Frontend-Backend Connection

### 1. API Configuration
The frontend connects to the backend via `frontend/src/services/api.js`:
```javascript
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});
```

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

### 4. Authentication Flow
1. User logs in via frontend form
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Axios interceptor attaches token to all requests:
   ```javascript
   API.interceptors.request.use(config => {
       const token = localStorage.getItem('pes_token');
       if (token) config.headers.Authorization = `Bearer ${token}`;
       return config;
   });
   ```
5. Backend middleware validates token on protected routes

## Database Schema

### User
```javascript
{
    name: String,
    srn: String (unique),
    email: String (unique),
    password: String (hashed)
}
```

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
        qty: Number
    }],
    total: Number,
    status: String (enum: placed, preparing, completed, cancelled)
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

## Testing

### Testing the Demo User
1. Navigate to http://localhost:5173/auth/login
2. Use credentials:
   - SRN: `01ABC`
   - Password: `password`
3. Test all features after login

### Testing New Registration
1. Go to http://localhost:5173/auth/register
2. Fill in the form with unique SRN and email
3. After registration, you'll be automatically logged in

## Common Issues & Solutions

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

### Token Not Working
**Problem:** Authentication fails despite valid token
**Solution:**
- Check `JWT_SECRET` matches in `.env`
- Clear localStorage and login again
- Verify token is being sent in Authorization header

## Scripts Reference

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

## Current Status

✅ **Completed:**
- Backend server running on port 5000 with WebSocket support
- Frontend server running on port 5173 with Socket.IO client
- MongoDB Atlas connected (cloud database)
- Database seeded with sample data
- CORS properly configured
- All API endpoints functional
- Authentication working with JWT
- **Real-time WebSocket communication enabled**
- **Live connection status indicator**
- **Real-time activity feed**
- **Live scooter availability updates**
- All features implemented:
  - User registration and login
  - Canteen browsing and menu viewing
  - Cart management and order placement
  - Scooter viewing and booking
  - Expense tracking
  - **Real-time notifications and updates**
- No compilation errors
- All dependencies installed

## Next Steps for Production

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

## Contributing

When adding new features:
1. Create models in `server/models/`
2. Add controllers in `server/controllers/`
3. Define routes in `server/routes/`
4. Create services in `client/src/services/`
5. Build UI components in `client/src/pages/` or `client/src/components/`
6. Update this README

## License

This project is for educational purposes.

---

**Current Version:** 1.0.0  
**Last Updated:** November 20, 2025
**Status:** ✅ Fully Functional
