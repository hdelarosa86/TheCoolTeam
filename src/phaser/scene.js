import Phaser, { Game } from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  gymOneImg,
  HomeImg,
  HomeMap,
  GreenManImg,
  GreenManJSON,
  gymOneMap,
  mansionImg,
  mansionMap,
  houseOneImg,
  houseOneMap,
  pokeImg,
  pokeMap,
  pokeStudent,
  pokeStudentJSON,
  Home,
  Lounge,
  shopImg,
  shopMap
} from './assets'

let cursors;
let music;
let roomOne;
let roomTwo;
let roomThree;
let roomFour;
let roomFive;
let colliderActivated = true;
let player = {x: 100, y: 364};
let showDebug = false;

class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  preload() {
    this.load.image('firstLevel', pokeImg);
    this.load.image('houseLevel', houseOneImg);
    this.load.image('libraryLevel', gymOneImg);
    this.load.image('shopLevel', shopImg);
    this.load.image('homeLevel', HomeImg);
    this.load.image('mansionLevel', mansionImg);
    this.load.image('dragonblue', GreenManImg);
    this.load.image('dragonorrange', GreenManImg);
    this.load.tilemapTiledJSON('mansion', mansionMap);
    this.load.tilemapTiledJSON('home', HomeMap);
    this.load.tilemapTiledJSON('shop', shopMap);
    this.load.tilemapTiledJSON('library', gymOneMap);
    this.load.tilemapTiledJSON('house', houseOneMap);
    this.load.tilemapTiledJSON('level', pokeMap);
    this.load.atlas('atlas', pokeStudent, pokeStudentJSON);
    this.load.atlas('greenman', GreenManImg, GreenManJSON);
    this.load.audio('levelOne', [Home]);
    this.load.audio('lounge', [Lounge])
  }

  create() {
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage('poke', 'firstLevel');
    const belowLayer = map.createStaticLayer('Below', tileset, 0, 0);
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });

      music = this.sound.add('levelOne', { loop: true });
      music.play();
      console.log(this.data)
  roomOne = map.setTileIndexCallback(154, () => {
      player.x = 170
      player.y = 370
      music.stop()
      this.scene.start('scene2')
  }, this);
  roomTwo = map.setTileIndexCallback(163, () => {
    player.x = 630
    player.y = 320
    music.stop()
    this.scene.start('scene3')
}, this);
  roomThree = map.setTileIndexCallback(275, () => {
    player.x = 220
    player.y = 520
    music.stop()
    this.scene.start('scene4')
  }, this);
  roomFour = map.setTileIndexCallback(169, () => {
    player.x = 930
    player.y = 320
    music.stop()
    this.scene.start('scene5')
  }, this);
  roomFive = map.setTileIndexCallback(38, () => {
    player.x = 930
    player.y = 320
    music.stop()
    this.scene.start('scene6')
  }, this);

// and the second one
    const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
    player = this.physics.add
    .sprite(player.x, player.y, 'atlas', 'student-front')
    .setSize(30, 40)
    .setOffset(0, 24);

    this.NPCs = this.physics.add.staticGroup();
    this.npcOne = this.NPCs.create(350, 350, 'greenman', 'student-front-walk.000')
      .setSize(0, 38)
      .setOffset(0, 23);
    this.npcOne.text = 'Hello Fullstacker, do you want to pair program?';
    this.npcTwo = this.NPCs.create(300, 150, 'greenman', 'student-left')
      .setSize(0, 38)
      .setOffset(0, 23);


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
  player.touchesArea = false

  this.physics.add.collider(player, worldLayer);

  this.dialogue = this.add
      .text(this.npcOne.x - 10, this.npcOne.y - 10, this.npcOne.text)
      .setVisible(false);
    this.physics.add.collider(player, this.npcOne, () => {
      this.physics.pause();
      this.dialogue.setVisible(true);
      this.input.keyboard.once('keydown_A', () => {
        this.scene.switch('BattleScene');
        this.dialogue.setVisible(false);
      });
      this.input.keyboard.once('keydown_SPACE', () => {
        this.physics.resume();
        this.dialogue.setVisible(false);
      });
      return colliderActivated;
    });

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
        worldLayer.renderDebug(graphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
          faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
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

export default playGame;
