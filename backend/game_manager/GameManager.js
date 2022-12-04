const PlayerModel = require('./PlayerModel')
class GameManager {

    constructor(io) {
        this.io = io

        this.players = {}
        this.playerLocations = [[50, 50], [100, 100]];

    }


    setup() {
        // this.spawnPlayer();
        this.eventListeners();
    }

    eventListeners() {
        this.io.on("connection", (socket) => {
            // player disconnected
            socket.on('disconnect', () => {
                // delete user data from server
                delete this.players[socket.id];
                // emit a message to all players to remove this player
                this.io.emit('disconnected', socket.id);
              });

            socket.on('newPlayer', () => {
                //create player 
                this.spawnPlayer(socket.id)

                //send players object to new player
                this.io.emit('currentPlayers', this.players)

                //inform other players new player joined
                socket.broadcast.emit('spawnPlayer', this.players[socket.id])
                console.log("*******spawnPlayer emit", this.players[socket.id])
            })

            socket.on('playerMovement', (playerData) => {
                // console.log(playerData)
                if (this.players[socket.id]) {
                    this.players[socket.id].x = playerData.x
                    this.players[socket.id].y = playerData.y

                    //emit to all players
                    this.io.emit('playerMoved', this.players[socket.id])
                }
            })
        })

    }

    spawnPlayer(socketId) {
        const player = new PlayerModel(socketId);
        this.players[socketId] = player
        console.log(this.players)
    }
}

module.exports = GameManager