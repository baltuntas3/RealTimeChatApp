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
        const isAccessToken = tokenName === "accessToken";
        const maxAge = isAccessToken ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 15 min for access, 7 days for refresh
        
        response.cookie(tokenName, tokenPayload, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: maxAge,
            path: "/",
        });
    }
}

module.exports = CookieGenerator;
