'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static create = async ({ userId, publicKey, privateKey, refreshToken, refreshTokensUsed }) => {
    try {
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        refreshToken,
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

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static removeByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId })
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken })
  }

  static updateOne = async (filter, update) => {
    return await keyTokenModel.updateOne(filter, update)
  }
}

module.exports = KeyTokenService