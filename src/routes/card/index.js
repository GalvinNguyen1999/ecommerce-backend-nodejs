"use strict";

const express = require("express");
const cardController = require("../../controllers/card.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationv2 } = require("../../auth/authUtil");

router.post("", asyncHandler(cardController.addToCard));
router.post("/update", asyncHandler(cardController.udpate));
router.delete("", asyncHandler(cardController.delete));
router.get("", asyncHandler(cardController.listToCard));

module.exports = router;
