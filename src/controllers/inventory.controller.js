const InventoryService = require("../services/inventory.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new CREATED({
      message: "Inventory success!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
