import React from 'react';
import Phaser from 'phaser';

let controls;
let cursors;
let player;
let music;
let tile;
const showDebug = false;

class SceneFive extends Phaser.Scene {
  constructor() {
    super('scene5');
  }
  init(data){
    this.player = data
  }
  create() {
    const map = this.make.tilemap({ key: 'home' });
    const tileset = map.addTilesetImage('home', 'homeLevel');
    const shopLayer = map.createStaticLayer('home', tileset, 0, 0);

    music = this.sound.add('house', { loop: true });

    music.play();

    tile = map.setTileIndexCallback(435, () => {
      music.stop();
      this.scene.start('PlayGame', this.player);
    }, this);

    shopLayer.setCollisionByProperty({ collides: true });
    const spawnPoint = map.findObject('SpawnPoint', (obj) => obj.name === 'spawn');
    player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'student-back')
      .setSize(30, 40)
      .setOffset(0, 24);

      this.stat = this.add.text(16, 16, `HP: ${this.player.health} Badge: ${this.player.badge}`, {
        wordWrap: { width: 500 },
        padding: { top: 15, right: 15, bottom: 15, left: 15 },
        align: 'left',
        backgroundColor: '#c90000',
        color: '#ffffff',
    })
    .setScrollFactor(0)
    .setDepth(30);

    if (this.player.health === 0){
      this.stat.destroy()
      this.dialouge = this.add.text(130, 500, `You didn't do so good. You must start junior phase again.`, {
        wordWrap: {
            width: 500
        },
        padding: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15
        },
        align: 'left',
        backgroundColor: '#ffffff',
        color: '#c90000',
    })
    .setScrollFactor(0)
    .setDepth(30);

    this.player.health = 100

      setTimeout( () => {
        this.dialouge.destroy()
      }, 7000)
      // health
      this.speech = this.add.text(16, 16, `HP: ${this.player.health} Badge: ${this.player.badge}`, {
        wordWrap: { width: 500 },
        padding: { top: 15, right: 15, bottom: 15, left: 15 },
        align: 'left',
        backgroundColor: '#c90000',
        color: '#ffffff',
    })
    .setScrollFactor(0)
    .setDepth(30);
    }

    const { anims } = this;
    anims.create({
      key: 'student-left-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-left-walk.', start: 0, end: 4, zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'student-right-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-right-walk.', start: 0, end: 4, zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'student-front-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-front-walk.', start: 0, end: 4, zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'student-back-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-back-walk.', start: 0, end: 4, zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(player, shopLayer);

    const camera = this.cameras.main;
    camera.startFollow(player);
    cursors = this.input.keyboard.createCursorKeys();
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen

      this.input.keyboard.once('keydown_D', (event) => {
      // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
          .graphics()
          .setAlpha(0.75)
          .setDepth(20);
      });
  }

  update(time, delta) {
    // Runs once per frame for the duration of the scene
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) player.body.setVelocityX(-speed);
    else if (cursors.right.isDown) player.body.setVelocityX(speed);

    // Vertical movement
    if (cursors.up.isDown) player.body.setVelocityY(-speed);
    else if (cursors.down.isDown) player.body.setVelocityY(speed);

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) { player.anims.play('student-left-walk', true); } else if (cursors.right.isDown) { player.anims.play('student-right-walk', true); } else if (cursors.up.isDown) { player.anims.play('student-back-walk', true); } else if (cursors.down.isDown) { player.anims.play('student-front-walk', true); } else {
      player.anims.stop();
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture('atlas', 'student-left');
      else if (prevVelocity.x > 0) player.setTexture('atlas', 'student-right');
      else if (prevVelocity.y < 0) player.setTexture('atlas', 'student-back');
      else if (prevVelocity.y > 0) player.setTexture('atlas', 'student-front');
    }
  }
}

export default SceneFive;
