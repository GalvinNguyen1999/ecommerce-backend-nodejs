'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static create = async ({ userId, publicKey, privateKey, refreshTokens, refreshTokensUsed }) => {
    try {
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokens,
        refreshTokensUsed
      }
      const options = { upsert: true, new: true }

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
        return error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean()
  }
  
  static removeByKeyId = async (keyId) => {
    return await keyTokenModel.deleteOne({ _id: keyId })
  }
}

module.exports = KeyTokenService