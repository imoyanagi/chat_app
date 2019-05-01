'use strict';
module.exports = (sequelize, DataTypes) => {
  const roomUser = sequelize.define('roomUser', {
    roomId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  roomUser.associate = function(models) {
    // associations can be defined here
    roomUser.belongsTo(models.user);
    roomUser.belongsTo(models.room);
  };
  return roomUser;
};