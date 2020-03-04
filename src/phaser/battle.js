let arr = [];
const player = [];
const battle = [
  {
    id: 0, Q: 'sequelize.define(name, { attributes }). What is This?', S: 'Sequelize', A: 20,
  },
  {
    id: 1, Q: 'const store = createStore(rootReducer). What is This?', S: 'Redux', A: 8,
  },
  {
    id: 2, Q: 'intermediate result for  2  * factorial( 1 ):  2. What is this', S: 'Recursion', A: 8,
  },
  {
    id: 3, Q: 'document.getElementsByTagName("p")? What is this?', S: 'DOM', A: 8,
  },
  {
    id: 4, Q: 'Model.hook(\'afterDestroy\', function () {}). What is This?', S: 'Sequelize', A: 8,
  },
  {
    id: 5, Q: '</Provider>. What is This?', S: 'Redux', A: 8,
  },
  {
    id: 6, Q: 'def factorial(n):if n == 1:return 1 else: return n * factorial(n-1). What is this', S: 'Recursion', A: 8,
  },
  {
    id: 7, Q: 'alert(paragraphs[0].nodeName). What is this?', S: 'DOM', A: 8,
  },
];
const BattleScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function BattleScene() {
      Phaser.Scene.call(this, { key: 'BattleScene' });
    },
  init(data) {
    this.player = data;
    console.log(this.player);
  },
  create() {
    // change the background to green
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');
    this.startBattle();
    // on wake event we call startBattle too
    this.sys.events.on('wake', this.startBattle, this);
  },
  startBattle() {
    // player character - warrior
    const warrior = new PlayerCharacter(this, this.player.x, this.player.y, this.player.texture, this.player.frame, this.player.name, this.player.health, battle);
    this.add.existing(warrior);


    const dragonblue = new Enemy(this, 150, 200, 'greenman', 1, 'Eliot', 100, battle);
    this.add.existing(dragonblue);

    // array with heroes
    this.heroes = [warrior];
    // array with enemies
    this.enemies = [dragonblue];
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);

    this.index = -1; // currently active unit

    this.scene.run('UIScene');
  },
  nextTurn() {
    // if we have victory or game over
    if (this.checkEndBattle().victory) {
      return this.endVictory();
    }
    if (this.checkEndBattle().gameOver) {
      return this.endGameOver();
    }
    do {
      // currently active unit
      this.index++;
      // if there are no more units, we start again from the first one
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);
    // if its player hero
    if (this.units[this.index] instanceof PlayerCharacter) {
      // we need the player to select action and then enemy
      this.events.emit('PlayerSelect', this.index);
    } else { // else if its enemy unit
      // pick random living hero to be attacked
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      // call the enemy's attack function
      this.units[this.index].attack('attack', this.heroes[r]);
      // add timer for the next turn, so will have smooth gameplay
      this.time.addEvent({ delay: 2000, callback: this.nextTurn, callbackScope: this });
    }
  },
  // check for game over or victory
  checkEndBattle() {
    let victory = true;
    // if all enemies are dead we have victory
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) { victory = false; }
    }
    let gameOver = true;
    // if all heroes are dead we have game over
    for (var i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living) { gameOver = false; }
    }
    const result = { victory, gameOver };
    return result;
  },
  // when the player have selected the enemy to be attacked
  receivePlayerSelection(action, target) {
    if (action === 'DOM') {
      this.units[this.index].attack(action, this.enemies[target]);
    } else if (action === 'Recursion') {
      this.units[this.index].attack(action, this.enemies[target]);
    } else if (action === 'Sequelize') {
      this.units[this.index].attack(action, this.enemies[target]);
    } else if (action === 'Redux') {
      this.units[this.index].attack(action, this.enemies[target]);
    }
    // next turn in 3 seconds
    this.time.addEvent({ delay: 2000, callback: this.nextTurn, callbackScope: this });
  },
  endVictory() {
    // clear state, remove sprites
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      // link item
      this.units[i].destroy();
    }
    this.units.length = 0;
    // sleep the UI
    this.scene.sleep('UIScene');
    // return to WorldScene and sleep current BattleScene
    arr = [];
    console.log(player.pop());
    this.scene.start('PlayGame', {
      x: this.player.x,
      y: this.player.y,
      texture: this.player.texture,
      frame: this.player.frame,
      name: this.player.name,
      health: player.pop().data.hp += 100,
    });
  },
  endGameOver() {
    // clear state, remove sprites
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      // link item
      this.units[i].destroy();
    }
    this.units.length = 0;
    // sleep the UI
    this.scene.sleep('UIScene');
    // return to WorldScene and sleep current BattleScene
    arr = [];
    this.scene.start('scene5', this.units);
  },
});


