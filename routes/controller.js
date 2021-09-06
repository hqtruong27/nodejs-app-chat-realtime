const express = require('express')
const router = express.Router()
const { dbConnection } = require('../src/connection/db')
/**
 * Home page: loading all product
 */
router.get('/group?:userId', async (req, res) => {
    const _context = await dbConnection()
    const userId = req.query.userId
    let result = await _context.collection('Groups').find({ userId: userId }).toArray()

    console.log(result)

    return res.send(result)
})

router.get('/chat?:groupId', async (req, res) => {
    const _context = await dbConnection()
    const userId = '613595dedaa1681a4456b677'
    const query = { groupId: req.query.groupId }

    let result = await _context.collection('Chats').find(query).sort({ timestamp_precise: 1 }).toArray()

    return res.send(result)
})

module.exports = router;