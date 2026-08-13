"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { convertToObjectIdMongo } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
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
      new Date() > new Date(discount_start_date) ||
      new Date() < new Date(discount_end_date)
    ) {
      throw new BadRequestError("Invalid discount date");
    }

    // check start date is before end date
    if (new Date(discount_start_date) <= new Date(discount_end_date)) {
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
          isPublished: true,
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
          isPublished: true,
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

    return discounts;
  }

  static async getDiscountAmount({
    discount_code,
    discount_shopId,
    userId,
    products,
  }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: discount_code,
        discount_shopId: convertToObjectIdMongo(discount_shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }

    const {
      discount_is_active,
      discount_max_users,
      discount_max_users_per_user,
      discount_users_used,
      discount_type,
      discount_value,
      discount_min_order_value,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundError("Discount expired");
    }

    if (!discount_max_users) {
      throw new NotFoundError("Discount are out!");
    }

    if (
      new Date() < new Date(foundDiscount.discount_end_date) ||
      new Date() > new Date(foundDiscount.discount_start_date)
    ) {
      throw new NotFoundError("Discount expired");
    }

    let totalOrder = 0;

    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.product_quantity * product.product_price;
      }, 0);
    }

    if (totalOrder < discount_min_order_value) {
      throw new NotFoundError("Order value is less than minimum order value");
    }

    if (discount_max_users_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.user_id === userId,
      );

      if (userDiscount) {
        if (userDiscount.discount_uses_count >= discount_max_users_per_user) {
          throw new NotFoundError("You have used this discount");
        }
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);


    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ discount_code, discount_shopId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: discount_code,
      discount_shopId: convertToObjectIdMongo(discount_shopId),
    });

    if (!deleted) {
      throw new NotFoundError("Discount code not found");
    }

    return deleted;
  }

  static async cancelDiscountCode({ discount_code, discount_shopId }) {
    const updated = await discount.findOneAndUpdate(
      {
        discount_code: discount_code,
        discount_shopId: convertToObjectIdMongo(discount_shopId),
      },
      {
        $set: {
          discount_is_active: false,
          discount_max_users: -1,
          discount_users_used: [],
        },
      },
    );

    if (!updated) {
      throw new NotFoundError("Discount code not found");
    }

    return updated;
  }
}

module.exports = DiscountService;
