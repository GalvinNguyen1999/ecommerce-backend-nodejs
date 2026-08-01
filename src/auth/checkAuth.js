'use strict'

const { findByKey } = require("../services/apiKey.service")
const crypto = require('crypto')

const HEADERS = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADERS.API_KEY]?.toString()
    if (!apiKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      })
    }

    const apiKeyStore = await findByKey(apiKey)
    if (!apiKeyStore) {
      return res.status(403).json({
        message: 'Forbidden Error',
      })
    }

    req.apiKey = apiKeyStore
    next()
  } catch (error) {
    
  }
}

const checkPermisson = (permission) => {
  return (req, res, next) => {
    const apiKey = req?.apiKey
    if (!apiKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied',
      })
    }

    if (!apiKey.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Permission denied',
      })
    }

    next()
  }
}

const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

// const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next)

module.exports = {
  apiKey,
  checkPermisson,
  asyncHandler
}