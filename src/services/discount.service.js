"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { convertToObjectIdMongo } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodesUnSelect,
} = require("../models/repositories/discount.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_users,
      discount_uses_count,
      discount_min_order_value,
      discount_applies_to,
      discount_product_ids,
      discount_shopId,
      discount_is_active,
    } = payload;

    // discount can't be active if it's not yet started
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Invalid discount date");
    }

    // check start date is before end date
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // check discount exists
    const foundDiscount = await discount
      .findOne({
        discount_code: discount_code,
        discount_shopId: convertToObjectIdMongo(discount_shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discount.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_users,
      discount_uses_count,
      discount_min_order_value,
      discount_applies_to,
      discount_product_ids,
      discount_shopId: convertToObjectIdMongo(discount_shopId),
      discount_is_active,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProdcut({
    discount_code,
    discount_shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: discount_code,
        discount_shopId: convertToObjectIdMongo(discount_shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products = [];

    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongo(discount_shopId),
          isPublisted: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids,
          },
          isPublisted: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, discount_shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      filter: {
        discount_shopId: convertToObjectIdMongo(discount_shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      unSelect: ["__v, discount_shopId"],
      model: discount,
    });
  }
}
