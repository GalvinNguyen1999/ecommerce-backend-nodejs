"use strict";

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

module.exports = {
  insertInventory,
};
