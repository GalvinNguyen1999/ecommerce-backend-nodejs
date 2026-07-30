const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
require('./dbs/init.mongodb')
const { checkOverLoad } = require('./helpers/check.connect')
checkOverLoad()

// innit route
app.use('/', require('./routes'))

// handling error
module.exports = app
