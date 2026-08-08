"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationv2 } = require("../../auth/authUtil");

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct),
);
router.get("", asyncHandler(productController.getAllProducts));
router.get("/:id", asyncHandler(productController.getProductById));

router.use(authenticationv2);

router.post("", asyncHandler(productController.createProduct));
router.patch("/:id", asyncHandler(productController.updateProduct));

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop),
);

router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop),
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop),
);

module.exports = router;
