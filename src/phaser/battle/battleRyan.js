import Phaser from 'phaser';
let arr = []
let player = []
let music;
let boom;
let kaboom;
let toggle = true
let uppercut;
let battle = [{
		id: 0,
		Q: `This searches tables for matching or overlapping data \n Upon finding it, it combines \nand returns the information \ninto one new table.`,
		S: 'Inner-Join',
		A: 20
	},
	{
		id: 1,
		Q: 'This includes the matching rows as well as \n some of the non-matching rows between the two tables.',
		S: 'Outer-Join',
		A: 8
	},
	{
		id: 2,
		Q: `What keyword finds all instances that match the search criteria.\n If no criteria are given, it returns all \nthe instances in the table.`,
		S: 'Model.findAll',
		A: 8
	},
	{
		id: 3,
		Q: `What keyword finds a single instance that matches the \nsearch criteria (even if there are \nmore than one that match the search criteria \n- it will return the first it finds)`,
		S: 'Model.findOne',
		A: 8
	},
	{
		id: 4,
		Q: `What keyword finds the instance with the specified id.`,
		S: 'Model.findById',
		A: 8
	},
	{
		id: 5,
		Q: 'What keyword updates all instances that match a query.\nTakes two parameters:first contains info you want to update.\nSecond contains the query for which instances to update.',
		S: 'Model.update',
		A: 8
	},
	{
		id: 6,
		Q: `What is the process of analyzing the given \nrelation schemas based on their functional \ndependencies and primary keys to minimize \nreducdancies and CRUD anomalies.`,
		S: 'Normalization',
		A: 8
	},
	{
		id: 7,
		Q: 'XXX is a set of properties that guarantee \nthat database transactions are processed reliably.\n What is XXX?',
		S: 'ACID',
		A: 8
	} ]
var BattleSceneRyan = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function BattleScene() {
			Phaser.Scene.call(this, {
				key: 'BattleSceneRyan'
			});
		},
	init: function (data) {
		this.player = data
	},
	create: function () {
        // change the background to green now
		this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');
		this.add.tileSprite(0, 0, 750, 600, 'ryanBattle').setOrigin(0);
		this.startBattle();
		music = this.sound.add('Running', {
			loop: true
		});
		music.play();
		uppercut = this.sound.add('upperAttack', {
			loop: false
		});
		// on wake event we call startBattle too
		this.sys.events.on('wake', this.startBattle, this);
		var config = {
			key: 'explode',
			frames: this.anims.generateFrameNumbers('boom', {
				start: 0,
				end: 23,
				first: 23
			}),
			frameRate: 20,
		};
		boom = this.add.sprite(600, 250, 'boom');
		kaboom = this.add.sprite(150, 250, 'boom');
		this.anims.create(config);
	},
	startBattle: function () {
		// player character - warrior
		var player = new PlayerCharacter(this, this.player.x, this.player.y, this.player.texture, this.player.frame, this.player.name, this.player.health, battle);
		this.add.existing(player);


		var ryan = new Enemy(this, 150, 250, 'ryan', 2, 'Ryan', 100, battle);
		this.add.existing(ryan);

		// array with heroes
		this.heroes = [player];
		// array with enemies
		this.enemies = [ryan];
		// array with both parties, who will attack
		this.units = this.heroes.concat(this.enemies);

		this.index = -1; // currently active unit

		this.scene.run('UISceneRyan');
	},
	nextTurn: function () {
		// if we have victory or game over
		if (this.checkEndBattle().victory) {
			return this.endVictory()
		} else if (this.checkEndBattle().gameOver) {
			return this.endGameOver()
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
			this.units[this.index].attack('attack', this.heroes[0]);
			this.events.emit('PlayerSelect', this.index);
			// we need the player to select action and then enemy
			// pick random living hero to be attacked
			// call the enemy's attack function
			this.time.addEvent({
				delay: 2000,
				callback: this.nextTurn,
				callbackScope: this
			});
			// add timer for the next turn, so will have smooth gameplay
		}
		else {
			// helpful
		}
	},
	// check for game over or victory
	checkEndBattle: function () {
		var victory = true;
		// if all enemies are dead we have victory
		for (let i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].living) {
				victory = false;
			}
		}
		var gameOver = true;
		// if all heroes are dead we have game over
		for (let i = 0; i < this.heroes.length; i++) {
			if (this.heroes[i].living) {
				gameOver = false;
			}
		}
		let result = {
			victory,
			gameOver
		}
		return result
	},
	// when the player have selected the enemy to be attacked
	receivePlayerSelection: function (action, target) {
		if (action === 'Model.findAll') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Inner-Join') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Outer-Join') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Model.findOne') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Model.findById') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Model.update') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'Normalization') {
			this.units[this.index].attack(action, this.enemies[target]);
		} else if (action === 'ACID') {
			this.units[this.index].attack(action, this.enemies[target]);
		}
		// next turn in 3 seconds
		this.time.addEvent({
			delay: 2000,
			callback: this.nextTurn,
			callbackScope: this
		});
	},
	endVictory: function () {
		// clear state, remove sprites
		this.heroes.length = 0;
		this.enemies.length = 0;
		for (let i = 0; i < this.units.length; i++) {
			// link item
			this.units[i].destroy();
		}
		this.units.length = 0;
		// sleep the UI
		this.scene.sleep('UISceneRyan');
		// return to WorldScene and sleep current BattleScene
		arr = []
        music.stop();
		this.scene.start('scene6', {
			x: this.player.x,
			y: this.player.y,
			texture: this.player.texture,
			frame: this.player.frame,
			name: this.player.name,
            health: player.pop().data.hp += 100,
            maxHP: 100,
            points: this.player.points += 200,
            badge: this.player.badge,
            level: ''
		});

	},
	endGameOver: function () {
		// clear state, remove sprites
		this.heroes.length = 0;
		this.enemies.length = 0;
		for (let i = 0; i < this.units.length; i++) {
			// link item
			this.units[i].destroy();
		}
		this.units.length = 0;
		// sleep the UI
		this.scene.sleep('UISceneRyan');
		// // return to WorldScene and sleep current BattleScene
		arr = []
		music.stop();
		this.scene.start('scene5', {
			x: this.player.x,
			y: this.player.y,
			texture: this.player.texture,
			frame: this.player.frame,
			name: this.player.name,
            health: 0,
            maxHP: 100,
            points: this.player.points,
            badge: this.player.badge,
            level: 'scene5'
		});
	}
});


