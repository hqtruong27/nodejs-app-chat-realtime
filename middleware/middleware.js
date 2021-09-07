const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY || 'my secret key'
const verify = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ status: 401, message: 'Invalid token' })
    }

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, value) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'failed to verify token' });
        }

        req.user = value.data;
        next()
    })
}

module.exports = { verify }