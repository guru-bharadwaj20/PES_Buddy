// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = "CUSTOMER" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  srn: string;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Canteen & Menu Types ─────────────────────────────────────────────────────

export interface Canteen {
  id: string;
  name: string;
  location?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  available: boolean;
  category?: string | null;
  canteenId: string;
  canteen?: Canteen;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "PREPARING"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId?: string | null;
  canteenId?: string | null;
  name: string;
  price: number;
  quantity: number;
  menuItem?: MenuItem;
  canteen?: Canteen;
}

export interface Order {
  id: string;
  userId: string;
  canteenName?: string | null;
  total: number;
  totalAmount: number;
  status: OrderStatus;
  rejectionReason?: string | null;
  items: OrderItem[];
  user?: UserProfile;
  userName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Scootigo Types ───────────────────────────────────────────────────────────

export interface Scooter {
  id: string;
  scooterId: string;
  driverName?: string | null;
  vehicleNumber?: string | null;
  route?: string | null;
  farePerKm: number;
  available: boolean;
  maintenance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = "PENDING" | "ACTIVE" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Booking {
  id: string;
  userId: string;
  scooterId: string;
  driver: string;
  vehicleNumber?: string | null;
  pickup: string;
  destination: string;
  distance: number;
  farePerKm: number;
  totalFare: number;
  status: BookingStatus;
  user?: UserProfile;
  scooter?: Scooter;
  userName?: string | null;
  driverName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Expense Types ────────────────────────────────────────────────────────────

export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Study Materials"
  | "Miscellaneous";

export interface Expense {
  id: string;
  userId: string;
  category: string;
  amount: number;
  note?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType = "ORDER" | "BOOKING" | "EXPENSE" | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string | null;
  read: boolean;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  canteenId: string;
  canteenName: string;
}

export interface Cart {
  items: CartItem[];
  canteenName: string;
  canteenId: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  orderRevenue: number;
  bookingRevenue: number;
}

// ─── Socket Events ────────────────────────────────────────────────────────────

export interface SocketOrderNew {
  orderId: string;
  userId: string;
  userName: string;
  canteenName: string;
  total: number;
  itemCount: number;
  timestamp: Date;
}

export interface SocketOrderStatus {
  orderId: string;
  userId: string;
  status: OrderStatus;
  rejectionReason?: string;
  timestamp: Date;
}

export interface SocketScooterBooked {
  scooterId: string;
  available: boolean;
  bookedBy: string;
  timestamp: Date;
}

export interface SocketNotification {
  title: string;
  message: string;
  icon: string;
}
