const BaseError = require('./BaseError');

class ForbiddenException extends BaseError {
    constructor(message = 'Access forbidden', statusCode = 403) {
        super(message, statusCode);
    }
}

module.exports = ForbiddenException;
