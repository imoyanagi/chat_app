const Sequelize = require('sequelize');

/**
 * company に対する接続設定を定義
 */
const dbConfig = new Sequelize('chat', 'vagrant', '1111', {
  // 接続先ホストを指定
  host: 'localhost',

  // 使用する DB 製品を指定
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = dbConfig;

// dbConfig
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });