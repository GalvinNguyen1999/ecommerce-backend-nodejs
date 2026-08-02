'use strict'

const shopModel = require('../models/shop.model')

const findByEmail = async (email) => {
  return await shopModel.findOne({ email }).lean()
}

const createShop = async (data) => {
  return await shopModel.create(data)
}

module.exports = {
  findByEmail,
  createShop
}