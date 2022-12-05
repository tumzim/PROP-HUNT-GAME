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


const players = {};

io.on("connection", (socket) => {
    console.log("player has connected", socket.id)
    
    players[socket.id] = {
        playerId: socket.id,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
    } 

    socket.emit('currentPlayers', players); 
    console.log(players)

    socket.broadcast.emit('newPlayer', players[socket.id]);

    // player disconnected
    socket.on('disconnect', () => {
        console.log('player disconnected from our game', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnect', socket.id)
        console.log("players left: ", players)
    });

})






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