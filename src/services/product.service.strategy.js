"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

const {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unpublishProductByShop,
  getListSearchProduct,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { removeNullOrUndefined, updateNestedObject } = require("../utils");

class ProductFactory {
  static productRegistry = {};

  static registerProduct(type, product) {
    this.productRegistry[type] = product;
  }

  static async createProduct(type, payload) {
    const product = this.productRegistry[type];
    if (!product) {
      throw new BadRequestError("Product Type Not Found");
    }

    return new product(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const product = this.productRegistry[type];
    if (!product) {
      throw new BadRequestError("Product Type Not Found");
    }

    return new product(payload).updateProduct(product_id, payload);
  }

  static async getAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async getAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isPublished: true,
    };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_id, product_shop }) {
    return await publishProductByShop({ product_id, product_shop });
  }

  static async unpublishProductByShop({ product_id, product_shop }) {
    return await unpublishProductByShop({ product_id, product_shop });
  }

  static async getListSearchProduct({ keySearch }) {
    return await getListSearchProduct({ keySearch });
  }

  static async getAllProducts({
    limit = 50,
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_shop", "product_type"],
    sort = "ctime",
  }) {
    return await findAllProducts({
      limit,
      page,
      filter,
      select,
      sort,
    });
  }

  static async getProduct({ id, unselect = ["__v"] }) {
    return await findProduct({ product_id: id, unselect });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProdcut =  await product.create({
      ...this,
      _id: product_id,
    });

    if (!newProdcut) throw new BadRequestError("Create Product Failed");

    if (newProdcut) {
      // add product_stock in inventory collection
      await insertInventory({
        product_id: newProdcut._id,
        location: "unknown",
        shop_id: newProdcut.product_shop,
        inven_stock: newProdcut.product_quantity,
      });
    }
    
    return newProdcut;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      product_id: productId,
      bodyUpdate,
      model: product,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create Clothing Failed");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create Product Failed");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeNullOrUndefined(this);

    if (objectParams.product_attributes) {
      const product_attributes = removeNullOrUndefined(
        objectParams.product_attributes,
      );

      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObject(product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams),
    );

    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Create Electronic Failed");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create Product Failed");

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create Furniture Failed");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create Product Failed");

    return newProduct;
  }
}

ProductFactory.registerProduct("Clothing", Clothing);
ProductFactory.registerProduct("Electronic", Electronic);
ProductFactory.registerProduct("Furniture", Furniture);

module.exports = ProductFactory;
