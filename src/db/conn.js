const {Sequelize} = require('sequelize')
const path = require('path')
const env = process.env.NODE_ENV || 'local_development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]

const sequelize = new Sequelize(config['db_name'], config['db_user'], config['db_pw'], {
    host: config['db_host'],
    dialect: config['db_dialect']
})

try {
    sequelize.authenticate()
    console.log(`Conected with DB at ${config['db_host']}:${config['db_port']}`);
} catch (error) {
    console.log(`Conection error with DB!: ${error}`);
}
module.exports = sequelize