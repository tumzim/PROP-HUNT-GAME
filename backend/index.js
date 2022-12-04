const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:8080", "https://localhost:8000"],
        methods: ["GET", "POST"],
    }
});
const port = 3000;

const GameManager = require('./game_manager/GameManager') 
const gameManager = new GameManager(io);
gameManager.setup();


// const players = {};

// io.on("connection", (socket) => {
//     // player disconnected
//     socket.on('disconnect', () => {
//         console.log('player disconnected from our game', socket.id);
//         //delete this.players(socket.id)
//         io.emit('disconnectPlayer', socket.id)
//     });

//     socket.on('newPlayer', (obj) => {
//         console.log(obj)
//         console.log('new player event received')
//         socket.broadcast.emit('newPlayer', socket.id, "everyone but original socket")
//         io.emit('newPlayer', socket.id, 'everyone')
//     })
// })


//import routes
const authRoutes = require('./routes/main')
const passRoutes = require('./routes/password')

//import middleware
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
//const { Socket } = require('dgram');

//use middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:8000" }))
app.use(cookieParser())

//require passport auth
require('./auth.js/auth')

//setup routes
app.use('/auth', authRoutes)
app.use('/pass', passRoutes)

app.get("/", (req, res) => {
    res.send("hello future app")
})

app.get("/status", (req, res) => {
    res.status(200).json({ message: 'ok', status: 200 })
})





//404 error handler - any other route
app.use((req, res) => {
    res.status(404).json({ message: "404 Not found", status: 404 })
})

//500 error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message, status: 500 })
    next()
})

server.listen(port, () => {
    console.log(`server is running on port ${3000}`)
})