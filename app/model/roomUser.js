const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');

const RoomUser = dbConfig.define('roomUsers', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomId: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.STRING
  },
},{});

//テーブル作成
Room.sync().then(() => {
    console.log('rooms table created')
});

module.exports = RoomUser;