import express from 'express';
import { 
	getUserNotifications, 
	getUnreadCount, 
	markAsRead, 
	markAllAsRead,
	deleteNotification 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/:notificationId/read', protect, markAsRead);
router.patch('/mark-all-read', protect, markAllAsRead);
router.delete('/:notificationId', protect, deleteNotification);

export default router;
