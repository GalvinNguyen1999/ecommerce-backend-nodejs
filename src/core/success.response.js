'use strict'

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
}

const STATUS_RESPONSE_MESSAGE = {
  OK: 'Success',
  CREATED: 'Created'
}

class SuccessResponse {
  constructor({
    message,
    reasonResponseMessage = STATUS_RESPONSE_MESSAGE.OK,
    statusCode = STATUS_CODES.OK,
    metadata = {},
    options = {}
  }) {
    this.message = message || reasonResponseMessage
    this.statusCode = statusCode
    this.metadata = metadata
    this.options = options
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({
    message,
    metadata
  }) {
    super({ message, metadata })
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    reasonResponseMessage = STATUS_RESPONSE_MESSAGE.CREATED,
    statusCode = STATUS_CODES.CREATED,
    metadata,
    options = {}
  }) {
    super({message, reasonResponseMessage, statusCode, metadata, options })
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse
}
