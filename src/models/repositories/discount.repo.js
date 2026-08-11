"use strict";

const { getUnSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodesSelect = async ({
  filter,
  limit = 50,
  sort = "ctime",
  page = 1,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const findAllDiscountCodesUnSelect = async ({
  filter,
  limit = 50,
  sort = "ctime",
  page = 1,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return documents;
};

const checkDiscountExist = async ({ filter, model }) => {
  const document = await model.findOne(filter).lean();
  return document;
};

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExist
};
