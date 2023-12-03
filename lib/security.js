const jwt = require("jsonwebtoken")
const User = require("../models/user.model")


function obfuscate(data, keys = []) {
    const keysToObfuscate = [
        "password", "pin", "username", ...keys
    ]

    for (const key of keysToObfuscate) {
        if (key in data) {
            delete data[key]
        }
    }

    return data
}

async function authenticateToken(req, res, next) {
    console.log("authenticating token")

    if (req.path.startsWith("/auth")) {
        console.log("it's on an auth path, so don't check token")
        return next()
    };

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        console.log("no token found");
        return res.sendStatus(401)
    }

    var decoded
    try {
        console.log("decoding token")
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log("decoded token: ", decoded)
    } catch (err) {
        console.error(err)
        return res.sendStatus(401)
    }
    // check if ip is the same
    if (decoded.ip !== req.socket.remoteAddress) {
        console.log("wrong ip");
        return res.sendStatus(401)
    }

    req.auth = { userId: decoded.userId }

    // get user
    const user = await User.findOne({ oid: decoded.oid });
    if (!user) {
        console.log("no user found with id", decoded.oid)
        return res.sendStatus(401)
    }

    console.log('found user', user.email)

    return next()
}

module.exports = { obfuscate, authenticateToken }