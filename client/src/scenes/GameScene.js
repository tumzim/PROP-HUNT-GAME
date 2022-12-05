import * as Phaser from 'phaser';
import Player from '../classes/Player'
import io from 'socket.io-client'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    init() {
        this.scene.launch('Ui')
        this.score = 0
        this.scaleSize = 1


    }


    create() {
        //socket
        this.socket = io("http://localhost:3000");


        this.createMap();
        //allow for keyboard inputs 
        this.createInput();

        //other players physics group
        this.otherPlayers = this.physics.add.group();

        //new person joins --- spawns 
        this.socket.on('currentPlayers', (players) => {
            console.log("currentPlayers", players);
            Object.keys(players).forEach((id) => {
                // console.log("************socket", this.socket.id)
                if (players[id].playerId === this.socket.id) {
                    this.addPlayer(players[id])

                } else {
                    this.addOtherPlayers(players[id])
                }
            })
        })

        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayers(playerInfo);
        });

        //displays other info 
        this.socket.on('playerMoved', (playerInfo) => {
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        // player disconnected
        this.socket.on('playerDisconnect', (playerId) => {
            //console.log("disconnect", playerId)
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });
    }

    update() {
        if (this.player) this.player.update(this.cursors);


        //emit player movement to server
        if (this.player) {
            // emit player movement to the server
            const { x, y } = this.player;

            this.socket.emit('playerMovement', { x, y });
        }
    }

    addPlayer(playerInfo) {
        console.log("player info", playerInfo)
        this.player = new Player(this, playerInfo.x, playerInfo.y, 'characters', 4, playerInfo.id)
        this.addCollisions();
    }

    addOtherPlayers(playerInfo) {
        const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'characters', 4)
        //const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, 'characters', 4, playerInfo.id)
        otherPlayer.playerId = playerInfo.playerId;
        this.otherPlayers.add(otherPlayer);
    }






    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.blockedLayer)
        // this.physics.add.overlap(this.player, this.chest, this.collectChest, null, this) ----one chest
        this.physics.add.collider(this.otherPlayers, this.player, this.playerCollider);

    }

    playerCollider() {
        // this.player.body.setVelocity(0);
        this.otherPlayer.setActive(false).setVisible(false);
  
    }


    createMap() {

        //create tile map 
        // this.add.image(0, 0, "background")
        this.levelMap = this.make.tilemap({ key: 'map' });

        /**
         * add tileset image to map 
         * first arg name in json. 2nd arg name in this.load.image
        **/

        //adding tileset for background layer
        this.tiles = this.levelMap.addTilesetImage('TilesetFloor', 'background')
        this.waterTiles = this.levelMap.addTilesetImage('TilesetWater', 'water')

        //adding tileset for blocked layer
        // this.blockedTiles = this.map.addTilesetImage('TilesetFloor', 'borders')
        this.nature = this.levelMap.addTilesetImage('TilesetNature', 'nature')
        this.house = this.levelMap.addTilesetImage('TilesetHouse', 'house')
        this.mine = this.levelMap.addTilesetImage('TilesetReliefDetail', 'mine')

        //adding tileset for decoration layer
        this.floorDetailTiles = this.levelMap.addTilesetImage('TilesetFloorDetail', 'floor')
        //this.seaTiles = this.map.addTilesetImage('TilesetWater', 'water')


        //first arg = layer name on tiled 
        this.backgroundLayer = this.levelMap.createLayer('background', [this.waterTiles, this.tiles])
        this.blockedLayer = this.levelMap.createLayer('blocked', [this.nature, this.house, this.mine, this.waterTiles])
        this.decorationLayer = this.levelMap.createLayer('background_decorations', [this.floorDetailTiles, this.seaTiles, this.house, this.waterTiles, this.nature])

        //add collisions for blocked layer
        this.blockedLayer.setCollisionByExclusion([-1]);

        //scaling map 

        this.backgroundLayer.setScale(this.scaleSize)
        this.decorationLayer.setScale(this.scaleSize)
        this.blockedLayer.setScale(this.scaleSize)


        //update world bounds
        this.physics.world.bounds.width = this.levelMap.widthInPixels * this.scaleSize;
        this.physics.world.bounds.height = this.levelMap.heightInPixels * this.scaleSize;

        // limit the camera to the size of our map
        this.cameras.main.setBounds(0, 0,
            this.levelMap.widthInPixels * this.scaleSize,
            this.levelMap.heightInPixels * this.scaleSize
        );
    }


}
