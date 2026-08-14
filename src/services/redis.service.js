'use strict';

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.expire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cardId) => {
  const key = `lock_v2026_${productId}`
  const retryTimes = 10;
  const expireTime = 60 * 1000;

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      // check inventory
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cardId,
      })

      if (isReversation.isModified()) {
        await pexpire(key, expireTime);
        return key
      }
      
      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

const releaseLock = async (key) => {
  const deleteKey = promisify(redisClient.del).bind(redisClient);
  return await deleteKey(key);
}

module.exports = {
  acquireLock,
  releaseLock
}
