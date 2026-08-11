"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  if (_.isEmpty(select)) {
    return {};
  }

  return Object.fromEntries(select.map((item) => [item, 1]));
};

const getUnSelectData = (unSelect = []) => {
  if (_.isEmpty(unSelect)) {
    return {};
  }

  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};

const removeNullOrUndefined = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};

const updateNestedObject = (obj) => {
  const final = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObject(obj[key]);

      Object.keys(response).forEach((responseKey) => {
        final[`${key}.${responseKey}`] = response[responseKey];
      });
    } else {
      final[key] = obj[key];
    }
  });

  return final;
};

const convertToObjectIdMongo = (id) => new Types.ObjectId(id);

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeNullOrUndefined,
  updateNestedObject,
  convertToObjectIdMongo
};
