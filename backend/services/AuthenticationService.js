/**
 * 1. Giriş yapıldığında Access ve Refresh token verilecek.
 * 2. Access token süresi bitince refresh token ile yeni access token ve refresh token alınacak(Refresh token rotation).(httpOnly cookie)
 * 4. Refresh tokenlar için blacklist yapılacak(Refresh token rotation).
 * 5. Kullanılan refresh token ile bir istek geldiğinde access token inactive olacak.
 * 6. id token eklenebilir(Kişi bilgilerini içeren token).
 * 7. CSRF Token ekle SameSite=strict olacak şekilde cookie koy httpOnly
 */
const bcrypt = require("bcrypt");
const UserService = require("./UserService");
const TokenHelper = require("../library/TokenHelper");
const {PASSWORD_SALT_VAL} = process.env;

class AuthenticationService {
    async login(userInformation) {
        const user = await UserService.findByUsername(userInformation.username);
        const isUserVerified = await this.passwordChecker(userInformation.password, user.password);

        if (user && isUserVerified) {
            return user;
        }
        return false;
    }

    async setTokens(payload) {
        const {userName, _id} = payload;
        const tokenPayload = {userName, _id: _id.toString()};

        const accessToken = await TokenHelper.generateAccessToken(tokenPayload);
        const refreshToken = await TokenHelper.generateRefreshToken(tokenPayload);

        return {accessToken, refreshToken};
    }

    passwordChecker(formPassword, password) {
        return bcrypt.compare(formPassword, password);
    }

    async signIn(userInformation) {
        const hashedPassword = await bcrypt.hash(userInformation.password, Number.parseInt(PASSWORD_SALT_VAL));

        return UserService.add({
            userName: userInformation.username,
            password: hashedPassword,
            email: userInformation.email,
            age: userInformation.age,
        });
    }
}

module.exports = new AuthenticationService();
