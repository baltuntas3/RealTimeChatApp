const jwt = require('jsonwebtoken')
const errorMessage= require('../helpers/ErrorHandling')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const {ACCESS_SECRET_KEY,REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME}=process.env
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.token
    const refreshToken=authHeader && authHeader.split(' ')[1] || req.cookies.refreshToken

    if(!token || !refreshToken){
        return res.status(401).send(errorMessage("Token must provided"));
    }
        
    try {
        const user = jwt.verify(token, ACCESS_SECRET_KEY)
        if(user){
            req.user=user
            return next();
        }
    } catch (err) {
        if(err.name === 'TokenExpiredError'){
            if(refreshToken){
                const refreshUser = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET_KEY)
                const newAccessToken = jwt.sign({'username': refreshUser.username, 'id': refreshUser.id},ACCESS_SECRET_KEY,{expiresIn:`${TOKEN_EXPIRE_TIME}`})
                res.cookie("token",newAccessToken,{httpOnly:true})
                req.user= jwt.verify(newAccessToken, ACCESS_SECRET_KEY)
                return next();
            }
            if(!refreshToken)
                return next();
        }

        return res.status(401).send(errorMessage("Invalid Token: "+err.message));
    }
}


module.exports = verifyToken;