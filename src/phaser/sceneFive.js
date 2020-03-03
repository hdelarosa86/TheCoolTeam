import React from 'react'
import Phaser from 'phaser';
import pokeStudent from '../assets/student/student.png';
import pokeStudentJSON from '../assets/student/student_atlas.json';

let controls;
let cursors;
let player;
let music;
let tile;
let showDebug = false;

class SceneFive extends Phaser.Scene {
  constructor() {
    super('scene5');
  }
  preload() {
    this.load.atlas('atlas', pokeStudent, pokeStudentJSON);
  }

  create() {
    const map = this.make.tilemap({ key: 'home' });
    const tileset = map.addTilesetImage('home', 'homeLevel');
    const shopLayer = map.createStaticLayer('home', tileset, 0, 0);

    music = this.sound.add('house', { loop: true });
    music.play();

    tile = map.setTileIndexCallback(435, () => {
      music.stop();
      this.scene.start('PlayGame')
    }, this);

    shopLayer.setCollisionByProperty({ collides: true });
    const spawnPoint = map.findObject('SpawnPoint', obj => obj.name === 'spawn');
    player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'student-back')
    .setSize(30, 40)
    .setOffset(0, 24);

  const anims = this.anims;
  anims.create({
    key: 'student-left-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-left-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'student-right-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-right-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'student-front-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-front-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: 'student-back-walk',
    frames: anims.generateFrameNames('atlas', { prefix: 'student-back-walk.', start: 0, end: 4, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.collider(player, shopLayer);

  const camera = this.cameras.main;
  camera.startFollow(player);
  cursors = this.input.keyboard.createCursorKeys();
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
    .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
      font: '18px monospace',
      fill: '#000000',
      padding: { x: 20, y: 10 },
      backgroundColor: '#ffffff'
    })
    .setScrollFactor(0)
    .setDepth(30);

      this.input.keyboard.once('keydown_D', event => {this.input.keyboard.once('keydown_D', event => {
        // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
          .graphics()
          .setAlpha(0.75)
          .setDepth(20);
      });
  })
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
    if (cursors.left.isDown) {player.anims.play('student-left-walk', true);}
    else if (cursors.right.isDown) {player.anims.play('student-right-walk', true);}
    else if (cursors.up.isDown) {player.anims.play('student-back-walk', true);}
    else if (cursors.down.isDown) {player.anims.play('student-front-walk', true);}
    else {
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
