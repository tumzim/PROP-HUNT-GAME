import * as Phaser from 'phaser';
//import blueButtonPath from '../assets/images/ui/blue_button01.png'

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //load images
        this.loadImages();

        //load spritesheets
        this.loadSpriteSheets();

        //load audio
        this.loadAudio();

        // load tilemap
        this.loadTileMap();

    }

    loadImages() {
        this.load.image("button1", 'assets/images/ui/blue_button01.png')
        this.load.image("button2", 'assets/images/ui/blue_button02.png')

        //load map tileset image


        //************background layer*********** //
        this.load.image('background', 'assets/level/TilesetFloor.png')
        this.load.image('water', 'assets/level/TilesetWater.png')

        //************decoration layer*********** //
        this.load.image('floor', 'assets/level/TilesetFloorDetail.png')

        //************blocked layer*********** //
        this.load.image('nature', 'assets/level/TilesetNature.png')
        this.load.image('house', 'assets/level/TilesetHouse.png')
        this.load.image('mine', 'assets/level/TilesetReliefDetail.png')
        //this.load.image('borders','assets/level/final_map.png')

    }

    loadSpriteSheets() {
        this.load.spritesheet('items2', 'assets/images/items2.png', { frameWidth: 32, frameHeight: 32 })
       // this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('chest', 'assets/images/chest.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('characters', 'assets/images/TilesetNature.png', { frameWidth: 32, frameHeight: 32 } )
    }

    loadAudio() {
        this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
    }

    create() {
        // this.add.text(100, 100, "helloooooooo")
        this.scene.start('Game')
    }

    loadTileMap() {
    //map made with tiled in JSON format
    // this.load.tilemapTiledJSON('map', 'assets/level/gameMap.json')
    this.load.tilemapTiledJSON('map', 'assets/level/level_map.json');
    }

}


