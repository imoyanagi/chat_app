## 環境
  vagrant ubuntu 16.04  
  node.js v10.15.3  
  Express 4.16.4  
  PostgreSql 9.5.16  
  Sequelize　5.7.6  

## 実行

1.モジュールのインストール：`npm install`  
2.データベースを作成、db/db-config.jsを以下のように書き換え  
  `const dbConfig = new Sequelize('database', 'user', 'password', {...`  
3.実行：`node app.js`

## 実装したが理解できていない、うまく行かないところ
<dl>
	<dt>app.jsの"if (!module.parent)"がなんのためにあるのか</dt>
	<dd>moduleを全て読み込んだ後に実行するという意味だと考えたが、無くても動作に影響がない。</dd>
	<dt>express-sessionのオプション</dt>
	<dd>resaveとsaveUninitializedはfalseを推奨されているがどういう使い分けなのか</dd>
	<dt>モジュールの分け方</dt>
	<dd>railsのように型が決まっていないのでどうするのがベストなのか</dd>
	<dt></dt>
	<dd></dd>
	<dt></dt>
	<dd></dd>
</dl>
