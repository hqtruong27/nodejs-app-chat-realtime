const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY || 'my secret key'
const verify = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ status: 401, message: 'Invalid token' })
    }

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, value) => {
        if (err) {
            return res.status(400).json({ status: 500, message: 'failed to verify token' });
        }

        req.user = value.data;
        next()
    })
}

const authorize = (socket, next) => {
    const token = socket.handshake?.auth?.token
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                const error = new Error(err.message);
                error.data = { code: '401', message: "Authentication failed" }
                //socket.disconnect()
                return next(error)
            }

            socket.decoded = decoded
            next()
        })
    }
    else {
        //socket.disconnect()
        next(new Error({ code: '401', message: "invalid token" }));
    }

}

module.exports = { verify, authorize }