// base class for heroes and enemies
var Unit = new Phaser.Class({
	Extends: Phaser.GameObjects.Sprite,

	initialize:

		function Unit(scene, x, y, texture, _frame, type, hp, damage) {
			Phaser.GameObjects.Sprite.call(this, scene, x, y, texture)
			this.type = type;
			this.maxHp = this.hp = hp;
			this.damage = damage; // default damage
			this.living = true;
			this.menuItem = null;
		},
	// we will use this to notify the menu item when the unit is dead
	setMenuItem: function (item) {
		this.menuItem = item;
	},
	// attack the target unit is real to use
	attack: function (action, target) {
		let random = Math.floor(Math.random() * 8)
		console.log(this, target)
		if (target.living) {
			if (target.type === 'Ryan') {
				player.push({
					data: {
						hp: this.hp
					}
				})
				if (arr.length > 0 && action === arr.pop().S) {
					target.takeDamage(20)
					target.tint = 0xFF6347
					target.frame = target.texture.frames['ryan-front']
					setTimeout(() => {
						target.clearTint()
						target.frame = target.texture.frames['ryan-left']
					}, 2000)
					uppercut.play();
					this.scene.events.emit('Message', 'You: ' + action + '!!!  \n' + target.type + ' with 20 point damage')
					kaboom.anims.play('explode');
				} else {
					target.takeDamage(random)
					target.tint = 0xFF6347
					target.frame = target.texture.frames['ryan-front']
					setTimeout(() => {
						target.clearTint()
						target.frame = target.texture.frames['ryan-left']
					}, 2000)
					this.scene.events.emit('Message', 'You: ' + action + '!!!  \n' + target.type + ' with ' + random + ' point damage')
					uppercut.play();
					kaboom.anims.play('explode');
				}
			} else if (toggle){
                toggle = false
                let damage = this.damage[random];
				target.takeDamage(0)
				uppercut.play();
				this.scene.events.emit('Message', 'Ryan: \n' + damage.Q + ' !!!')
				arr.push(damage)
                }
                else {
				let damage = this.damage[random];
				target.takeDamage(50)
				uppercut.play();
				target.tint = 0xFF6347;
				target.frame = target.texture.frames['student-front']
				setTimeout(() => {
					target.clearTint()
					target.frame = target.texture.frames['student-right']
				}, 2000)
				this.scene.events.emit('Message', 'Ryan: \n' + damage.Q + ' !!!')
				arr.push(damage)
                boom.anims.play('explode');
             }
		}
	},
	takeDamage: function (damage) {
		this.hp -= damage;
		if (this.hp <= 0) {
			this.hp = 0;
			this.menuItem.unitKilled();
			this.living = false;
			this.visible = false;
			this.menuItem = null;
		}
	}
});

