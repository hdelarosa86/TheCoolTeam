import React from 'react';
import Phaser from 'phaser';

let controls;
let cursors;
let player;
let music;
let tile;
const showDebug = false;
let yesOrNo = '(Y/N)';

class SceneSix extends Phaser.Scene {
  constructor() {
    super('scene6');
  }
  init(data){
    this.player = data
  }
  create() {
    const createNPC = (x, y, spriteName, spriteFrame, text, reference, battleScene, points) => {
      let npc = this.NPCs.create(x, y, spriteName, spriteFrame)
          .setSize(0, 38)
          .setOffset(0, 23);
      npc.text = text || '';
      npc.reference = reference;
      npc.battleScene = battleScene;
      npc.point = points
      return npc;
  };
    const map = this.make.tilemap({ key: 'mansion' });
    const tileset = map.addTilesetImage('mansion', 'mansionLevel');
    const mansionLayer = map.createStaticLayer('mansion', tileset, 0, 0);

    music = this.sound.add('mansion', { loop: true });

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

    tile = map.setTileIndexCallback(585, () => {
      music.stop();
      this.scene.start('PlayGame');
    }, this);

    mansionLayer.setCollisionByProperty({ collides: true });
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

    this.physics.add.collider(player, mansionLayer);

    this.NPCs = this.physics.add.staticGroup();

      this.npcOne = createNPC(
        600, 120, 'ryan', 'ryan-front', `Hey Fullstacker, please tell me you watched inuyasha?`, 'npcOne', 'BattleSceneRyan', 2000
      );
      this.npcTwo = createNPC(
        1000, 120, 'mark', 'mark-right', `Hey Fullstacker, are you ready to get REACTO'd?`, 'npcTwo', 'BattleSceneMark', 2400
      );
      this.npcThree = createNPC(
        300, 260, 'russell', 'russell-right', 'You better be ready for some interview experience?', 'npcThree', 'BattleSceneRussell', 3000
      );
      this.npcFour = createNPC(
        325, 520, 'elliot', 'elliot-back', `Hey Buddy, Are you ready for the big boss.I'll try to go easy on you?`, 'npcFour', 'BattleSceneEliot', 5000
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
              .text(130, 500, `${_spriteNPC.text} ${yesOrNo}`, {
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

          this.input.keyboard.on('keydown_Y', () => {
            if ( this.player.points < 2000 ){
                  this.stat = this.add
                  .text(130, 500, `You can't be here without a better badge`, {
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
                  setTimeout(() => { this.stat.destroy() }, 2000)
                  this.physics.resume();
                  this.anims.resumeAll();
                  this.dialogue.destroy()
                  this.physics.paused = false;
                  console.log(this.player)
              }
              else {
                this.scene.start(_spriteNPC.battleScene, this.player);
                this.physics.resume();
                this.anims.resumeAll();
                music.stop();
                this.physics.paused = false;
              }
            })

          this.input.keyboard.on('keydown_N', () => {
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

export default SceneSix;
