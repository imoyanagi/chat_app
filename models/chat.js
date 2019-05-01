'use strict';
module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define('chat', {
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    msg: DataTypes.STRING
  }, {});
  chat.associate = function(models) {
    // associations can be defined here
    chat.belongsTo(models.room)
    chat.belongsTo(models.user)
  };
  return chat;
};