"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, checkPermisson } = require("../auth/checkAuth");

// Check api key
router.use(apiKey);

// check permission
router.use(checkPermisson("0000"));

// routes
router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
