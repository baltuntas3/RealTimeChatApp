const morgan = require('morgan');
const logger = require('../configs/Logger');

// Custom Morgan format for structured logging
const customFormat = ':method :url :status :res[content-length] - :response-time ms :user-agent';

// Morgan token for user ID
morgan.token('user-id', (req) => {
    return req.user?.id || 'anonymous';
});

// Morgan token for request ID (if you implement it later)
morgan.token('request-id', (req) => {
    return req.requestId || 'N/A';
});

// Custom Morgan format with user info
const detailedFormat = ':method :url :status :res[content-length] - :response-time ms :user-agent :user-id';

// Create Morgan middleware
const requestLogger = morgan(detailedFormat, {
    stream: logger.stream,
    skip: (req, res) => {
        // Skip logging for health checks, static files, etc.
        const skipPaths = ['/health', '/favicon.ico'];
        return skipPaths.includes(req.path) || 
               req.path.startsWith('/static') ||
               req.path.startsWith('/assets');
    }
});

// Enhanced request logger middleware
const enhancedRequestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Generate request ID
    req.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Log request start
    logger.debug('Request started', {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const responseTime = Date.now() - startTime;
        
        // Log response
        logger.logRequest(req, res, responseTime);
        
        // Call original end
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

// Error request logger
const errorRequestLogger = (err, req, res, next) => {
    logger.error('Request error', {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        stack: err.stack,
        userId: req.user?.id || 'anonymous'
    });
    next(err);
};

module.exports = {
    requestLogger,
    enhancedRequestLogger,
    errorRequestLogger
};