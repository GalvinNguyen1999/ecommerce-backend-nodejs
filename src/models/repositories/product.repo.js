"use strict";

const { Types } = require("mongoose");

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip);
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_id, product_shop }) => {
  const result = await product.updateOne(
    {
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop),
    },
    {
      $set: {
        isDraft: false,
        isPublished: true,
      },
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return {
    matched: result.matchedCount,
    modified: result.modifiedCount,
  };
};

const unpublishProductByShop = async ({ product_id, product_shop }) => {
  const result = await product.updateOne(
    {
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop),
    },
    {
      $set: {
        isDraft: true,
        isPublished: false,
      },
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return {
    matched: result.matchedCount,
    modified: result.modifiedCount,
  };
};

const getListSearchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);

  const results = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unpublishProductByShop,
  getListSearchProduct,
};
