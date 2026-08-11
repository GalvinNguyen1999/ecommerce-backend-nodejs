const DiscountService = require("../services/discount.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class DiscountController {
  /**
   * @description Create new product
   * @param { Object } req
   * @param { Object } res
   * @returns { JSON }
   */
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Create new product success!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all discount codes by shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns { JSON }
   */
  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount codes success!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
      }),
    }).send(res);
  };

  /**
   * @description Get all discount codes with product
   * @param {Number} limit
   * @param {Number} skip
   * @returns { JSON }
   */
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount codes success!",
      metadata: await DiscountService.getAllDiscountCodesWithProdcut({
        ...req.query,
      }),
    }).send(res);
  };

  /**
   * @description Get discount amount
   * @param {Number} limit
   * @param {Number} skip
   * @returns { JSON }
   */
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount amount success!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  /**
   * @description Delete discount code
   * @param {Number} limit
   * @param {Number} skip
   * @returns { JSON }
   */
  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete discount code success!",
      metadata: await DiscountService.deleteDiscountCode({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Cancel discount code
   * @param {Number} limit
   * @param {Number} skip
   * @returns { JSON }
   */
  cancelDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Cancel discount code success!",
      metadata: await DiscountService.cancelDiscountCode({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
