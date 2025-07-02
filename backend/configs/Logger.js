const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels with colors
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

winston.addColors(logColors);

// Custom format for log messages
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        // Add stack trace for errors
        if (stack) {
            logMessage += `\n${stack}`;
        }
        
        // Add metadata if present
        if (Object.keys(meta).length > 0) {
            logMessage += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return logMessage;
    })
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        let logMessage = `${timestamp} ${level}: ${message}`;
        if (stack && process.env.NODE_ENV === 'development') {
            logMessage += `\n${stack}`;
        }
        return logMessage;
    })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');

// Daily rotate file transport for errors
const errorFileRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat
});

// Daily rotate file transport for all logs
const combinedFileRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat
});

// Create transports array based on environment
const transports = [
    errorFileRotateTransport,
    combinedFileRotateTransport
];

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: consoleFormat,
            level: 'debug'
        })
    );
} else {
    // In production, also log to console but with less verbosity
    transports.push(
        new winston.transports.Console({
            format: consoleFormat,
            level: 'info'
        })
    );
}

// Create the logger instance
const logger = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: logFormat,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false
});

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
    new DailyRotateFile({
        filename: path.join(logsDir, 'exceptions-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat
    })
);

logger.rejections.handle(
    new DailyRotateFile({
        filename: path.join(logsDir, 'rejections-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat
    })
);

// Create a stream object for Morgan
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

// Helper methods for structured logging
logger.logError = (error, context = {}) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        ...context
    });
};

logger.logRequest = (req, res, responseTime) => {
    logger.http({
        message: `${req.method} ${req.originalUrl}`,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user?.id || 'anonymous'
    });
};

logger.logWebSocket = (event, data = {}) => {
    logger.info({
        message: `WebSocket: ${event}`,
        event,
        ...data
    });
};

logger.logDatabase = (operation, data = {}) => {
    logger.info({
        message: `Database: ${operation}`,
        operation,
        ...data
    });
};

module.exports = logger;