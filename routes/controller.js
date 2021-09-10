const express = require('express')
const router = express.Router()
const { User } = require('../model/user')
const { Conversation, Message } = require('../model/chat')
const ObjectId = require('mongoose').Types.ObjectId
/**
 * Home page: loading all product
 */
router.get('/conversation?:userId', async (req, res) => {
    try {
        //const message = await Message.create({ message_sender: { user: req.query.userId }, message: { text: 'What?' }, conversation: '613b079f99395dfbda6dc3d7' })
        const result = await Conversation.find({ users: req.query.userId }).populate('members')

        console.log(result)

        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ code: 500, message: error.message })
    }
})

router.get('/messages?:conversationId', async (req, res) => {
    const conversationId = req.query.conversationId
    const isValid = ObjectId.isValid(conversationId)
    let result = await Message.find({ conversation: isValid ? conversationId : null }).populate('message_sender.user')

    return res.send(result)
})

module.exports = router;