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
        // console.log(verified);
        // const dateNow = new Date()
        // const expirationDate = new Date( parseInt(verified.iat) * 1000 )
        // console.log(expirationDate);
        // console.log(new Date( dateNow.getTime() ));
        // if( expirationDate > dateNow.getTime()/1000) {
        //     return res.status(400).json({message: "Token has expired!"})
        // }
        req.user = verified
        next()
        
    } catch (error) {
        return res.status(400).json({message: "Invalid token!"})
    }

};

module.exports = checkToken;