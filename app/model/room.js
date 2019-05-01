const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');

const Room = dbConfig.define('rooms', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
},{});

//テーブル作成
Room.sync().then(() => {
    console.log('rooms table created')
});

module.exports = Room;