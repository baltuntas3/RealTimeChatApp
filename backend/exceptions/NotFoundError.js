const BaseError = require('./BaseError');

class NotFoundError extends BaseError {
    constructor(message = 'Resource not found', statusCode = 404) {
        super(message, statusCode);
    }
}

module.exports = NotFoundError;