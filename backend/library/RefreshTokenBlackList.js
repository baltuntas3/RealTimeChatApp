class RefreshTokenBlackList {
    constructor() {
        this.tokens = new Set();
    }

    addToBlacklist(token) {
        this.tokens.add(token);
    }

    isBlacklisted(token) {
        return this.tokens.has(token);
    }

    removeFromBlacklist(token) {
        this.tokens.delete(token);
    }
}

module.exports = new RefreshTokenBlackList();
