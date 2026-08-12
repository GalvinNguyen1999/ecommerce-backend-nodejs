"use strict";

const { card } = require("../models/card.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

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
}

module.exports = CardService;
