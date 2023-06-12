class AuthException extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthException";
    }
}

module.exports = AuthException;
