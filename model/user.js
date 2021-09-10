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

})

module.exports.User = model('User', user)