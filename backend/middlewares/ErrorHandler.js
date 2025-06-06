const catchErrors = (fn) => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next);

function errorHandler(err, req, res, next) {
    // Eğer response zaten gönderilmişse, Express'in default error handler'ına bırak
    if (res.headersSent) {
        return next(err);
    }

    // Default values
    let statusCode = 500;
    let message = "Internal Server Error";

    // Custom error types
    if (err.name === "AuthException") {
        statusCode = 401;
        message = err.message;
    } else if (err.name === "ForbiddenException") {
        statusCode = 403;
        message = err.message;
    } else if (err.name === "ValidationError") {
        statusCode = 422;
        message = err.message;
    } else if (err.statusCode) {
        // Axios veya diğer HTTP error'ları için
        statusCode = err.statusCode;
        message = err.message;
    }

    // Localized message
    const localizedMessage = res.locals.t ? 
        res.locals.t(message) : message;

    const errorResponse = {
        timestamp: new Date().toISOString(),
        message: localizedMessage,
        subErrors: [],
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Array errors için
    if (Array.isArray(err)) {
        errorResponse.subErrors = err.map(error => ({
            field: error.field || null,
            message: res.locals.t ? res.locals.t(error.message) : error.message
        }));
    }

    // Log error (production'da)
    if (process.env.NODE_ENV === 'production') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    }

    return res.status(statusCode).json(errorResponse);
}

// 404 handler
function notFoundHandler(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
}

module.exports = { errorHandler, catchErrors, notFoundHandler };
