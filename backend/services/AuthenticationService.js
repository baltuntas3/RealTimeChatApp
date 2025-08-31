const bcrypt = require("bcrypt");
const UserService = require("./UserService");
const TokenHelper = require("../library/TokenHelper");
const ForbiddenException = require("../exceptions/ForbiddenException");
const {PASSWORD_SALT_VAL} = process.env;

class AuthenticationService {
    /**
     * Handles user authentication and token generation.
     */
    async login(userInformation) {
        try {
            const user = await UserService.findByUsername(userInformation.username);
            if (!user) {
                throw new ForbiddenException("userPass");
            }
            
            const isUserVerified = await this.passwordChecker(userInformation.password, user.password);
            
            if (isUserVerified) {
                return user;
            } else {
                throw new ForbiddenException("userPass");
            }
        } catch (error) {
            throw new ForbiddenException("userPass");
        }
    }

    /**
     * Generates access and refresh tokens for a user.
     */
    async generateAccessAndRefreshTokensFromUser(userPayload) {
        const {username, _id, roles} = userPayload;
        console.log(userPayload, "+++");

        const user = {username, _id: _id.toString(), roles};

        const accessToken = TokenHelper.generateAccessToken(user);
        const refreshToken = TokenHelper.generateRefreshToken(user);
        const [accessTokenResolved, refresTokenResolved] = await Promise.all([accessToken, refreshToken]);

        return {accessToken: accessTokenResolved, refreshToken: refresTokenResolved};
    }

    /**
     * Compares a form password with a stored password.
     */
    passwordChecker(formPassword, password) {
        return bcrypt.compare(formPassword, password);
    }

    /**
     * Adds a new user with the provided information.
     */
    async signIn(userInformation) {
        const hashedPassword = await bcrypt.hash(userInformation.password, Number.parseInt(PASSWORD_SALT_VAL));

        return UserService.add({
            userName: userInformation.username,
            password: hashedPassword,
            email: userInformation.email,
            age: userInformation.age,
            roles: userInformation.roles || ["client"],
        });
    }
}

module.exports = new AuthenticationService();
