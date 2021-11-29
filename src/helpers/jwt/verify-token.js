const jwt = require("jsonwebtoken");
const path = require('path')
const getToken = require(path.join(__dirname, 'get-token.js'))
const jwtSecret = require(path.join(__dirname, '..', '..', 'config', 'jwtSecret.json'))['secret']

// middleware to validate token
const checkToken = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(401).json({message: "Access denied!"})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({message: "Access denied!"})
    }

    try {
        const verified = jwt.verify(token, jwtSecret)
        const dateNow = new Date()
        const creationDate = new Date( parseInt(verified.iat) * 1000 )
        if( (creationDate  + 12 * 3600 * 1000) > dateNow.getTime()) {
            return res.status(400).json({message: "Token has expired!"})
        }
        req.user = verified
        next()
        
    } catch (error) {
        return res.status(400).json({message: "Invalid token!"})
    }

};

module.exports = checkToken;