// base class for heroes and enemies
const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage; // default damage
      this.living = true;
      this.menuItem = null;
    },
  // we will use this to notify the menu item when the unit is dead
  setMenuItem(item) {
    this.menuItem = item;
  },
  // attack the target unit
  attack(action, target) {
    const random = Math.floor(Math.random() * 8);
    if (target.living) {
      if (target.type === 'Eliot') {
        console.log(this);
        player.push({ data: { hp: this.hp } });
        if (arr.length > 0 && action === arr.pop().S) {
          target.takeDamage(20);
          this.scene.events.emit('Message', `You: ${action}!!!  \n${target.type} with 20 point damage`);
          target.frame = target.texture.frames['greenman-left'];
          setTimeout(() => {
            target.frame = target.texture.frames['greenman-back'];
          }, 1000);
        } else {
          target.takeDamage(random);
          this.scene.events.emit('Message', `You: ${action}!!!  \n${target.type} with ${random} point damage`);
          target.frame = target.texture.frames['greenman-right'];
          setTimeout(() => {
            target.frame = target.texture.frames['greenman-back'];
          }, 1000);
        }
      } else {
        this.frame = this.texture.frames['greenman-back'];
        target.frame = target.texture.frames['student-right'];
        const damage = this.damage[random];
        target.takeDamage(8);
        this.scene.events.emit('Message', `Eliot: \n${damage.Q} !!!`);
        arr.push(damage);
        setTimeout(() => {
          target.frame = target.texture.frames['student-back'];
        }, 1000);
      }
    }
  },
  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  },
});

var Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
      this.flipX = true;
      this.setScale(2);
    },
});

var PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
      this.flipX = true;
      this.setScale(2);
    },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
    },
  select() {
    this.setColor('#fc0303');
  },
  deselect() {
    this.setColor('#ffffff');
  },
  unitKilled() {
    this.active = false;
    this.visible = false;
  },

});
const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene, heroes) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.x = x;
      this.y = y;
      this.selected = false;
    },
  addMenuItem(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) { this.menuItemIndex = this.menuItems.length - 1; }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) { this.menuItemIndex = 0; }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  select(index) {
    if (!index) { index = 0; }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) { this.menuItemIndex = 0; }
      if (this.menuItemIndex == index) { return; }
    }
    this.menuItems[this.menuItemIndex].select();
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },
  // deselect this menu
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },
  confirm() {
  },
  clear() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
  },
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function HeroesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem('DOM');
      this.addMenuItem('Recursion');
      this.addMenuItem('Redux');
      this.addMenuItem('Sequelize');
    },
  confirm() {
    // we select an action and go to the next menu and choose from the enemies to apply the action\
    this.scene.events.emit('SelectedAction', this.menuItems[this.menuItemIndex]._text);
  },

});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function EnemiesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
  confirm(index) {
    // the player has selected the enemy and we send its id with the event
    this.scene.events.emit('Enemy', this.menuItemIndex, index);
  },
});

// User Interface scene
const UIScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function UIScene() {
      Phaser.Scene.call(this, { key: 'UIScene' });
    },

  create() {
    // draw some background for the menu
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(2, 400, 240, 150);
    this.graphics.fillRect(2, 400, 240, 150);
    this.graphics.strokeRect(240, 400, 240, 150);
    this.graphics.fillRect(240, 400, 240, 150);
    this.graphics.strokeRect(480, 400, 240, 150);
    this.graphics.fillRect(480, 400, 240, 150);

    // basic container to hold all menus
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(510, 420, this);
    this.actionsMenu = new ActionsMenu(260, 420, this);
    this.enemiesMenu = new EnemiesMenu(10, 420, this);

    // the currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('BattleScene');

    // listen for keyboard events
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    // when its player cunit turn to move
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

    // when the action on the menu is selected
    // for now we have only one action so we dont send an action id
    this.events.on('SelectedAction', this.onSelectedAction, this);

    // an enemy is selected
    this.events.on('Enemy', this.onEnemy, this);

    // when the scene receives wake event
    this.sys.events.on('wake', this.createMenu, this);

    // the message describing the current action
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  },
  createMenu() {
    // map hero menu items to heroes
    this.remapHeroes();
    // map enemies menu items to enemies
    this.remapEnemies();
    // first move
    this.battleScene.nextTurn();
  },
  onEnemy(index, id) {
    // when the enemy is selected, we deselect all menus and send event with the enemy id
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection(id, index);
  },
  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },
  onSelectedAction(index) {
    this.currentMenu = this.enemiesMenu;
    this.currentMenu.confirm(index);
    // this.enemiesMenu.select(0);
  },
  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  },
  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
  },
  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {

      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  },
  wake() {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  },
});
var Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize:
    function Message(scene, events) {
      Phaser.GameObjects.Container.call(this, scene, 160, 30);
      const graphics = this.scene.add.graphics();
      this.add(graphics);
      graphics.lineStyle(1, 0xffffff, 0.8);
      graphics.fillStyle(0x031f4c, 0.3);
      graphics.strokeRect(-60, -15, 500, 150);
      graphics.fillRect(-60, -15, 500, 150);
      this.text = new Phaser.GameObjects.Text(scene, 200, 40, '', {
        color: '#ffffff', align: 'center', fontSize: 15, padding: { top: 10 }, wordWrap: { width: 400, useAdvancedWrap: true },
      });
      this.add(this.text);
      this.text.setOrigin(0.5);
      events.on('Message', this.showMessage, this);
      this.visible = false;
    },
  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) { this.hideEvent.remove(false); }
    this.hideEvent = this.scene.time.addEvent({ delay: 5000, callback: this.hideMessage, callbackScope: this });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  },
});
export { BattleScene, UIScene };