var Enemy = new Phaser.Class({
	Extends: Unit,

	initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		this.flipX = true;
		this.setScale(2);
		this.frame = this.texture.frames['ryan-left']
	}
});

var PlayerCharacter = new Phaser.Class({
	Extends: Unit,

	initialize: function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		this.flipX = true;
		this.setScale(2);
		this.frame = this.texture.frames['student-right']
	}
});

var MenuItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize:

		function MenuItem(x, y, text, scene) {
			Phaser.GameObjects.Text.call(this, scene, x, y, text, {
				color: '#000000',
				align: 'left',
				fontSize: 15
			});
		},
	select: function () {
		this.setColor('#fc0303');
	},
	deselect: function () {
		this.setColor('#000000');
	},
	unitKilled: function () {
		this.active = false;
		this.visible = false;
	}

});
var Menu = new Phaser.Class({
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
	addMenuItem: function (unit) {
		var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
		this.menuItems.push(menuItem);
		this.add(menuItem);
		return menuItem;
	},
	moveSelectionUp: function () {
		this.menuItems[this.menuItemIndex].deselect();
		do {
			this.menuItemIndex--;
			if (this.menuItemIndex < 0) {
				this.menuItemIndex = this.menuItems.length - 1;
			}
		} while (!this.menuItems[this.menuItemIndex].active);
		this.menuItems[this.menuItemIndex].select();
	},
	moveSelectionDown: function () {
		this.menuItems[this.menuItemIndex].deselect();
		do {
			this.menuItemIndex++;
			if (this.menuItemIndex >= this.menuItems.length) {
				this.menuItemIndex = 0;
			}
		} while (!this.menuItems[this.menuItemIndex].active);
		this.menuItems[this.menuItemIndex].select();
	},
	select: function (index) {
		if (!index) {
			index = 0;
		}
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = index;
		while (!this.menuItems[this.menuItemIndex].active) {
			this.menuItemIndex++;
			if (this.menuItemIndex >= this.menuItems.length) {
				this.menuItemIndex = 0;
			}
			if (this.menuItemIndex === index) {
				return;
			}
		}
		this.menuItems[this.menuItemIndex].select();
		this.menuItems[this.menuItemIndex].select()
		this.selected = true;
	},
	// deselect this menu
	deselect: function () {
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = 0;
		this.selected = false;
	},
	confirm: function () {},
	clear: function () {
		for (let i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].destroy();
		}
		this.menuItems.length = 0;
		this.menuItemIndex = 0;
	},
	remap: function (units) {
		this.clear();
		for (let i = 0; i < units.length; i++) {
			var unit = units[i];
			unit.setMenuItem(this.addMenuItem(unit.type));
		}
		this.menuItemIndex = 0;
	}
});

var HeroesMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

		function HeroesMenu(x, y, scene) {
			Menu.call(this, x, y, scene);
		}
});

var ActionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

		function ActionsMenu(x, y, scene) {
			Menu.call(this, x, y, scene);
			this.addMenuItem('Outer-Join');
			this.addMenuItem('Inner-Join');
			this.addMenuItem('Model.findAll');
			this.addMenuItem('Model.findOne');
			this.addMenuItem('Model.findById');
			this.addMenuItem('Model.update');
			this.addMenuItem('Normalization');
			this.addMenuItem('ACID');
		},
	confirm: function () {
		// we select an action and go to the next menu and choose from the enemies to apply the action\
		this.scene.events.emit('SelectedAction', this.menuItems[this.menuItemIndex]._text);
	}

});

var EnemiesMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

		function EnemiesMenu(x, y, scene) {
			Menu.call(this, x, y, scene);
		},
	confirm: function (index) {
		// the player has selected the enemy and we send its id with the event
		this.scene.events.emit('Enemy', this.menuItemIndex, index);
	}
});

