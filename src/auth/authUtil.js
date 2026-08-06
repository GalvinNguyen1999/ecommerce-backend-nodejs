"use strict";

const JWT = require("jsonwebtoken");
const {
  AuthenticationError,
  NotFoundError,
} = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(`err:: ${err}`);
      } else {
        console.log(`decoded:: ${decoded}`);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    next(error);
  }
};

const authentication = async (req, res, next) => {
  try {
    const userId = req.headers[HEADERS.CLIENT_ID];
    if (!userId) throw new AuthenticationError("Invalid client id");

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Key not found");

    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken) throw new AuthenticationError("Invalid access token");

    const decoded = JWT.verify(accessToken, keyStore.privateKey);
    if (userId !== decoded.userId)
      throw new AuthenticationError("Invalid user id");

    req.keyStore = keyStore;
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (token, privateKey) => {
  return await JWT.verify(token, privateKey);
};

module.exports = {
  HEADERS,
  createTokenPair,
  authentication,
  verifyToken,
};
