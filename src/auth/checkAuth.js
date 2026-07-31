'use strict'

const ApiKeyService = require("../services/apiKey.service")
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

    const apiKeyStore = await ApiKeyService.findByKey(apiKey)
    if (!apiKeyStore) {
      // await ApiKeyService.create({
      //   key: crypto.randomBytes(64).toString('hex'),
      //   permissions: ['0000']
      // })
      
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

module.exports = {
  apiKey,
  checkPermisson
}