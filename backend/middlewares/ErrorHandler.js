const BaseError = require('../exceptions/BaseError');
const NotFoundError = require('../exceptions/NotFoundError');
const logger = require('../configs/Logger');

// Async wrapper for route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Modern error handler with proper logging
function errorHandler(err, req, res, next) {
    // If response was already sent, delegate to Express default error handler
    if (res.headersSent) {
        return next(err);
    }

    let error = err;

    // Convert non-BaseError instances to BaseError
    if (!(error instanceof BaseError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new BaseError(message, statusCode, false);
    }

    // Log error details
    logError(error, req);

    // Prepare response
    const errorResponse = {
        success: false,
        timestamp: error.timestamp,
        message: getLocalizedMessage(error.message, res),
        ...(process.env.NODE_ENV === 'development' && { 
            stack: error.stack,
            name: error.name 
        })
    };

    // Add validation errors if available
    if (error.errors && Array.isArray(error.errors)) {
        errorResponse.errors = error.errors.map(validationError => ({
            field: validationError.field || null,
            message: getLocalizedMessage(validationError.message, res)
        }));
    }

    return res.status(error.statusCode).json(errorResponse);
}

// Enhanced logging function
function logError(error, req) {
    const logData = {
        name: error.name,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
    };

    if (error.isOperational) {
        logger.warn('Operational Error', { ...logData, message: error.message });
    } else {
        logger.error('System Error', { ...logData, message: error.message, stack: error.stack });
    }
}

// Helper function for localized messages
function getLocalizedMessage(message, res) {
    return res.locals.t ? res.locals.t(message) : message;
}

// 404 handler with proper error class
function notFoundHandler(req, res, next) {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
}

// Unhandled rejection handler
function handleUnhandledRejection() {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection', { reason: reason.toString(), promise: promise.toString() });
        // Gracefully close the server
        process.exit(1);
    });
}

// Uncaught exception handler
function handleUncaughtException() {
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
        // Gracefully close the server
        process.exit(1);
    });
}

module.exports = { 
    errorHandler, 
    asyncHandler, 
    notFoundHandler,
    handleUnhandledRejection,
    handleUncaughtException,
    // Backward compatibility (deprecated)
    catchErrors: asyncHandler
};
