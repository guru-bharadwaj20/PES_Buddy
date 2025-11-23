// Common error response handler
export const handleError = (res, err, customMessage = 'Server error') => {
	console.error(err);
	const statusCode = err.statusCode || 500;
	const message = err.message || customMessage;
	res.status(statusCode).json({ message });
};

// Common validation error
export const validationError = (res, message) => {
	res.status(400).json({ message });
};

// Common not found error
export const notFoundError = (res, message = 'Resource not found') => {
	res.status(404).json({ message });
};

// Common unauthorized error
export const unauthorizedError = (res, message = 'Unauthorized access') => {
	res.status(401).json({ message });
};

// Common forbidden error
export const forbiddenError = (res, message = 'Access denied') => {
	res.status(403).json({ message });
};
