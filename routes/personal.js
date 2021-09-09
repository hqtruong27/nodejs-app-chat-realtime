const express = require('express')
const router = express.Router()

const middleware = require('../middleware/middleware')

router.get('/', middleware.verify, (req, res, next) => res.status(200).json(req.user))

module.exports = router