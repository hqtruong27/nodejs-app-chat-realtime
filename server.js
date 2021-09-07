const express = require('express')
const app = express()
const http = require('http')
require('dotenv').config()
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000

//socket
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

// db connection
require('./src/database/mongoose')

//routes controller
const authRoute = require('./routes/authentication')
const personalRoute = require('./routes/personal')

app.use(express.static(__dirname + '/src/'))
app.use('/helper', express.static(__dirname + '/src/'))
app.use(express.json())

//setup routes
app.use('/api/authentication', authRoute)
app.use('/api/personal', personalRoute)

//
app.get('/', (req, res) => {
    res.sendFile(__dirname + `index.html`)
})

// catch 404 and forward to error handler
//.........
//.........
//.........

// error handler
//.........
//.........
//.........

//socket
io.on('connection', async (socket) => {
    console.log('connected')

    socket.on('on-chat', data => {
        console.log({ data })

        io.emit('user-chat', data)
    })
})

server.listen(PORT, HOST, () => console.log(`listening on ${HOST}:${PORT}`))

