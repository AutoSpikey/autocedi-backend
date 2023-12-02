const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../logger');

const auth = async (req, res, next) => {

    // validate authHeader
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ message: "Authentication Invalid" });
    } else {
        // receive token
        const token = authHeader.split(' ')[1];

        // validate token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            await User.findOne({_id: payload.userId});
            req.user = {
                id: payload.userId,
                email: payload.email,
                wallet: payload.wallet,
                ip: payload.ip,
            }
            if (req.ip != payload.ip) throw new Error("Missmatching IPs");
            next()
        } catch (error) {
            logger.error(error);
            res.status(401).json({ message: "Authentication Invalid" });
        }
    }

}

module.exports = auth