"use strict";

const { Types } = require("mongoose");

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");

const { getSelectData, getUnSelectData } = require("../../utils");

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

const findAllProducts = async ({ limit, page, filter, select, sort }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unselect }) => {
  const result = await product
    .findOne({ _id: new Types.ObjectId(product_id) })
    .select(getUnSelectData(unselect))
    .lean();

  return result;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unpublishProductByShop,
  getListSearchProduct,
  findAllProducts,
  findProduct,
};
