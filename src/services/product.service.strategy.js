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
  getListSearchProduct
} = require("../models/repositories/product.repo");

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
    return await product.create({
      ...this,
      _id: product_id,
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
