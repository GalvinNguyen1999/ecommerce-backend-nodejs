"use strict";

const { card } = require("../models/card.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getProductById } = require("../models/repositories/product.repo");

class CardService {
  static async createUserCard({ userId, product }) {
    const quert = {
      card_userId: userId,
      card_state: "active",
    };

    const updateOrInsert = {
      $addToSet: {
        card_products: product,
      },
    };

    const options = {
      new: true,
      upsert: true,
    };

    return await card.findOneAndUpdate(quert, updateOrInsert, options);
  }

  static async updateUserCardQuantity({ userId, product }) {
    const { product_id, quantity } = product;

    const query = {
      card_userId: userId,
      "card_products.product_id": product_id,
      card_state: "active",
    };

    const updateSet = {
      $inc: {
        "card_products.$.quantity": quantity,
      },
    };

    const options = {
      new: true,
      upsert: true,
    };

    return await card.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCard({ userId, product }) {
    const userCard = await card.findOne({
      card_userId: userId,
    });

    if (!userCard) {
      return await CardService.createUserCard({ userId, product });
    }

    if (!userCard.card_products.length) {
      userCard.card_products = [product];
      return await userCard.save();
    }

    return await CardService.updateUserCardQuantity({ userId, product });
  }

  static async addToCardV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0].item_products[0];

    const foundProduct = await getProductById({
      productId,
    });

    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }

    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError("Product not found");
    }

    return await CardService.updateUserCardQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCard({ userId, productId }) {
    const query = {
      card_userId: userId,
      card_state: "active",
    };

    const updateSet = {
      $pull: {
        card_products: {
          productId,
        },
      },
    };

    return await card.updateOne(query, updateSet);
  }

  static async getListUserCard({ userId }) {
    return await card.findOne({ card_userId: userId }).lean();
  }
}

module.exports = CardService;
