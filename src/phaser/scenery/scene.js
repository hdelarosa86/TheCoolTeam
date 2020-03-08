import Phaser from 'phaser';
import axios from 'axios';
import {
  gymOneImg,
  HomeImg,
  HomeMap,
  GreenManImg,
  GreenManJSON,
  PinkManImg,
  PinkManJSON,
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
  Library,
  battleOne,
  shopImg,
  shopMap,
  shopObj,
  Mansion,
  House,
  Shop,
  uppercut,
  battleLevel,
  explosion,
  ElliotImg,
  ElliotJSON,
  SteveImg,
  SteveJSON,
  BaggieImg,
  BaggieJSON,
  KevinImg,
  KevinJSON,
  MarkImg,
  MarkJSON,
  RyanImg,
  RyanJSON,
  ProfImg,
  ProfJSON,
  RussellImg,
  RussellJSON,
  GinImg,
  GinJSON,
  BluImg,
  BluJSON,
  battleProf,
  battleGround,
  PandaManImg,
  PandaManJSON,
  markBackground,
  California,
  Tim,
  Running,
  ryanLevel,
  eliotLevel,
  russellLevel,
  RussellSong
} from '../assets';

let cursors;
let player = {
  x: 100,
  y: 364,
};

let toggle = '';

let badges = [
  { badge: 'DOMBadge', points: 200 },
  { badge: 'StretchesBadge', points: 600 },
  { badge: 'FoundationBadge', points: 1000 },
  { badge: 'JuniorBadge', points: 1200 },
  { badge: 'SeniorBadge', points: 1400 },
  { badge: 'GraceShopperBadge', points: 1800 },
  { badge: 'StackathonBadge', points: 2000 },
  { badge: 'ReactoBadge', points: 2400 },
  { badge: 'CapstoneBadge', points: 3000 },
  { badge: 'FullstackChampionBadge', points: 5000 },
];
let showDebug = false;
let yesOrNo = '(Y/N)';

