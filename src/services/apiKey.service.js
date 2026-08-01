'use strict'

const ApiKeyModel = require('../models/apiKey.model')

const findByKey = async (key) => {
    return await ApiKeyModel.findOne({ key }).lean()
}

module.exports = {
  findByKey
}