import * as Phaser from 'phaser';

export default class UiScene extends Phaser.Scene {
    constructor() {
        super('Ui');
    }

    init(){
        //grab a reference to the game scene
        this.gameScene = this.scene.get('Game')
    }

    create() {
        // this.setupUiElements();
        this.setupEvents();
    }


    // setupUiElements(){
    //     this.scoreText =  this.add.text(35, 8, 'Gold: 0', { fontSize: '16px', fill:'#fff'});
    //     this.coinIcon = this.add.image(15, 15, 'items2', 3);
    // }

    setupEvents(){
        //listen for update score event from game scene when chest collected
        this.gameScene.events.on('updateScore', (score)=> {
            this.scoreText.setText(`Gold: ${score}`)
        })
    }
}