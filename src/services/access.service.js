'use strict'

const bcrypt = require('bcrypt')

const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { BadRequestError } = require('../core/error.response')

const { findByEmail, createShop } = require('../services/shop.service')
const { createTokenPair } = require('../auth/authUtil')
const { getInfoData } = require('../utils')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static login = async (data) => {
    // check email
    const { email, password } = data
    const foundShop = await findByEmail(email)
    if (!foundShop) {
      throw new BadRequestError('Email not found')
    }


    // check password
    const passwordMatch = await bcrypt.compare(password, foundShop.password)
    if (!passwordMatch) {
      throw new BadRequestError('Password not match')
    }

    // cretae private key and public key
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // create token pair
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId: userId, email }, publicKey, privateKey)
  
    await KeyTokenService.create({
      userId: userId,
      publicKey,
      privateKey,
      refreshTokens: tokens.refreshTokens
    })
    
    // return
    return {
      code: 200,
      metadata: {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
        tokens: tokens
      }
    }
  }
  
  static signup = async (data) => {
    const { name, email, password } = data

    const holderShop = await findByEmail(email)
    if (holderShop) {
      throw new BadRequestError('Email already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await createShop({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    })

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      const keyStore = await KeyTokenService.create({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if (!keyStore) {
        throw new BadRequestError('Error create key token')
      }

      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens: tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
  }
}

module.exports = AccessService