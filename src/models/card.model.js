"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Card";
const COLLECTION_NAME = "Cards";

const cardSchema = new Schema(
  {
    card_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
    },
    card_products: {
      type: Array,
      required: true,
      default: [],
    },
    card_count_number: {
      type: Number,
      default: 0,
    },
    card_userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: {
      createAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  },
);

module.exports = {
  card: model(DOCUMENT_NAME, cardSchema),
};
