const express = require('express')
const router = express.Router()
const { User, Group } = require('../model/user_group')

/**
 * Home page: loading all product
 */
router.get('/group?:userId', async (req, res) => {
    try {
        //const newChat = new Chat({ groupId: groupId, message_sender: userId, message: { text: 'hah hah...' } })
        //const rs = await newChat.save()
        //const e = await Group.create({ users: '6139178df09f69749ff805a1', name: "Group 2" })
        const result = await Group.find({ users: req.query.userId }).populate('users')
        console.log(result)

        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ code: 500, message: error.message })
    }
})

router.get('/chat?:groupId', async (req, res) => {
    const _context = await dbConnection()
    const userId = '613595dedaa1681a4456b677'
    const query = { groupId: req.query.groupId }

    let result = await _context.collection('Chats').find(query).sort({ timestamp_precise: 1 }).toArray()

    return res.send(result)
})

module.exports = router;