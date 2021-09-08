const mongoose = require('mongoose')

const model = mongoose.Schema({
    userId: {
        type: 'string',
        required: true,
    },
    groupId: {
        type: 'string',
        required: true
    }
})

module.exports = new mongoose.model('User_Group', model)