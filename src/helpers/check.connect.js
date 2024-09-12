"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

const countConnect = () => {
  const numberConnect = mongoose.connections.length;
  console.log(`Number connect::${numberConnect}`);
};

const checkOverLoad = () => {
  setInterval(() => {
    const numberConnect = mongoose.connections.length;
    const numCores = os.cpus().length; 
    const memoryUsage = process.memoryUsage().rss; // In bytes
    const maxConnections = numCores * 5;

    // console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);

    if (numberConnect > maxConnections) {
      console.log(`Connection over load::${numberConnect}`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverLoad,
};
