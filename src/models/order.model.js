"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const OrderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      required: true,
    },
    order_shipping: {
      type: Object,
      default: {}
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: {
      type: Array,
      rerquired: true,
    },
    order_trackingNumber: {
      type: String,
      default: "#0000111222121"
    },
    order_status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled", "delivered"],
      default: "pending",
    }
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, OrderSchema);