class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }

  init(data) {
    if (Object.keys(data).length === 0) {
      data = {
        x: 600,
        y: 250,
        texture: 'atlas',
        frame: 3,
        name: 'Student',
        health: 100,
        maxHp: 0,
        points: 0,
        badge: 'none',
        notify: 'on',
        level: '',
      };
    }
    this.player = data;
    if (this.player.level === 'scene5') {
      player.x = 930;
      player.y = 320;
      this.player.level = '';
    }
  }
  preload() {
    this.load.image('firstLevel', pokeImg);
    this.load.spritesheet('boom', explosion, {
      frameWidth: 64,
      frameHeight: 64,
      endFrame: 23,
    });
    this.load.image('houseLevel', houseOneImg);
    this.load.image('battleGround', battleGround);
    this.load.image('MarkBattle', markBackground);
    this.load.image('ryanBattle', ryanLevel);
    this.load.image('eliotBattle', eliotLevel);
    this.load.image('russellBattle', russellLevel);
    this.load.image('battleScene', battleLevel);
    this.load.image('libraryLevel', gymOneImg);
    this.load.image('shopLevel', shopImg);
    this.load.image('homeLevel', HomeImg);
    this.load.image('mansionLevel', mansionImg);
    this.load.tilemapTiledJSON('mansion', mansionMap);
    this.load.tilemapTiledJSON('home', HomeMap);
    this.load.tilemapTiledJSON('shop', shopMap);
    this.load.tilemapTiledJSON('library', gymOneMap);
    this.load.tilemapTiledJSON('house', houseOneMap);
    this.load.tilemapTiledJSON('level', pokeMap);
    this.load.atlas('atlas', pokeStudent, pokeStudentJSON);
    this.load.atlas('greenman', GreenManImg, GreenManJSON);
    this.load.atlas('mark', MarkImg, MarkJSON);
    this.load.atlas('pinkman', PinkManImg, PinkManJSON);
    this.load.atlas('panda', PandaManImg, PandaManJSON);
    this.load.atlas('russell', RussellImg, RussellJSON);
    this.load.atlas('ryan', RyanImg, RyanJSON);
    this.load.atlas('prof', ProfImg, ProfJSON);
    this.load.atlas('kevin', KevinImg, KevinJSON);
    this.load.atlas('baggie', BaggieImg, BaggieJSON);
    this.load.atlas('gin', GinImg, GinJSON);
    this.load.atlas('blu', BluImg, BluJSON);
    this.load.atlas('elliot', ElliotImg, ElliotJSON);
    this.load.atlas('steve', SteveImg, SteveJSON);
    this.load.audio('levelOne', [Home]);
    this.load.audio('battleOne', [battleOne]);
    this.load.audio('russellSong', [RussellSong]);
    this.load.audio('lounge', [Lounge]);
    this.load.audio('Library', [Library]);
    this.load.audio('mansion', [Mansion]);
    this.load.audio('MarkSong', [California]);
    this.load.audio('house', [House]);
    this.load.audio('shop', [Shop]);
    this.load.audio('upperAttack', [uppercut]);
    this.load.audio('professor', [battleProf]);
    this.load.audio('Tim', [Tim]);
    this.load.audio('Running', [Running]);
  }

  create() {
    const createNPC = (
      x,
      y,
      spriteName,
      spriteFrame,
      text,
      reference,
      battleScene
    ) => {
      let npc = this.NPCs.create(x, y, spriteName, spriteFrame)
        .setSize(0, 38)
        .setOffset(0, 23);
      npc.text = text || '';
      npc.reference = reference;
      npc.battleScene = battleScene;
      return npc;
    };

    const map = this.make.tilemap({
      key: 'level',
    });
    const tileset = map.addTilesetImage('poke', 'firstLevel');
    map.createStaticLayer('Below', tileset, 0, 0);
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    worldLayer.setCollisionByProperty({
      collides: true,
    });
    let music = this.sound.add('levelOne', {
      loop: true,
    });
    music.play();

    map.setTileIndexCallback(
      154,
      () => {
        player.x = 170;
        player.y = 370;
        music.stop();
        this.scene.start('scene2', this.player);
      },
      this
    );
    map.setTileIndexCallback(
      163,
      () => {
        player.x = 630;
        player.y = 320;
        music.stop();
        this.scene.start('scene3', this.player);
      },
      this
    );
    map.setTileIndexCallback(
      275,
      () => {
        player.x = 220;
        player.y = 520;
        music.stop();
        this.scene.start('scene4', this.player);
      },
      this
    );
    map.setTileIndexCallback(
      169,
      () => {
        player.x = 930;
        player.y = 320;
        music.stop();
        this.scene.start('scene5', this.player);
      },
      this
    );
    map.setTileIndexCallback(
      38,
      () => {
        player.x = 380;
        player.y = 120;
        music.stop();
        this.scene.start('scene6', this.player);
      },
      this
    );

    player = this.physics.add
      .sprite(player.x, player.y, 'atlas', 'student-front')
      .setSize(30, 40)
      .setOffset(0, 24);

    this.physics.add.collider(player, worldLayer);

    const anims = this.anims;
    anims.create({
      key: 'student-left-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-left-walk.',
        start: 0,
        end: 4,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'student-right-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-right-walk.',
        start: 0,
        end: 4,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'student-front-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-front-walk.',
        start: 0,
        end: 4,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'student-back-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'student-back-walk.',
        start: 0,
        end: 4,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    badges.forEach(obj => {
      if (this.player.points === obj.points && toggle !== obj.badge) {
        toggle = obj.badge;
        this.player.badge = obj.badge;
        this.dialogue = this.add
          .text(130, 500, `You just got ${obj.badge} and 100 more health`, {
            wordWrap: {
              width: 500,
            },
            padding: {
              top: 15,
              right: 15,
              bottom: 15,
              left: 15,
            },
            align: 'left',
            backgroundColor: '#ffffff',
            color: '#ff0000',
          })
          .setScrollFactor(0)
          .setDepth(30);
        setTimeout(() => {
          this.dialogue.destroy();
        }, 3000);
      }
    });

    this.speech = this.add
      .text(16, 16, `HP: ${this.player.health} Badge: ${this.player.badge}`, {
        wordWrap: {
          width: 500,
        },
        padding: {
          top: 15,
          right: 15,
          bottom: 15,
          left: 15,
        },
        align: 'left',
        backgroundColor: '#c90000',
        color: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(30);

    this.gamePlayMenu = this.add
      .text(600, 16, '--L to load previous save', {
        wordWrap: {
          width: 180,
        },
        padding: {
          top: 15,
          right: 15,
          bottom: 15,
          left: 15,
        },
        align: 'left',
        //backgroundColor: '#c90000',
        color: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(30);

    this.NPCs = this.physics.add.staticGroup();

    this.npcOne = createNPC(
      30,
      360,
      'greenman',
      'greenman-right',
      'Hello Fullstacker, do you want to pair program?',
      'npcOne',
      'BattleSceneRussell'
    );
    this.npcTwo = createNPC(
      1470,
      310,
      'kevin',
      'kevin-left',
      'Hello man, do you want to pratice Promises?',
      'npcTwo',
      'BattleSceneKevin'
    );
    this.npcThree = createNPC(
      1470,
      360,
      'pinkman',
      'pinkman-left',
      'You are not worth my time!',
      'npcThree',
      'BattleScenePink'
    );
    this.npcSave = createNPC(
      470,
      260,
      'panda',
      'panda-front',
      'You want to save your progress?',
      'npcSave',
      null
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
        _spriteNPC.x,
        _spriteNPC.y,
        _spriteNPC.texture.key,
        `${_spriteNPC.texture.key}-${direction}`,
        _spriteNPC.text,
        _spriteNPC.reference
      );

      this.physics.pause();
      this.anims.pauseAll();
      this.dialogue = this.add
        .text(130, 500, `${_spriteNPC.text} ${yesOrNo}`, {
          wordWrap: {
            width: 500,
          },
          padding: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15,
          },
          align: 'left',
          backgroundColor: '#ffffff',
          color: '#ff0000',
        })
        .setScrollFactor(0)
        .setDepth(30);
      this.physics.paused = true;

      this.input.keyboard.on('keydown_Y', () => {
        this.physics.resume();
        this.anims.resumeAll();
        this.physics.paused = false;
        if (_spriteNPC.reference === 'npcSave') {
          axios.post('/api', this.player).then(() => {
            this.dialogue.destroy();
            this.dialogue = this.add
              .text(300, 500, 'Game Succesfully Saved', {
                wordWrap: {
                  width: 500,
                },
                padding: {
                  top: 15,
                  right: 15,
                  bottom: 15,
                  left: 15,
                },
                align: 'left',
                backgroundColor: '#ffffff',
                color: '#ff0000',
              })
              .setScrollFactor(0)
              .setDepth(30);
          });
          setTimeout(() => this.dialogue.destroy(), 2500);
        } else {
          music.stop();
          this.scene.start(_spriteNPC.battleScene, this.player);
        }
      });

      this.input.keyboard.on('keydown_N', () => {
        this.physics.resume();
        this.anims.resumeAll();
        this.physics.paused = false;
        this.dialogue.destroy();
        this[_spriteNPC.reference].destroy();
        this[_spriteNPC.reference] = createNPC(
          _spriteNPC.x,
          _spriteNPC.y,
          _spriteNPC.texture.key,
          _spriteNPC.frame.name,
          _spriteNPC.text
        );
      });
    });

    const camera = this.cameras.main;
    camera.startFollow(player);
    cursors = this.input.keyboard.createCursorKeys();
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.input.keyboard.once('keydown_D', event => {
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
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    });

    this.input.keyboard.on('keydown_L', () => {
      if (!this.menuBox) {
        this.menuBox = this.add
          .text(
            150,
            300,
            `Do you wish to load from your last save? ${yesOrNo}`,
            {
              wordWrap: {
                width: 500,
              },
              padding: {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15,
              },
              align: 'left',
              backgroundColor: '#ffffff',
              color: '#ff0000',
            }
          )
          .setScrollFactor(0)
          .setDepth(30);

        this.input.keyboard.on('keydown_Y', () => {
          this.menuBox.destroy();
          this.menuBox = null;

          axios
            .get('/api')
            .then(response => response.data)
            .then(returnedData => {
              console.log(returnedData[0]);
              player.x = returnedData[0].x;
              player.y = returnedData[0].y;
              returnedData[0].x = 600;
              returnedData[0].y = 250;
              delete returnedData[0].id;
              delete returnedData[0].createdAt;
              delete returnedData[0].updatedAt;
              player.x = 523;
              player.y = 310;
              this.scene.restart(returnedData[0]);
            });
        }); //end of Y keydown

        this.input.keyboard.on('keydown_N', () => {
          this.menuBox.destroy();
          this.menuBox = null;
        }); //end of N keydown
      }
    });
  }

  update(time, delta) {
    // Runs once per frame for the duration of the scene
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);
    // Horizontal movement
    if (!this.physics.paused) {
      if (cursors.left.isDown) player.body.setVelocityX(-speed);
      else if (cursors.right.isDown) player.body.setVelocityX(speed);

      // Vertical movement
      if (cursors.up.isDown) player.body.setVelocityY(-speed);
      else if (cursors.down.isDown) player.body.setVelocityY(speed);

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      player.body.velocity.normalize().scale(speed);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (cursors.left.isDown) {
        player.anims.play('student-left-walk', true);
      } else if (cursors.right.isDown) {
        player.anims.play('student-right-walk', true);
      } else if (cursors.up.isDown) {
        player.anims.play('student-back-walk', true);
      } else if (cursors.down.isDown) {
        player.anims.play('student-front-walk', true);
      } else {
        player.anims.stop();
        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) {
          player.setTexture('atlas', 'student-left');
        } else if (prevVelocity.x > 0) {
          player.setTexture('atlas', 'student-right');
        } else if (prevVelocity.y < 0) {
          player.setTexture('atlas', 'student-back');
        } else if (prevVelocity.y > 0) {
          player.setTexture('atlas', 'student-front');
        }
      }
    }
  }
}

export { shopObj, playGame };
