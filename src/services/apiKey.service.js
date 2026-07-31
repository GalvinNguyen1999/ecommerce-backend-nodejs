'use strict'

const ApiKeyModel = require('../models/apiKey.model')

class ApiKeyService {
  static async create({ key, permissions }) {
    return await ApiKeyModel.create({
      key,
      permissions,
    })
  }

  static findByKey(key) {
    return ApiKeyModel.findOne({ key, status: true }).lean()
  }
}

module.exports = ApiKeyService