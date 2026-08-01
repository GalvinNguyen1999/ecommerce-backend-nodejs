'use strict'

const STATUS_CODES = {
  FORBIDDEN: 403,
  CONFLICT: 409
}

const RESPONSE_MESSAGE = {
  FORBIDDEN: 'Bad request Error',
  CONFLICT: 'Conflict Error'
}

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = RESPONSE_MESSAGE.CONFLICT, statusCode = STATUS_CODES.FORBIDDEN) {
    super(message, statusCode)
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = RESPONSE_MESSAGE.CONFLICT, statusCode = STATUS_CODES.FORBIDDEN) {
    super(message, statusCode)
  }
}

module.exports = {
  BadRequestError
}