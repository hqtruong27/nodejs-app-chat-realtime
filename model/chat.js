const { model, Schema } = require('mongoose')

const conversation = new Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: Object,
        required: false,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const message = new Schema({
    message_sender: {
        user: { type: Schema.Types.ObjectId, ref: 'User' }
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
    },
    timestamp_precise: {
        type: Date,
        default: Date.now()
    },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' }
})

module.exports.Conversation = new model('Conversation', conversation)
module.exports.Message = new model('Message', message)