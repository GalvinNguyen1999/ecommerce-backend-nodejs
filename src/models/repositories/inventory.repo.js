"use strict";

const { convertToObjectIdMongo } = require("../../utils");
const { inventory } = require("../inventory.model");

const insertInventory = async ({
  product_id,
  location = "unknown",
  shop_id,
  inven_stock,
}) => {
  const result = await inventory.create({
    inven_product: product_id,
    inven_location: location,
    inven_shopId: shop_id,
    inven_stock: inven_stock,
    invent_reservations: [],
  });

  return result;
};

const reservationInventory = async ({
  productId,
  quantity,
  cardId,
}) => {
  const query = {
    inven_productId: convertToObjectIdMongo(productId),
    inven_stock: { $gte: quantity },
  }

  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      invent_reservations: {
        cardId,
        quantity,
        createdOn: new Date(),
      },
    },
  }

  const options = { upsert: true, new: true };

  return await inventory.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory
};
