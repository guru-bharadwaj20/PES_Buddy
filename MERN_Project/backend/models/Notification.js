import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	type: {
		type: String,
		enum: ['order', 'booking', 'expense', 'system'],
		required: true
	},
	title: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	relatedId: {
		type: mongoose.Schema.Types.ObjectId
	},
	read: {
		type: Boolean,
		default: false
	},
	icon: {
		type: String,
		default: '🔔'
	}
}, {
	timestamps: true
});

// Index for faster queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
