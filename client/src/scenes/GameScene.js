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
        this.otherplayer = {}

        //socket
        console.log("**********", this.sys);
        this.socket = io("http://localhost:3000");
        // this.socket = this.sys.game.globals.socket;
        this.socketEvents();
    }


    socketEvents() {
        //spawn player game objects
        this.socket.on('currentPlayers', (players) => {
            console.log("currentPlayers",players);

            // console.log("what is this????????????????", Object.keys(players))
            Object.keys(players).forEach((id) => {
                console.log("************socket",this.socket)
                console.log(id)
                if (players[id].id === this.socket.id) {
                    this.createPlayer(players[id], true)
                    this.addCollisions();
                } else {
                    this.createPlayer(players[id], false)
                }
            })
        })

        this.socket.on('spawnPlayer', (playerId) => {
            console.log('are weeee being reached!!!!!!!!')
            console.log("spawnPlayer", playerId);
            this.createPlayer(playerId, false)
        })

        this.socket.on('playerMoved', (player) => {
            this.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (player.id === otherPlayer.id) {
                    otherPlayer.setPosition(player.x, player.y)
                }
            })
        })
    }

    create() {
        this.createMap();
        //this is used to store var in scene and be able to referecne it in scene


        //create chest
        this.createGroups();

        //allow for keyboard inputs 
        this.createInput();
        this.createPlayer();

        this.createGroups();
        //emit event to server that a new player has joined
        this.socket.emit('newPlayer')

    }

    update() {
        if (this.player) this.player.update(this.cursors);
        //emit player movement to server
        if (this.player) {
            const { x, y } = this.player;
            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
                this.socket.emit('playerMovement', { x, y })
            }
            //save old position data 
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y
            }
        }
    }

    createPlayer(playerId, mainPlayer) {
        this.player = new Player(this, 300, 200, 'characters', 4, playerId ,mainPlayer)
        this.addCollisions();
        if (!mainPlayer) {
            this.otherPlayers.add(this.player);
        } else {
            this.player = this.player
        }
    }

    createGroups() {
        //create other users group

        this.otherPlayers = this.physics.add.group();
        // console.log(this.otherPlayers)
        // console.log("otherPlayers**************",this.otherPlayers)
    }


    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.blockedLayer)
        // this.physics.add.overlap(this.player, this.chest, this.collectChest, null, this) ----one chest
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
