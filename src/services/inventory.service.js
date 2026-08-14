"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { inventory }= require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "unknown",
  }) {
    const foundProduct = await getProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }

    const query = { inven_productId: productId, inven_shopId: shopId };

    const updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };

    const options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
