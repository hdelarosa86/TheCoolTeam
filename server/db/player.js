const { STRING, INTEGER, FLOAT } = require('sequelize');
const db = require('./database');
const Player = db.define('player', {
  x: {
    type: FLOAT,
  },
  y: {
    type: FLOAT,
  },
  texture: {
    type: STRING,
    defaultValue: 'atlas',
  },
  frame: {
    type: INTEGER,
    defaultValue: 3,
  },
  name: { type: STRING, defaultValue: 'Student' },
  health: { type: INTEGER, defaultValue: 100 },
  //maxHp: 0,
  points: { type: INTEGER, defaultValue: 0 },
  badge: { type: STRING, defaultValue: '' },
  notify: { type: STRING, defaultValue: 'on' },
  level: { type: STRING, defaultValue: '' },
});

module.exports = Player;
