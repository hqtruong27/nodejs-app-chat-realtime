const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const { User } = require('../model/user_group')
const jwt = require('jsonwebtoken')

//middleware
const { verify } = require('../middleware/middleware')

const rounds = 9
const SECRET_KEY = process.env.SECRET_KEY || 'my secret key'

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (user != null) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = generateToken(user)

                return res.status(200).json({
                    token: token,
                    expiresIn: new Date(Date.now() + 600000)
                })
            }

            return res.status(401).json({
                code: 401,
                message: 'Invalid username or password'
            })
        }

        return res.status(404).json({ code: 404, message: 'This account is not registered' })
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

const generateToken = (user) => jwt.sign({ data: user }, SECRET_KEY, { expiresIn: '1d' })

router.get('/checkToken', verify, async (req, res, next) => {
    return res.status(200).json()
})

module.exports = router