'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtil')

router.post('/shop/signup', asyncHandler(accessController.signup))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken))

module.exports = router