"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findCardById } = require("../models/repositories/card.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const order = require("../models/order.model");
const { acquireLock } = require("./redis.service");

/* 
  {
    cardId: "5f6d0c8d1c5c4a6e0a5e8a7d",
    shopId: "5f6d0c8d1c5c4a6e0a5e8a7d",
    shop_order_ids: [
      {
        shopid,
        shop_discount: [{ codeId }],
        item_products: [{ price, quantity, productId,  }],
      },
      {
        shopid,
        shop_discount: [{ codeId }],
        item_products: [{ price, quantity, productId,  }],
      }
    ]
  }
 */
class CheckoutService {
  static async checkoutReview({ userId, cardId, shopId, shop_order_ids }) {
    // step 1 check card exist
    const foundCard = await findCardById(cardId);
    if (!foundCard) {
      throw new NotFoundError("Cart not found");
    }

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids_new = [];

    // check products exist from database
    for (let i = 0; i < shop_order_ids.length; i++) {
      // get total price original products
      const { shop_discount = [], item_products = [] } = shop_order_ids[i];

      // check products exist
      const checkProducts = await checkProductByServer(item_products);
      if (!checkProducts[0]) throw new BadRequestError("Order wrong");

      // get total price products
      const checkoutPrice = checkProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      checkout_order.totalPrice = +checkoutPrice;

      const itemCheckout = {
        shopid: shopId,
        shop_discount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProducts,
      };

      // check discount
      if (shop_discount.length > 0) {
        const { discount = 0, totalPrice = 0 } = await getDiscountAmount({
          discount_shopId: shopId,
          discount_code: shop_discount[0].codeId,
          userId,
          products: checkProducts.map((p) => ({
            ...p,
            product_quantity: p.quantity,
            product_price: p.price,
          })),
        });

        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // add to total checkout
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      checkout_order,
      shop_order_ids,
      shop_order_ids_new,
    };
  }

  static async orderByUser({ userId, cardId, shopId, shop_order_ids }) {
    // find info checkout
    const { checkout_order, shop_order_ids_new } = await this.checkoutReview({
      userId,
      cardId,
      shopId,
      shop_order_ids,
    });

    // check inventory
    const products = shop_order_ids_new.flatMap((order) => order.item_products);

    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const key = await acquireLock(productId, quantity, cardId);
      acquireProduct.push(key ? true: false);

      if (key) {
        await releaseLock(key);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Order wrong");
    }
    
    // create order
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // update card


    return newOrder;
  }

  static async getOrderByUser() {}
  static async getOneOrderByUser() {}
  static async cancelOrderByUser() {}
  static async updaelOrderStatusByShop() {}
}

module.exports = CheckoutService;
