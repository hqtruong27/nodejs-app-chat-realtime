const { model, Schema } = require('mongoose')

const user = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
})

const group = new Schema({
    name: {
        type: String,
        required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

// const user_group = Schema({
//     userId: {
//         type: 'string',
//         required: true,
//     },
//     groupId: {
//         type: 'string',
//         required: true
//     },

// })

module.exports.User = new model('User', user)
module.exports.Group = new model('Group', group)
