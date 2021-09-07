const express = require('express')
const router = express.Router()

const middleware = require('../middleware/middleware')

router.get('/', middleware.verify, (req, res, next) => {
    const user = req.user
    console.log('', user)
    return res.json(user)
})

module.exports = router