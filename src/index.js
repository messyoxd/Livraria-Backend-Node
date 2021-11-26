const path = require('path')
const app = require(path.join(__dirname, 'app.js'))

const env = process.env.NODE_ENV || 'local_development'
const config = require(path.join(__dirname, 'config', 'config.json'))[env]
const conn = require(path.join(__dirname, 'db', 'conn.js'))

conn
  .sync()
  .then(() => app.listen(config['port']))
  .catch((err) => console.log(err));

