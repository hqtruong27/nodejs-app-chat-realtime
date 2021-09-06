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
//const routes = require('./routes/controller')

app.use(express.static(__dirname + '/src/'))
app.use('/helper', express.static(__dirname + '/src/'))
app.use(express.json())

//setup routes
//app.use('/home/', routes)
app.get('/', (req, res) => {
    res.sendFile(__dirname + `index.html`);
});

// catch 404 and forward to error handler
//.........
//.........
//.........

// error handler
//.........
//.........
//.........


io.on('connection', async (socket) => {
    console.log('connected')
    // const data = { id: 1, name: 'Truong Hoang' }
    // let _context = await dbConnection.dbConnection()

    // let result = await _context.collection('Chat').insertOne(data)
    // console.log(result)

    socket.on('on-chat', data => {
        console.log({ data })

        io.emit('user-chat', data)
    })
})

server.listen(PORT, HOST, () => console.log(`listening on ${HOST}:${PORT}`));

