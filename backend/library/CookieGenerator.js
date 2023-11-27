class CookieGenerator {
    static generateAccessAndRefreshTokenCookie(response, tokens) {
        const {accessToken, refreshToken} = tokens;
        if (!accessToken || !refreshToken) {
            return new Error("Access or refresh token is missing");
        }

        CookieGenerator.setSecureTokenCookie(response, "accessToken", accessToken);
        CookieGenerator.setSecureTokenCookie(response, "refreshToken", refreshToken);
    }

    static setSecureTokenCookie(response, tokenName, tokenPayload) {
        response.cookie(tokenName, tokenPayload, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    }
}

module.exports = CookieGenerator;
