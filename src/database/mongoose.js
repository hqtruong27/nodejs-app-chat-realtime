const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../environment/development.env')
})

let _context;
const dbURI = process.env.MONGODB_FULL_URI

_context = (async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('MongoDB connected!!')
    } catch (error) {
        console.log('Failed to connect to MongoDB', err);
    }
})()