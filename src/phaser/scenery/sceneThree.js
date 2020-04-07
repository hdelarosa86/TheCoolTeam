import React from 'react';
import Phaser from 'phaser';

let controls;
let cursors;
let player;
let music;
let tile;
const showDebug = false;

class SceneThree extends Phaser.Scene {
  constructor() {
    super('scene3');
  }
  init(data){
    this.player = data
  }
  create() {
    const createNPC = (x, y, spriteName, spriteFrame, text, reference, battleScene) => {
      let npc = this.NPCs.create(x, y, spriteName, spriteFrame)
          .setSize(0, 38)
          .setOffset(0, 23);
      npc.text = text || '';
      npc.reference = reference;
      npc.battleScene = battleScene;
      return npc;
  };

    const map = this.make.tilemap({ key: 'library' });
    const tileset = map.addTilesetImage('houseTwo', 'libraryLevel');
    const houseLayer = map.createStaticLayer('library', tileset, 0, 0);

    music = this.sound.add('Library', { loop: true });

    music.play();

    this.speech = this.add.text(16, 16, `HP: ${this.player.health} Badge: ${this.player.badge}`, {
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
      backgroundColor: '#c90000',
      color: '#ffffff',
  })
  .setScrollFactor(0)
  .setDepth(30);

    tile = map.setTileIndexCallback(465, () => {
      music.stop();
      this.scene.start('PlayGame');
    }, this);

    houseLayer.setCollisionByProperty({ collides: true });
    const spawnPoint = map.findObject('SpawnPoint', (obj) => obj.name === 'spawn');
    player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'student-back')
      .setSize(30, 40)
      .setOffset(0, 24);

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

    this.physics.add.collider(player, houseLayer);

    this.NPCs = this.physics.add.staticGroup();

      this.npcOne = createNPC(
          400, 650, 'blu', 'blu-front', 'Meg Duffy: Be sure to add you final resume soon?', 'npcOne'
      );
      this.npcTwo = createNPC(
          1000, 650, 'kevin', 'kevin-left', 'I hear that Master Prof is in charge of DOM. You better practice your DOM.', 'npcTwo'
      );
      this.npcThree = createNPC(
          950, 650, 'pinkman', 'pinkman-right', 'First time at fullstack academy. Word of wisdom: code is your life.', 'npcThree'
      );
      this.npcFour = createNPC(
        750, 360, 'steve', 'steve-back', `I need to study.... Ahh Man, I completely lost to the master fellow. He's insane in code, I need to ask a fellow for Help. I'm having a PANIC ATTACK!!!`, 'npcFour'
      );
      this.npcFive = createNPC(
        400, 500, 'baggie', 'baggie-right', `Ryan's backend problems are something else. I need to go back and study Sequelize & API, so I can get past him.`, 'npcFive'
    );
      this.npcSix = createNPC(
       450, 500, 'gin', 'gin-left', `Man, Mark got me with his algos again, couldn't get past his questions.`, 'npcSix'
    );

      this.physics.add.collider(player, this.NPCs, (player, spriteNPC) => {
          let _spriteNPC = spriteNPC;
          let directionObj = spriteNPC.body.touching;
          let direction = null;
          for (let key in directionObj) {
              if (directionObj[key]) {
                  if (key === 'down') {
                      direction = 'front';
                  } else if (key === 'up') {
                      direction = 'back';
                  } else {
                      direction = key;
                  }
              }
          }
          spriteNPC.destroy();
          this[_spriteNPC.reference] = createNPC(
              _spriteNPC.x, _spriteNPC.y, _spriteNPC.texture.key, `${_spriteNPC.texture.key}-${direction}`, _spriteNPC.text, _spriteNPC.reference
          );

          this.physics.pause();
          this.anims.pauseAll();
          this.dialogue = this.add
              .text(130, 450, `${_spriteNPC.text} \n[Space]`, {
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
                  color: '#ff0000',
              })
              .setScrollFactor(0)
              .setDepth(30);
          this.physics.paused = true;

          this.input.keyboard.on('keydown_SPACE', () => {
            this.physics.resume();
            this.anims.resumeAll();
            this.physics.paused = false;
            this.dialogue.destroy();
            this[_spriteNPC.reference].destroy();
            this[_spriteNPC.reference] = createNPC(
                _spriteNPC.x, _spriteNPC.y, _spriteNPC.texture.key, _spriteNPC.frame.name, _spriteNPC.text
            );
        });
      });

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

export default SceneThree;
