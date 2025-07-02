const BaseError = require('./BaseError');

class AuthException extends BaseError {
    constructor(message = 'Authentication failed', statusCode = 401) {
        super(message, statusCode);
    }
}

module.exports = AuthException;
