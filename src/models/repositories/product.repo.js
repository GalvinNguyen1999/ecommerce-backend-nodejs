"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip);
};

module.exports = {
  findAllDraftsForShop,
};
