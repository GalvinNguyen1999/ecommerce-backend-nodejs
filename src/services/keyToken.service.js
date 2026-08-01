'use strict'

const keyTokenModel = require('../models/keytoken.model')

const createKeyToken = async ({ userId, email }, publicKey, privateKey) => {
  const tokens = await keyTokenModel.create({
    user: userId,
    publicKey,
    privateKey
  })

  return tokens ? tokens.publicKey : null
}

module.exports = {
  createKeyToken
}