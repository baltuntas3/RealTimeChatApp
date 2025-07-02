class BaseError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();
        
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
        };
    }
}

module.exports = BaseError;