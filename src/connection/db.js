const { MongoClient } = require('mongodb')
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../environment/development.env')
})

const MONGODB_FULL_URI = process.env.MONGODB_FULL_URI

const dbConnection = () => {
    let _content = null
    let instance = 0
    const dbContext = async () => {
        try {
            let mongoClient = await MongoClient.connect(MONGODB_FULL_URI)
            return mongoClient.db()

        } catch (error) {
            return error
        }
    }

    const getInstance = async () => {
        try {
            instance++    // this is just to count how many times our singleton is called.
            console.log(`dbConnection called ${instance} times`)

            if (_content != null) {
                console.log(`db connection is already alive`)
                return _content;
            } else {
                console.log(`getting new db connection`)
                _content = await dbContext()
                return _content
            }
        } catch (e) {
            return e
        }
    }

    return getInstance()
}

module.exports = { dbConnection }