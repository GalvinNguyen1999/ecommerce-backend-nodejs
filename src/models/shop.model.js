"use strict"

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "Shop"
const COLLECTION_NAME = "Shops"

const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

module.exports = model(DOCUMENT_NAME, shopSchema)