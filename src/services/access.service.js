"use strict";

const bcrypt = require("bcrypt");

const crypto = require("crypto");
const KeyTokenService = require("../services/keyToken.service");
const { BadRequestError, ForbiddenError } = require("../core/error.response");

const { findByEmail, createShop } = require("../services/shop.service");
const { createTokenPair, verifyToken } = require("../auth/authUtil");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async (data) => {
    // check email
    const { email, password } = data;
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError("Email not found");
    }

    // check password
    const passwordMatch = await bcrypt.compare(password, foundShop.password);
    if (!passwordMatch) {
      throw new BadRequestError("Password not match");
    }

    // cretae private key and public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // create token pair
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId: userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.create({
      refreshToken: tokens.refreshToken,
      userId: foundShop._id,
      privateKey: privateKey,
      publicKey: publicKey,
      refreshTokensUsed: [],
    });

    // return
    return {
      code: 200,
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens: tokens,
      },
    };
  };

  static signup = async (data) => {
    const { name, email, password } = data;

    const holderShop = await findByEmail(email);
    if (holderShop) {
      throw new BadRequestError("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await createShop({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );

      const keyStore = await KeyTokenService.create({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Error create key token");
      }

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens: tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeByKeyId(keyStore._id);
    console.log(`delKey:: ${JSON.stringify(delKey)}`);
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    const refreshTokenUsed =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (refreshTokenUsed) {
      const { userId, email } = await verifyToken(
        refreshToken,
        refreshTokenUsed.privateKey,
      );
      console.log(`userId, email 1:: ${userId}, ${email}`);

      await KeyTokenService.removeByUserId(userId);

      throw new ForbiddenError("Refresh token not valid");
    }

    const refreshTokenFound =
      await KeyTokenService.findByRefreshToken(refreshToken);
    if (!refreshTokenFound) throw new ForbiddenError("Shop not found 1");

    const { userId, email } = await verifyToken(
      refreshToken,
      refreshTokenFound.privateKey,
    );
    console.log(`userId, email 2:: ${userId}, ${email}`);

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new ForbiddenError("Shop not found 2");

    const tokens = await createTokenPair(
      { userId: userId, email },
      refreshTokenFound.publicKey,
      refreshTokenFound.privateKey,
    );

    await refreshTokenFound.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handleRefreshTokenv2 = async ({ refreshToken, user, keyStore }) => {
    if (!user) throw new AuthenticationError("Shop not found");

    if (keyStore.refreshToken !== refreshToken)
      throw new ForbiddenError("Refresh token not valid");

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.removeByUserId(userId);
      throw new ForbiddenError("Please login again");
    }

    const tokens = await createTokenPair(
      { userId: user.userId, email: user.email },
      keyStore.publicKey,
      keyStore.privateKey,
    );

    KeyTokenService.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId: user.userId, email: user.email },
      tokens,
    };
  };
}

module.exports = AccessService;
