import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, id, mainPlayer) {
        super(scene, x, y, key, frame)
        this.scene = scene;
        this.mainPlayer = mainPlayer;
        this.id = id
        this.velocity = 100; //velocity of moving player

        //enable physics 
        this.scene.physics.world.enable(this);
        this.setImmovable(false);

        //scale player
        this.setScale(1);

        //collide with world bounds
        this.setCollideWorldBounds(true);

        //add player to existing scene
        this.scene.add.existing(this);

        // //camera can follow player
        // this.scene.cameras.main.startFollow(this);

        if (this.mainPlayer) {
            this.scene.cameras.main.startFollow(this);
        }

    }


    update(cursors) {

        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.velocity)
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.velocity)
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.velocity)
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.velocity)
        }
    }
}