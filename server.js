const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config()
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3000

//socket
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const { authorize } = require('./middleware/middleware')

// db connection
require('./src/database/mongoose')

//routes controller
const authRoute = require('./routes/authentication')
const personalRoute = require('./routes/personal')
const othersRoute = require('./routes/controller')

app.use(express.static(__dirname + '/src/'))
app.use('/helper', express.static(__dirname + '/src/'))
app.use(express.json())
//setup routes
app.use('/api/auth', authRoute)
app.use('/api/personal', personalRoute)
app.use('/api', othersRoute)


//
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/index.html'))
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
io.use(authorize).on('connection', (socket) => {
    console.log('connected')

    socket.emit('user-info', { user: socket.decoded.data })
    socket.on("join-room", (data) => {
        socket.join(data.roomName);
    })

    socket.on('typing', (req) => {
        socket.broadcast.emit('typing', req)
    })

    socket.on('on-chat', (req) => {
        const data = { user: req.user, message_sender: socket.id, message: req.message }
        io.to('room1').emit('user-chat', data);

    });
});

server.listen(PORT, HOST, () => console.log(`listening on ${HOST}:${PORT}`))

