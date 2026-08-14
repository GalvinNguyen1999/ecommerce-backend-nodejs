"use strict";

const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationv2 } = require("../../auth/authUtil");

router.use(authenticationv2);
router.post("", asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
