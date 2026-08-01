const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()
const { BadRequestError } = require('./core/error.response')

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

// handle error
app.use((req, res, next) => {
  next(new BadRequestError('Not Found'))
})

app.use((err, req, res, next) => {
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: err.message,
    status: 'error',
    code: statusCode
  })
})

// handling error
module.exports = app
