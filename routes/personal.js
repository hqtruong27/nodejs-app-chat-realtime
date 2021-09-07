const express = require('express')
const router = express.Router()

const middleware = require('../middleware/middleware')

router.get('/', middleware.verify, (req, res, next) => {
    return res.json(req.user)
})

module.exports = router