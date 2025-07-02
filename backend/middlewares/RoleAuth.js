const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET} = process.env;

class RoleAuth {
    /**
     * Middleware to check if user has required roles
     * @param {Array|String} requiredRoles - Required roles (can be array or single role)
     * @returns {Function} Express middleware function
     */
    static requireRoles(requiredRoles) {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization?.split(' ')[1];
                
                if (!token) {
                    return res.status(401).json({
                        success: false,
                        message: "Access token required"
                    });
                }

                const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
                const userRoles = decoded.roles || [];
                
                // Convert requiredRoles to array if it's a string
                const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
                
                // Check if user has at least one of the required roles
                const hasRequiredRole = rolesArray.some(role => userRoles.includes(role));
                
                if (!hasRequiredRole) {
                    return res.status(403).json({
                        success: false,
                        message: "Insufficient permissions"
                    });
                }

                req.user = decoded;
                next();
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }
        };
    }

    /**
     * Middleware to check if user is admin
     */
    static requireAdmin() {
        return RoleAuth.requireRoles(['admin']);
    }

    /**
     * Middleware to check if user is client or admin
     */
    static requireClient() {
        return RoleAuth.requireRoles(['client', 'admin']);
    }
}

module.exports = RoleAuth;