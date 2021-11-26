const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const env = process.env.NODE_ENV || 'local_development'
const config = require(path.join(__dirname, 'config', 'config.json'))[env]

const routes = require(path.join(__dirname, 'routes', 'index.js'))

// config json response
app.use(express.json())

// solve CORS
app.use(cors({
    credentials: true,
    origin: `http://${config['host']}:${config['port']}`
}))

// public folder for images
app.use(express.static('public'))

// Routes
routes(app)

module.exports = app

