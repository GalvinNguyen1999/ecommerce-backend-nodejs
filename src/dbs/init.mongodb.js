"use strict";

const mongoose = require("mongoose");
const { db: { host, port, name } } = require('../configs/config.mongdb.js')
const connectString = process.env.MONGODB;
const { countConnect } = require("../helpers/check.connect.js");

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then(() => {
        console.log(`MongoDB connected`, countConnect());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
