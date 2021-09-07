const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../model/user')
const jwt = require('jsonwebtoken')

//middleware
const middleware = require('../middleware/middleware')

const rounds = 9
const SECRET_KEY = process.env.SECRET_KEY || 'my secret key'

router.get('/login', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (user != null) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = generateToken(user)
                return res.status(200).json({ token: token, expiresIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) })
            }

            return res.status(401).json({
                code: 401,
                message: 'Invalid username or password'
            })
        }

        return res.status(404).json({ code: 404, message: 'user not found' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ code: 500, message: error.message })
    }
})

router.post('/signup', async (req, res) => {

    const body = req.body
    console.log('input:', body)
    try {
        const user = await User.findOne({ name: body.name })
        if (user != null) {
            return res.status(400).json({ code: 400, message: 'User already exists' })
        }

        const passwordHash = await bcrypt.hash(body.password, rounds)

        const newUser = new User({ name: body.name, password: passwordHash })

        const result = await newUser.save()
        if (result === newUser) {
            console.log('save user successfully')
            return res.status(200).json(result)
        }

        return res.status(409).json(result)
    } catch (error) {
        console.error('There was an error while saving user', error);
    }
})

const generateToken = (user) => jwt.sign({ data: user }, SECRET_KEY, { expiresIn: '24h' })

router.get('/user', middleware.verify, async (req, res, next) => {
    const users = await User.find()
    if (users.length > 0) {
        return res.status(200).json(users)
    }

    return res.status(404).json({ message: 'User not found' })
})

module.exports = router