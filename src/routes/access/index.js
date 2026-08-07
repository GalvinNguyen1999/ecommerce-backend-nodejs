'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticationv2 } = require('../../auth/authUtil')

router.post('/shop/signup', asyncHandler(accessController.signup))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authenticationv2)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken))

module.exports = router