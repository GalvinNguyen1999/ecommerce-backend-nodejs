const ProductService = require("../services/product.service");
const ProductServicev2 = require("../services/product.service.strategy");
const { CREATED, SuccessResponse } = require("../core/success.response");

class ProductController {
  // createProduct = async (req, res, next) => {
  //   new CREATED({
  //     message: "Create new product success!",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId,
  //     }),
  //   }).send(res);
  // };

  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new product success!",
      metadata: await ProductServicev2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all drafts for shop
   * @param {Number} limit 
   * @param {Number} skip
   * @returns { JSON }
   */
  getAllDraftsForShop = async (req, res, next) => {
    new CREATED({
      message: "Get list draft success!",
      metadata: await ProductServicev2.getAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
