const { STRING, INTEGER, BIGINT, UUID, UUIDV4, BOOLEAN } = require('sequelize');
const db = require('./database');
const Player = db.define(
  'player', {

  }
)

module.exports = Player;
