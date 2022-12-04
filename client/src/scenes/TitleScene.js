import * as Phaser from 'phaser';
import UiButton from '../classes/UiButton';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }
    preload() {

    }
    create() {
        /////////////////////create title text
        this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, "Mordor MMORPG", { fontSize: '64px', fill: '#fff' })
        //console.log(this.scale)
        //console.log(this.this.sys.game.config.height)
        this.titleText.setOrigin(0.5);
        // button.setOrigin(0.5, 0.5) --ignore

        //create start button 
        this.startGameButton = new UiButton(
            this,
            this.scale.width / 2,
            this.scale.height * 0.65,
            'button1', 
            'button2',
            'Start',
            this.startScene.bind(this, 'Game')
        );
    }

    startScene(targetScene) {
        this.scene.start(targetScene);
    }

}

