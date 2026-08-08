'use strict'

const _ = require('lodash')

const getInfoData = ({
  fields = [],
  object = {},
}) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  if (_.isEmpty(select)) {
    return {}
  }

  return Object.fromEntries(select.map(item => [item, 1]))
}

const getUnSelectData = (unSelect = []) => {
  if (_.isEmpty(unSelect)) {
    return {}
  }

  return Object.fromEntries(unSelect.map(item => [item, 0]))
}

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData
}