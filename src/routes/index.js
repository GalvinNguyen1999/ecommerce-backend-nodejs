'use strict'

const express = require('express')
const router = express.Router()
const { apiKey, checkPermisson } = require('../auth/checkAuth')

// Check api key
router.use(apiKey)

// check permission
router.use(checkPermisson('0000'))

router.use('/v1/api', require('./access'))

module.exports = router