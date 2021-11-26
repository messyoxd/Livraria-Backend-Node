const path = require('path')
const getToken = require(path.join(__dirname, 'jwt', 'get-token.js'))
const getUserByToken = require(path.join(__dirname, 'jwt', 'get-user-by-token.js'))
const checkAccessLevel = async (req, res, next) => {
    // get user by token
    const user =  await getUserByToken(getToken(req))
    if(!user)
        return res.status(422).json({ message: `User not found!` })
    // check if user is Admin
    if(!user.admin)
        return res.status(403).json({ message: `Forbidden!` })
    next()
}
module.exports = checkAccessLevel