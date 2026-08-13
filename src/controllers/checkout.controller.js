const CheckoutService = require("../services/checkout.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new CREATED({
      message: "Checkout success!",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
