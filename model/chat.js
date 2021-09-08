const mongoose = require('mongoose')

const schema = mongoose.Schema({
    groupId: {
        type: String,
        require: false,
    },
    message_sender: {
        id: {
            type: String,
            require: true,
        }
    },
    message: {
        text: {
            type: String,
            require: true
        },
        ranges: {
            type: Object,
            require: false
        },
        timestamp_precise: {
            type: Date,
            default: Date.now()
        }
    }
})

module.exports = mongoose.model('Chat', schema)