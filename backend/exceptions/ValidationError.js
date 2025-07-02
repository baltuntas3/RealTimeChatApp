const BaseError = require('./BaseError');

class ValidationError extends BaseError {
    constructor(message = 'Validation failed', errors = [], statusCode = 422) {
        super(message, statusCode);
        this.errors = errors;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            errors: this.errors
        };
    }
}

module.exports = ValidationError;