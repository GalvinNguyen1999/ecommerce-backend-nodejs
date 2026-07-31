"use strict"

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "ApiKey"
const COLLECTION_NAME = "ApiKeys"

const keySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      default: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

module.exports = model(DOCUMENT_NAME, keySchema)