import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules for user registration
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name should only contain letters and spaces'),
  
  body('srn')
    .trim()
    .notEmpty().withMessage('SRN is required')
    .matches(/^PES[12]UG\d{2}[A-Z]{2}\d{3}$/i).withMessage('Invalid SRN format (e.g., PES1UG21CS001)'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'admin']).withMessage('Invalid role'),
  
  handleValidationErrors
];

// Validation rules for user login
export const validateUserLogin = [
  body('srn')
    .trim()
    .notEmpty().withMessage('SRN is required')
    .matches(/^PES[12]UG\d{2}[A-Z]{2}\d{3}$/i).withMessage('Invalid SRN format'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  body('isAdmin')
    .optional()
    .isBoolean().withMessage('isAdmin must be a boolean'),
  
  handleValidationErrors
];

// Validation rules for forgot password
export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Validation rules for expense creation
export const validateExpense = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 50 }).withMessage('Category must not exceed 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Description must not exceed 200 characters'),
  
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  handleValidationErrors
];

// Validation rules for orders
export const validateOrder = [
  body('canteen')
    .notEmpty().withMessage('Canteen is required')
    .isMongoId().withMessage('Invalid canteen ID'),
  
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  
  body('items.*.menuItem')
    .notEmpty().withMessage('Menu item is required')
    .isMongoId().withMessage('Invalid menu item ID'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  body('totalAmount')
    .notEmpty().withMessage('Total amount is required')
    .isFloat({ min: 0.01 }).withMessage('Total amount must be a positive number'),
  
  handleValidationErrors
];

// Validation rules for scooter booking
export const validateScooterBooking = [
  body('scooter')
    .notEmpty().withMessage('Scooter is required')
    .isMongoId().withMessage('Invalid scooter ID'),
  
  body('startTime')
    .notEmpty().withMessage('Start time is required')
    .isISO8601().withMessage('Invalid start time format'),
  
  body('endTime')
    .notEmpty().withMessage('End time is required')
    .isISO8601().withMessage('Invalid end time format')
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validation rules for notification
export const validateNotification = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 500 }).withMessage('Message must not exceed 500 characters'),
  
  body('type')
    .optional()
    .isIn(['info', 'warning', 'success', 'error']).withMessage('Invalid notification type'),
  
  handleValidationErrors
];