// User Interface scene
var UISceneRyan = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function UIScene() {
			Phaser.Scene.call(this, {
				key: 'UISceneRyan'
			});
		},

	create: function () {
		// draw some background for the menu
		this.graphics = this.add.graphics();
		this.graphics.lineStyle(3, 0x000000);
		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.strokeRect(15, 380, 255, 190);
		this.graphics.fillRect(15, 380, 255, 190);
		this.graphics.strokeRect(255, 380, 240, 190);
		this.graphics.fillRect(255, 380, 240, 190);
		this.graphics.strokeRect(495, 380, 240, 190);
		this.graphics.fillRect(495, 380, 240, 190);

		// basic container to hold all menus
		this.menus = this.add.container();

		this.heroesMenu = new HeroesMenu(520, 400, this);
		this.actionsMenu = new ActionsMenu(280, 400, this);
		this.enemiesMenu = new EnemiesMenu(35, 400, this);

		// the currently selected menu
		this.currentMenu = this.actionsMenu;

		// add menus to the container
		this.menus.add(this.heroesMenu);
		this.menus.add(this.actionsMenu);
		this.menus.add(this.enemiesMenu);

		this.battleScene = this.scene.get('BattleSceneRyan');

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
	createMenu: function () {
		// map hero menu items to heroes
		this.remapHeroes();
		// map enemies menu items to enemies
		this.remapEnemies();
		// first move
		this.battleScene.nextTurn();
	},
	onEnemy: function (index, id) {
		// when the enemy is selected, we deselect all menus and send event with the enemy id
		this.heroesMenu.deselect();
		this.actionsMenu.deselect();
		this.enemiesMenu.deselect();
		this.currentMenu = null;
		this.battleScene.receivePlayerSelection(id, index);
	},
	onPlayerSelect: function (id) {
		this.heroesMenu.select(id);
		this.actionsMenu.select(0);
		this.currentMenu = this.actionsMenu;
	},
	onSelectedAction: function (index) {
		this.currentMenu = this.enemiesMenu
		this.currentMenu.confirm(index)
		// this.enemiesMenu.select(0);
	},
	remapHeroes: function () {
		var heroes = this.battleScene.heroes;
		this.heroesMenu.remap(heroes);
	},
	remapEnemies: function () {
		var enemies = this.battleScene.enemies;
		console.log(enemies)
		this.enemiesMenu.remap(enemies);
	},
	onKeyInput: function (event) {
		if (this.currentMenu && this.currentMenu.selected) {
			if (event.code === 'ArrowUp') {
				this.currentMenu.moveSelectionUp();
			} else if (event.code === 'ArrowDown') {
				this.currentMenu.moveSelectionDown();
			} else if (event.code === 'Space' || event.code === 'ArrowLeft') {
				this.currentMenu.confirm();
			}
		}
	},
	wake: function () {
		this.cursors.left.reset();
		this.cursors.right.reset();
		this.cursors.up.reset();
		this.cursors.down.reset();
	},
});
var Message = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize: function Message(scene, events) {
		Phaser.GameObjects.Container.call(this, scene, 160, 30);
		var graphics = this.scene.add.graphics();
		this.add(graphics);
		graphics.lineStyle(2, 0xffffff, 0.8);
		graphics.fillStyle(0x000000, 0.8);
		graphics.strokeRect(-60, -15, 500, 150);
		graphics.fillRect(-60, -15, 500, 150);
		this.text = new Phaser.GameObjects.Text(scene, 200, 40, '', {
			color: '#ffffff',
			align: 'center',
			fontSize: 15,
			padding: {
				top: 60
			},
			wordWrap: {
				width: 400,
				useAdvancedWrap: true
			}
		});
		this.add(this.text);
		this.text.setOrigin(0.5);
		events.on('Message', this.showMessage, this);
		this.visible = false;
	},
	showMessage: function (text) {
		this.text.setText(text);
		this.visible = true;
		if (this.hideEvent) {
			this.hideEvent.remove(false);
		}
		this.hideEvent = this.scene.time.addEvent({
			delay: 5000,
			callback: this.hideMessage,
			callbackScope: this
		});
	},
	hideMessage: function () {
		this.hideEvent = null;
		this.visible = false;
	}
});
export {
	BattleSceneRyan,
	UISceneRyan
};
