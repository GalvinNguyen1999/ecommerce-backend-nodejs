'use strict'

const { ReasonPhrases, StatusCodes } = require('../constants/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.BadRequestError, statusCode = StatusCodes.BAD_REQUEST) {
    super(message, statusCode)
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = ReasonPhrases.ConflictError, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

class AuthenticationError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NotFoundError, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

module.exports = {
  BadRequestError,
  ConflictError,
  AuthenticationError,
  NotFoundError,
  ForbiddenError
}