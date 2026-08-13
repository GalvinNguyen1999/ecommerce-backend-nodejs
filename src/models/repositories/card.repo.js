"use strict";

const { convertToObjectIdMongo } = require("../../utils");
const { card } = require("../card.model");

const findCardById = async (cardId) => {
  return await card
    .findOne({ _id: convertToObjectIdMongo(cardId), card_state: "active" })
    .lean();
};

module.exports = {
  findCardById,
};
