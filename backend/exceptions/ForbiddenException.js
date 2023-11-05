class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenException";
    }
}

module.exports = ForbiddenException;
