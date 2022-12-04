import * as Phaser from 'phaser';

export default class UiButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, hoverKey, text, targetCallback) {
        super(scene, x, y);
        this.scene = scene; //scene container will be added to 
        this.x = x; //x- position of container
        this.y = y; //y-position of container
        this.key = key;//background image of button
        this.hoverKey = hoverKey;//background image of button that appears when user hovers over button
        this.text = text; //text displayed in button
        this.targetCallback = targetCallback; //callback function that will be called when button clicked

        //create button
        this.createButton();

        //add this container to phaser scnee
        this.scene.add.existing(this);
    }

    createButton() {

        this.button = this.scene.add.image(0, 0, 'button1') //create button
        this.button.setInteractive(); //button can now listen to events
        this.button.setScale(1.4)//scale button

        //create button text
        this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', fill: '#fff' })
        //center button text inside UI button 
        Phaser.Display.Align.In.Center(this.buttonText, this.button);

        //add game objects to container
        this.add(this.button)
        this.add(this.buttonText)

        this.button.on('pointerdown', () => {
            this.targetCallback();
        })

        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverKey);
        })

        this.button.on('pointerout', () => {
            console.log('pointer out')
            this.button.setTexture(this.key);
        })
    }
}

