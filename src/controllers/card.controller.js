const CardService = require("../services/card.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class CardController {
  addToCard = async (req, res, next) => {
    new CREATED({
      message: "Add to card success!",
      metadata: await CardService.addToCard({
        ...req.body,
      }),
    }).send(res);
  };

  udpate = async (req, res, next) => {
    new CREATED({
      message: "Update card success!",
      metadata: await CardService.addToCardV2({
        ...req.body,
      }),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete card success!",
      metadata: await CardService.deleteUserCard({
        ...req.body,
      }),
    }).send(res);
  };

  listToCard = async (req, res, next) => {
    new SuccessResponse({
      message: "List card success!",
      metadata: await CardService.getListUserCard({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new CardController();
