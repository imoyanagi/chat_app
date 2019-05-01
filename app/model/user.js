const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');

const User = dbConfig.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
}, {
  // タイムスタンプの属性 (updatedAt, createdAt) が不要ならば次のプロパティは false
  timestamps: false,

  // テーブル名を変更したくない場合は次のプロパティを true
  // デフォルトでは sequelize はテーブル名を複数形に変更する
});

//テーブル作成
User.sync().then(() => {
    console.log('users table created')
});

module.exports = User;